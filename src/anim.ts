import {Easing, interpolate} from 'remotion';
import type {CSSProperties} from 'react';

// Gentle in-out curve used for nearly every move in the film.
export const ease = Easing.bezier(0.45, 0, 0.25, 1);

/** Eased 0→1 progress between `start` and `start + duration` frames. */
export const prog = (frame: number, start: number, duration = 24): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Fade in while rising a few pixels. */
export const fadeUp = (
  frame: number,
  start: number,
  duration = 24,
  distance = 14,
): CSSProperties => {
  const p = prog(frame, start, duration);
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`};
};

/** Prefix of `text` revealed by a typewriter effect at ~30 chars/s. */
export const typed = (
  text: string,
  frame: number,
  start: number,
  charsPerSecond = 30,
  fps = 30,
): string => {
  const n = Math.max(0, Math.floor(((frame - start) / fps) * charsPerSecond));
  return text.slice(0, n);
};
