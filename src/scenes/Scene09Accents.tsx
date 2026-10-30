import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Lock} from '../components/Icons';
import {Lines, TreeEdge, TreeNode} from '../components/Tree';
import {fadeUp, mix, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s09');

// Deterministic pseudo-waveform.
const BARS = Array.from({length: 84}, (_, i) => {
  const v = Math.abs(Math.sin(i * 0.61) * Math.cos(i * 0.23) + 0.35 * Math.sin(i * 1.7));
  return 0.15 + 0.85 * Math.min(1, v);
});

// One illustrative line: what was said vs what the system heard.
const SAID = ['the', 'bus', 'to', 'Llanelli', 'leaves', 'at', 'half', 'past'];
const HEARD = [
  {w: 'the'},
  {w: 'bus'},
  {w: 'to'},
  {w: 'clan', wrong: true},
  {w: 'elly', wrong: true},
  {w: 'leaves'},
  {w: 'at'},
  {w: 'half'},
  {w: 'past'},
];

const Waveform: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('The benchmark is real recordings');
  const draw = prog(frame, at, 40);
  const W = 960;
  const H = 110;
  const bw = W / BARS.length;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 120, top: 270}}>
      {BARS.map((b, i) => {
        const visible = i / BARS.length <= draw;
        const h = b * H;
        return (
          <rect
            key={i}
            x={i * bw + 1}
            y={(H - h) / 2}
            width={bw - 4}
            height={h}
            rx={2}
            fill={colors.muted}
            opacity={visible ? 1 : 0}
          />
        );
      })}
    </svg>
  );
};

const Transcript: React.FC<{frame: number}> = ({frame}) => {
  const checkedAt = cue('with transcripts checked by a person');
  const werAt = cue('scored by word error rate');
  const wrong = prog(frame, werAt, 20);
  const row = (label: string, children: React.ReactNode, start: number) => (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 14, ...fadeUp(frame, start, 20)}}>
      <span style={{width: 150, fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted}}>{label}</span>
      <span style={{fontSize: type.small, display: 'flex', gap: 12}}>{children}</span>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 120, top: 400}}>
      {row(
        'checked',
        SAID.map((w, i) => <span key={i}>{w}</span>),
        checkedAt,
      )}
      {row(
        'heard',
        HEARD.map((h, i) => (
          <span
            key={i}
            style={{
              color: h.wrong && wrong > 0.5 ? colors.accent : colors.text,
              textDecoration: h.wrong && wrong > 0.5 ? 'underline' : 'none',
              textUnderlineOffset: 8,
            }}
          >
            {h.w}
          </span>
        )),
        checkedAt + 12,
      )}
    </div>
  );
};

const WerCard: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('scored by word error rate');
  return (
    <div
      style={{
        position: 'absolute',
        left: 1200,
        top: 270,
        width: 600,
        boxSizing: 'border-box',
        padding: '20px 26px',
        borderRadius: 12,
        border: `2px solid ${colors.line}`,
        backgroundColor: colors.panel,
        ...fadeUp(frame, at, 24),
      }}
    >
      <Eyebrow>Hard score</Eyebrow>
      <div style={{fontSize: 36, fontWeight: 600, marginTop: 8}}>Word error rate</div>
      <div style={{fontSize: type.caption, color: colors.muted, marginTop: 4}}>share of words the system gets wrong</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 14, ...fadeUp(frame, at + 20, 20)}}>
        <span style={{fontSize: 56, fontWeight: 600, color: colors.accent}}>25%</span>
        <span style={{fontSize: type.caption, color: colors.muted}}>this line: 2 errors in 8 words</span>
      </div>
    </div>
  );
};

