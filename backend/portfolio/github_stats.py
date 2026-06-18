from datetime import timedelta

import requests
from django.conf import settings
from django.utils import timezone

from .models import GitHubStats

API_BASE = "https://api.github.com"

# Aproximação grosseira: o GitHub não expõe "linhas de código" pela API,
# só bytes por linguagem. Esse valor é só pra converter bytes -> linhas estimadas.
BYTES_PER_LINE_ESTIMATE = 45

# Por quanto tempo o cache local é considerado "fresco" antes de buscar de novo.
STATS_TTL = timedelta(hours=6)


def _headers():
    headers = {"Accept": "application/vnd.github+json"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    return headers


def _get_all_repos(username):
    repos = []
    page = 1
    while True:
        resp = requests.get(
            f"{API_BASE}/users/{username}/repos",
            headers=_headers(),
            params={"per_page": 100, "page": page, "type": "owner"},
            timeout=15,
        )
        resp.raise_for_status()
        batch = resp.json()
        if not batch:
            break
        repos.extend(batch)
        page += 1
    return repos


def _get_total_commits(username):
    resp = requests.get(
        f"{API_BASE}/search/commits",
        headers=_headers(),
        params={"q": f"author:{username}"},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json().get("total_count", 0)


def _get_languages(username, repo_name):
    resp = requests.get(
        f"{API_BASE}/repos/{username}/{repo_name}/languages",
        headers=_headers(),
        timeout=15,
    )
    if resp.status_code != 200:
        return {}
    return resp.json()


def fetch_github_stats(username):
    repos = [r for r in _get_all_repos(username) if not r.get("fork")]
    total_commits = _get_total_commits(username)
    total_stars = sum(r.get("stargazers_count", 0) for r in repos)

    language_bytes = {}
    for repo in repos:
        for lang, byte_count in _get_languages(username, repo["name"]).items():
            language_bytes[lang] = language_bytes.get(lang, 0) + byte_count

    total_bytes = sum(language_bytes.values())
    languages_pct = (
        {lang: round(b / total_bytes * 100, 1) for lang, b in language_bytes.items()} if total_bytes else {}
    )
    languages_pct = dict(sorted(languages_pct.items(), key=lambda kv: kv[1], reverse=True))

    return {
        "total_commits": total_commits,
        "total_repos": len(repos),
        "total_stars": total_stars,
        "estimated_lines": total_bytes // BYTES_PER_LINE_ESTIMATE,
        "languages": languages_pct,
    }


def refresh_stats():
    """Busca dados frescos no GitHub e atualiza o cache local. Retorna o registro atualizado."""
    data = fetch_github_stats(settings.GITHUB_USERNAME)
    stats, _ = GitHubStats.objects.get_or_create(pk=1)
    stats.total_commits = data["total_commits"]
    stats.total_repos = data["total_repos"]
    stats.total_stars = data["total_stars"]
    stats.estimated_lines = data["estimated_lines"]
    stats.languages = data["languages"]
    stats.save()
    return stats


def get_or_refresh_stats():
    """Retorna o cache local, atualizando primeiro se estiver vencido ou ausente.

    Se a busca falhar (GitHub fora do ar, rate limit, etc.), devolve o cache
    antigo em vez de propagar o erro — o painel mostra o último dado válido.
    """
    stats = GitHubStats.objects.first()
    is_stale = not stats or (timezone.now() - stats.updated_at) > STATS_TTL

    if is_stale and settings.GITHUB_USERNAME:
        try:
            stats = refresh_stats()
        except requests.exceptions.RequestException:
            pass

    return stats
