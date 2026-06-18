"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

interface LogoItem {
  name: string;
  file: string;
  color: string;
}

const LOGOS: LogoItem[] = [
  { name: "Python", file: "python_logo_icon_168886.png", color: "#3776AB" },
  { name: "Django", file: "django_plain_logo_icon_146558.png", color: "#3DA644" },
  { name: "JavaScript", file: "javascript_icon_130900.png", color: "#F0DB4F" },
  { name: "TypeScript", file: "file_type_typescript_official_icon_130107.png", color: "#3178C6" },
  { name: "React", file: "react_original_logo_icon_146374.png", color: "#61DAFB" },
  { name: "Next.js", file: "next_js_logo_icon_145038.png", color: "#5AC8FA" },
  { name: "Tailwind CSS", file: "file_type_tailwind_icon_130128.png", color: "#38BDF8" },
  { name: "PostgreSQL", file: "postgresql_plain_wordmark_logo_icon_146390.png", color: "#4169E1" },
  { name: "Git", file: "file_type_git_icon_130581.png", color: "#F05032" },
  { name: "GitHub", file: "github-logo_icon-icons.com_73546.png", color: "#8957E5" },
  { name: "Figma", file: "figma_logo_icon_147289.png", color: "#F24E1E" },
  { name: "Selenium", file: "selenium_logo_icon_249659.png", color: "#43B02A" },
];

// faixa duplicada pra permitir um loop infinito sem costura
const TRACK = [...LOGOS, ...LOGOS];

const AUTO_SPEED = 0.05; // px/ms

export function SkillsCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const trackHalfWidth = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    function measure() {
      trackHalfWidth.current = (trackRef.current?.scrollWidth ?? 0) / 2;
    }
    measure();
    window.addEventListener("resize", measure);

    let frameId: number;
    let prevTime = performance.now();

    function frame(now: number) {
      const dt = Math.min(now - prevTime, 50);
      prevTime = now;

      if (!dragging.current) {
        offset.current += AUTO_SPEED * dt + velocity.current * dt;
        velocity.current *= 0.92;
      }

      const half = trackHalfWidth.current;
      if (half > 0) {
        offset.current = ((offset.current % half) + half) % half;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-offset.current}px)`;
      }
      frameId = requestAnimationFrame(frame);
    }

    frameId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", measure);
    };
  }, []);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offset.current;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocity.current = 0;
    viewportRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const delta = e.clientX - dragStartX.current;
    offset.current = dragStartOffset.current - delta;

    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) velocity.current = -(e.clientX - lastX.current) / dt;
    lastX.current = e.clientX;
    lastTime.current = now;
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    viewportRef.current?.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      ref={viewportRef}
      className="carousel-viewport"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className="carousel-track">
        {TRACK.map((logo, i) => (
          <div key={`${logo.name}-${i}`} className="carousel-item" style={{ "--glow": logo.color } as CSSProperties}>
            <div className="carousel-logo-wrap">
              <Image
                src={`/image/${logo.file}`}
                alt={logo.name}
                width={48}
                height={48}
                draggable={false}
                className="carousel-logo"
              />
            </div>
            <span className="carousel-label">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
