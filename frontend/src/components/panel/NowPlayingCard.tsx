"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getNowPlaying } from "@/lib/api";
import type { SpotifyTrack } from "@/types/portfolio";

const POLL_INTERVAL_MS = 15000;

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function NowPlayingCard() {
  const { t } = useLanguage();
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getNowPlaying();
        if (!cancelled) setTrack(data.name ? (data as SpotifyTrack) : null);
      } catch {
        if (!cancelled) setTrack(null);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const hasProgress = track && track.progress_ms != null && track.duration_ms != null;
  const progressPct = hasProgress ? (track!.progress_ms! / track!.duration_ms!) * 100 : 0;

  return (
    <GlassCard className="panel-now">
      <div className="panel-cover">
        {track?.album_art && <Image src={track.album_art} alt={track.name} fill className="object-cover" />}
      </div>
      <div className="panel-now-info">
        <div className="pico">
          {track?.is_playing && <span className="panel-live-dot" />}
          {track?.is_playing ? t.panel.nowPlayingLive : t.panel.nowPlayingIdle}
          {track?.is_playing && (
            <span className="panel-eq">
              <span />
              <span />
              <span />
              <span />
            </span>
          )}
        </div>
        <div className="panel-now-track">
          {!loaded ? t.panel.loading : track ? track.name : t.panel.nowPlayingEmpty}
        </div>
        {track && <div className="panel-now-artist">{track.artists.join(", ")}</div>}
        {hasProgress && (
          <>
            <div className="panel-prog">
              <i style={{ width: `${progressPct}%` }} />
            </div>
            <div className="panel-times">
              <span>{formatTime(track!.progress_ms!)}</span>
              <span>{formatTime(track!.duration_ms!)}</span>
            </div>
          </>
        )}
      </div>
    </GlassCard>
  );
}