const PIPE_Y = 640;
const Pipeline: React.FC<{frame: number}> = ({frame}) => {
  const at = cue("The council can't retrain the speech model");
  const evolveAt = cue('so it evolves the step after it');
  const evolve = prog(frame, evolveAt, 20);
  const box = (label: string, sub: string, left: number, start: number, accent = 0) => (
    <div
      style={{
        position: 'absolute',
        left,
        top: PIPE_Y - 50,
        width: 290,
        height: 100,
        boxSizing: 'border-box',
        padding: '0 22px',
        borderRadius: 12,
        border: `2px solid ${accent > 0.5 ? colors.accent : colors.line}`,
        backgroundColor: colors.panel,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...fadeUp(frame, start, 24),
      }}
    >
      <div style={{fontSize: type.small, fontWeight: 600}}>{label}</div>
      <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: accent > 0.5 ? colors.accent : colors.muted}}>
        {sub}
      </div>
    </div>
  );
  return (
    <>
      <Lines>
        {[
          [410, 470],
          [760, 820],
        ].map(([x1, x2], i) => (
          <g key={i} opacity={prog(frame, at + 10 + i * 8, 20)}>
            <line x1={x1} x2={x2 - 8} y1={PIPE_Y} y2={PIPE_Y} stroke={colors.muted} strokeWidth={2.5} />
            <path d={`M ${x2 - 16} ${PIPE_Y - 8} L ${x2 - 6} ${PIPE_Y} L ${x2 - 16} ${PIPE_Y + 8}`} fill="none" stroke={colors.muted} strokeWidth={2.5} />
          </g>
        ))}
      </Lines>
      {box('Speech model', 'fixed', 120, at)}
      {box('Correction step', evolve > 0.5 ? 'evolves' : 'corrects, interprets', 470, at + 8, evolve)}
      {box('Answer', 'the reply', 820, at + 16)}
    </>
  );
};

// The same generation tree, now scored on WER (lower is better). Illustrative.
const TREE_Y = 830;
const WerTree: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('so it evolves the step after it', 0.6);
  const nodes = [
    {x: 270, label: 'G0', wer: '18%'},
    {x: 570, label: 'G1', wer: '15%'},
    {x: 870, label: 'G2', wer: '13%'},
  ];
  return (
    <>
      <Lines>
        {nodes.slice(1).map((n, i) => (
          <TreeEdge
            key={n.label}
            from={[nodes[i].x, TREE_Y]}
            to={[n.x, TREE_Y]}
            draw={prog(frame, at + 12 + i * 14, 20)}
            kept={1}
          />
        ))}
      </Lines>
      {nodes.map((n, i) => (
        <TreeNode key={n.label} x={n.x} y={TREE_Y} label={n.label} score={n.wer} appear={prog(frame, at + i * 14, 20)} kept={1} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: TREE_Y - 18,
          fontSize: type.caption,
          color: colors.muted,
          ...fadeUp(frame, at + 40, 20),
        }}
      >
        WER, lower is better
      </div>
    </>
  );
};

const Speakers: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('Some speakers are held back');
  const lockAt = cue('as unseen tests');
  const held = new Set([2, 7, 9]);
  return (
    <div style={{position: 'absolute', left: 1360, top: 560, width: 440, ...fadeUp(frame, at, 24)}}>
      <Eyebrow>Speakers</Eyebrow>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 92px)', gap: 14, marginTop: 14}}>
        {Array.from({length: 12}).map((_, i) => {
          const locked = held.has(i) ? prog(frame, lockAt + i, 16) : 0;
          return (
            <div
              key={i}
              style={{
                height: 72,
                boxSizing: 'border-box',
                borderRadius: 10,
                border: `2px solid ${locked > 0.5 ? colors.accent : colors.line}`,
                backgroundColor: colors.panel,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.mono,
                fontSize: type.caption,
                color: colors.muted,
              }}
            >
              {locked > 0.5 ? <Lock size={30} color={colors.accent} /> : `S${i + 1}`}
            </div>
          );
        })}
      </div>
      <div style={{fontSize: type.caption, color: colors.accent, marginTop: 14, ...fadeUp(frame, lockAt + 20, 20, 6)}}>
        held out as unseen tests
      </div>
    </div>
  );
};

export const Scene09Accents: React.FC = () => {
  const frame = useCurrentFrame();
  const closeAt = cue('If AI hears some accents worse');
  const close = prog(frame, closeAt, 30);
  return (
    <SceneFrame sceneId="s09">
      <div style={{position: 'absolute', inset: 0, opacity: mix(1, 0.12, close)}}>
        <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
          <Eyebrow>Beyond code · future application</Eyebrow>
          <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6, ...fadeUp(frame, cue('Take speech recognition'), 24)}}>
            Speech recognition, Welsh accent
          </div>
        </div>
        <Waveform frame={frame} />
        <Transcript frame={frame} />
        <WerCard frame={frame} />
        <Pipeline frame={frame} />
        <WerTree frame={frame} />
        <Speakers frame={frame} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 440,
          width: 1680,
          fontSize: type.heading,
          fontWeight: 600,
          lineHeight: 1.2,
          ...fadeUp(frame, closeAt + 10, 30),
        }}
      >
        Accents heard worse mean <span style={{color: colors.accent}}>worse answers</span> for whole regions.
      </div>
      <Caption>Illustrative example and numbers.</Caption>
    </SceneFrame>
  );
};
