"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+=<>/\\";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

interface ScrambleTextProps {
  text: string;
  /** Increment this value to replay the scramble-in animation. */
  trigger: number;
  onComplete?: () => void;
  speed?: number;
  revealDelay?: number;
  className?: string;
}

export function ScrambleText({
  text,
  trigger,
  onComplete,
  speed = 40,
  revealDelay = 70,
  className,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let revealedCount = 0;

    const renderFrame = () =>
      text
        .split("")
        .map((char, i) => (char === " " ? " " : i < revealedCount ? char : randomGlyph()))
        .join("");

    const scrambleId = setInterval(() => setDisplay(renderFrame()), speed);
    const revealId = setInterval(() => {
      revealedCount += 1;
      if (revealedCount >= text.length) {
        clearInterval(scrambleId);
        clearInterval(revealId);
        setDisplay(text);
        onCompleteRef.current?.();
      } else {
        setDisplay(renderFrame());
      }
    }, revealDelay);

    return () => {
      clearInterval(scrambleId);
      clearInterval(revealId);
    };
  }, [text, trigger, speed, revealDelay]);

  return <span className={className}>{display}</span>;
}
