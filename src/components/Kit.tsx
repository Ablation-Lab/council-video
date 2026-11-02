import React from 'react';
import {Eyebrow} from './SceneFrame';
import {fadeUp, prog} from '../anim';
import {colors, fonts, layout, type} from '../theme';

/** Scene heading: small eyebrow over a large title, top left. */
export const Heading: React.FC<{eyebrow: string; title: React.ReactNode; frame: number; start: number}> = ({
  eyebrow,
  title,
  frame,
  start,
}) => (
  <div style={{position: 'absolute', left: layout.margin, top: 84, ...fadeUp(frame, start, 30)}}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>{title}</div>
  </div>
);

const PARTS = {
  1: 'Do councils beat one agent?',
  2: 'Can they evolve?',
} as const;

/** Top-right marker for the part of the film a scene belongs to. */
export const PartMarker: React.FC<{part: 1 | 2; frame: number}> = ({part, frame}) => (
  <div
    style={{
      position: 'absolute',
      right: layout.margin,
      top: 40,
      fontFamily: fonts.mono,
      fontSize: type.caption,
      letterSpacing: 2,
      color: colors.muted,
      whiteSpace: 'nowrap',
      opacity: prog(frame, 0, 24),
    }}
  >
    <span style={{color: colors.accent}}>QUESTION {part}</span> · {PARTS[part]}
  </div>
);

/** Amber outlined label, e.g. HYPOTHESIS or EXAMPLE. Positioned by `style`. */
export const Tag: React.FC<{children: React.ReactNode; style?: React.CSSProperties; fill?: number}> = ({
  children,
  style,
  fill = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      right: layout.margin,
      top: 96,
      padding: '10px 20px',
      borderRadius: 8,
      border: `2px solid ${colors.accent}`,
      backgroundColor: `rgba(242,165,65,${0.22 * fill})`,
      fontFamily: fonts.mono,
      fontSize: type.caption,
      letterSpacing: 3,
      color: colors.accent,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Muted, dashed pill for a caveat that sits beside a claim. */
export const Caveat: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 60,
      padding: '0 24px',
      borderRadius: 30,
      border: `2px dashed ${colors.muted}`,
      color: colors.muted,
      fontSize: type.caption,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rounded panel. */
export const Card: React.FC<{children: React.ReactNode; accent?: boolean; dashed?: boolean; style?: React.CSSProperties}> = ({
  children,
  accent,
  dashed,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      boxSizing: 'border-box',
      padding: '22px 28px',
      borderRadius: 14,
      border: `2px ${dashed ? 'dashed' : 'solid'} ${accent ? colors.accent : colors.line}`,
      backgroundColor: colors.panel,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Published research, cited on screen as short title · author, year. Sits
 * bottom right, where captions go; full links are in the README.
 */
export const Citation: React.FC<{title?: string; who: string; prefix?: string; opacity: number; bottom?: number}> = ({
  title,
  who,
  prefix,
  opacity,
  // Above the chapter tag's line, so a long citation never runs into it.
  bottom = 112,
}) => (
  <div
    style={{
      position: 'absolute',
      right: layout.margin,
      bottom,
      maxWidth: 1200,
      textAlign: 'right',
      fontSize: type.caption,
      fontStyle: 'italic',
      color: colors.muted,
      lineHeight: 1.35,
      opacity,
    }}
  >
    {prefix ? `${prefix} ` : ''}
    {title ? `“${title}” · ` : ''}
    {who}
  </div>
);

/** Large single statement, for a slide that makes one point. */
export const Statement: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: layout.margin,
      width: 1680,
      fontSize: type.heading,
      fontWeight: 600,
      lineHeight: 1.2,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Fades a phase in at `start` and out before `end` (both in frames). */
export const phase = (frame: number, start: number, end = Infinity, fadeIn = 16, fadeOut = 16) =>
  prog(frame, start - fadeIn / 2, fadeIn) * (Number.isFinite(end) ? 1 - prog(frame, end - fadeOut, fadeOut) : 1);
