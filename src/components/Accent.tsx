// Style rule for the two-part film: things arrive with a brief amber
// highlight, then settle to their normal colour. One calm pulse per element
// (about 2 s), never a repeated flash. The main number or word of a slide
// simply stays amber and needs none of this.
import React from 'react';
import {Easing, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

const RISE = 10;
const HOLD = 14;
const SETTLE = 36;

/** 0 → 1 → 0: the highlight's strength for an element that enters at `at`. */
export const glow = (frame: number, at: number) =>
  interpolate(frame, [at, at + RISE, at + RISE + HOLD, at + RISE + HOLD + SETTLE], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });

/** `base` colour, briefly amber after `at`. */
export const glowColor = (frame: number, at: number, base: string) =>
  interpolateColors(glow(frame, at), [0, 1], [base, colors.accent]);

/** Box border that lights amber on entry, then returns to grey. */
export const glowBorder = (frame: number, at: number, base: string = colors.line) =>
  `2px solid ${glowColor(frame, at, base)}`;

/** Text that comes on in amber and settles to `base` (default: the text colour). */
export const Flash: React.FC<{at: number; base?: string; children: React.ReactNode}> = ({at, base = colors.text, children}) => {
  const frame = useCurrentFrame();
  return <span style={{color: glowColor(frame, at, base)}}>{children}</span>;
};
