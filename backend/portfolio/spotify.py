from urllib.parse import urlencode

import requests
from django.conf import settings

from .models import SpotifyAuth

TOKEN_URL = "https://accounts.spotify.com/api/token"
AUTHORIZE_URL = "https://accounts.spotify.com/authorize"
API_BASE = "https://api.spotify.com/v1"
SCOPES = "user-read-currently-playing user-read-recently-played"


def build_authorize_url():
    params = {
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "scope": SCOPES,
    }
    return f"{AUTHORIZE_URL}?{urlencode(params)}"


def exchange_code_for_tokens(code):
    response = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        },
        auth=(settings.SPOTIFY_CLIENT_ID, settings.SPOTIFY_CLIENT_SECRET),
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def get_access_token():
    auth = SpotifyAuth.objects.first()
    if not auth:
        return None

    response = requests.post(
        TOKEN_URL,
        data={"grant_type": "refresh_token", "refresh_token": auth.refresh_token},
        auth=(settings.SPOTIFY_CLIENT_ID, settings.SPOTIFY_CLIENT_SECRET),
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()

    # O Spotify pode rotacionar o refresh_token; persistimos se vier um novo.
    if data.get("refresh_token"):
        auth.refresh_token = data["refresh_token"]
        auth.save(update_fields=["refresh_token"])

    return data["access_token"]


def _track_payload(track, is_playing, played_at=None, progress_ms=None):
    if not track:
        return None
    images = track.get("album", {}).get("images") or []
    return {
        "name": track.get("name"),
        "artists": [a["name"] for a in track.get("artists", [])],
        "album_art": images[0]["url"] if images else None,
        "url": track.get("external_urls", {}).get("spotify"),
        "is_playing": is_playing,
        "played_at": played_at,
        "progress_ms": progress_ms,
        "duration_ms": track.get("duration_ms"),
    }


def get_now_playing():
    access_token = get_access_token()
    if not access_token:
        return None

    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(f"{API_BASE}/me/player/currently-playing", headers=headers, timeout=10)

    if resp.status_code == 200 and resp.content:
        data = resp.json()
        if data.get("item"):
            return _track_payload(
                data["item"], is_playing=data.get("is_playing", False), progress_ms=data.get("progress_ms")
            )

    # Nada tocando agora — cai pro último item do histórico recente.
    resp = requests.get(
        f"{API_BASE}/me/player/recently-played",
        headers=headers,
        params={"limit": 1},
        timeout=10,
    )
    resp.raise_for_status()
    items = resp.json().get("items") or []
    if not items:
        return None
    return _track_payload(items[0]["track"], is_playing=False, played_at=items[0].get("played_at"))
