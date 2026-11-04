import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, layout, type} from '../theme';
import {FPS} from '../timing';
import type {Section, TimedBeat} from './beats';

const FADE = 12;

/** Plays every recorded beat of a section at its place in the timeline. */
const SectionAudio: React.FC<{section: Section}> = ({section}) => (
  <>
    {section.beats
      .filter((b) => b.take)
      .map((b) => {
        const take = b.take!;
        const from = Math.round(take.fromS * FPS);
        const to = Math.round(take.toS * FPS);
        const len = to - from;
        // One-frame ramps at cut points (they sit in measured silence). A span that
        // starts or ends with its file keeps the file's own fade instead.
        const rampIn = take.fromS > 0;
        const rampOut = take.cutOut ?? true;
        return (
          <Sequence key={b.id} from={b.startF} durationInFrames={len} name={`Audio ${b.id}`} layout="none">
            <Audio
              src={staticFile(take.src)}
              trimBefore={from}
              trimAfter={to}
              volume={(f) => (rampIn && f === 0) || (rampOut && f >= len - 1) ? 0 : 1}
            />
          </Sequence>
        );
      })}
  </>
);

/** Splits a line into caption chunks at sentence ends and colons. Returns word-index ranges. */
const chunks = (b: TimedBeat) => {
  const out: {from: number; to: number}[] = [];
  let from = 0;
  let chars = 0;
  b.words.forEach((w, i) => {
    chars += w.text.length + 1;
    // Keep each caption to about one line: break at sentence ends and colons, and at commas once it's long.
    if (/[.?!:]$/.test(w.text) || (/,$/.test(w.text) && chars >= 35) || i === b.words.length - 1) {
      chars = 0;
      out.push({from, to: i});
      from = i + 1;
    }
  });
  return out;
};

/**
 * Timed caption for a line that hasn't been recorded yet, so the section can
 * be previewed at its real pace without a synthetic voice.
 */
const PlaceholderCaptions: React.FC<{section: Section}> = ({section}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const b = section.beats.find((x) => x.placeholder && t >= x.words[0].startS - 0.1 && t <= x.endF / FPS + 0.3);
  if (!b) return null;
  const chunk = chunks(b).find((c, i, all) => t < (all[i + 1] ? b.words[all[i + 1].from].startS - 0.05 : Infinity)) ?? chunks(b)[0];
  const text = b.words.slice(chunk.from, chunk.to + 1).map((w) => w.text).join(' ');
  const startF = Math.round(b.words[chunk.from].startS * FPS);
  const opacity = interpolate(frame, [startF - 4, startF + 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 260,
        right: 260,
        bottom: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 20,
          letterSpacing: 2,
          color: colors.muted,
          border: `1px dashed ${colors.muted}`,
          borderRadius: 6,
          padding: '3px 10px',
        }}
      >
        NOT RECORDED · {b.line}
      </div>
      <div
        style={{
          maxWidth: 1400,
          textAlign: 'center',
          fontSize: 34,
          lineHeight: 1.35,
          color: colors.text,
          backgroundColor: 'rgba(11,13,16,0.85)',
          padding: '8px 20px',
          borderRadius: 8,
          opacity,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Background, section label, edge fades, recorded audio and placeholder captions for a section. */
export const SectionFrame: React.FC<{
  section: Section;
  number: string;
  title: string;
  hideLabel?: boolean;
  children: React.ReactNode;
}> = ({section, number, title, hideLabel, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const opacity = interpolate(frame, [0, FADE, durationInFrames - FADE, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg, fontFamily: fonts.sans, color: colors.text}}>
      <AbsoluteFill style={{opacity}}>
        {children}
        <div
          style={{
            position: 'absolute',
            left: layout.margin,
            bottom: 64,
            fontFamily: fonts.mono,
            fontSize: type.caption,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.muted,
            opacity: hideLabel ? 0 : 1,
          }}
        >
          <span style={{color: colors.accent}}>{number}</span>
          <span style={{margin: '0 14px', color: colors.line}}>/</span>
          {title}
        </div>
        <PlaceholderCaptions section={section} />
      </AbsoluteFill>
      <SectionAudio section={section} />
    </AbsoluteFill>
  );
};
