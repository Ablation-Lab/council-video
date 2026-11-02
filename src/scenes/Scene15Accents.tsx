import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Lines, TreeEdge, TreeNode} from '../components/Tree';
import {Card, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s15');

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
  const at = cue('Take speech recognition');
  const draw = prog(frame, at, 40);
  const W = 960;
  const H = 110;
  const bw = W / BARS.length;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 120, top: 330}}>
      {BARS.map((b, i) => {
        const visible = i / BARS.length < draw;
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
  const checkedAt = cue('and a Welsh accent', 1.0);
  const werAt = cue('and a Welsh accent', 2.2);
  const wrong = prog(frame, werAt, 20);
  const row = (label: string, children: React.ReactNode, start: number) => (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 14, ...fadeUp(frame, start, 20)}}>
      <span style={{width: 150, fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted}}>{label}</span>
      <span style={{fontSize: type.small, display: 'flex', gap: 12}}>{children}</span>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 120, top: 480}}>
      {row(
        'said',
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

const PIPE_Y = 400;
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
const TREE_Y = 660;
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
        errors, lower is better
      </div>
    </>
  );
};

export const Scene15Accents: React.FC = () => {
  const frame = useCurrentFrame();
  const closeAt = cue('If AI hears some accents worse');
  const pipeAt = cue("The council can't retrain the speech model");
  const askAt = cue('Does a council correct speech');
  return (
    <SceneFrame sceneId="s15">
      {/* The whole scene is labelled as future work. */}
      <div style={{position: 'absolute', right: 120, top: 40, fontFamily: fonts.mono, fontSize: type.caption, letterSpacing: 3, color: colors.accent, opacity: prog(frame, 0, 24)}}>
        FUTURE WORK
      </div>
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, closeAt)}}>
        <div style={{position: 'absolute', left: 120, top: 84}}>
          <Eyebrow style={{...fadeUp(frame, 0, 24)}}>The same method, beyond code</Eyebrow>
          <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6, ...fadeUp(frame, 6, 24)}}>
            Speech recognition, Welsh accent
          </div>
        </div>
        <Waveform frame={frame} />
        <Transcript frame={frame} />
        <Caption>Illustrative example.</Caption>
      </div>
      {frame >= closeAt - 10 && frame < pipeAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, closeAt, pipeAt)}}>
          <div style={{position: 'absolute', left: 120, top: 420, width: 1680, fontSize: type.heading, fontWeight: 600, lineHeight: 1.2, ...fadeUp(frame, closeAt, 30)}}>
            Accents heard worse can mean <span style={{color: colors.accent}}>worse answers</span> for whole regions.
          </div>
        </div>
      )}
      {frame >= pipeAt - 10 && frame < askAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, pipeAt, askAt)}}>
          <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, pipeAt, 30)}}>
            <Eyebrow>The speech model stays fixed</Eyebrow>
            <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>The step after it evolves</div>
          </div>
          <Pipeline frame={frame} />
          <WerTree frame={frame} />
          <Caption>Illustrative numbers.</Caption>
        </div>
      )}
      {frame >= askAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, askAt)}}>
          <div style={{position: 'absolute', left: 120, top: 360, display: 'flex', alignItems: 'center', gap: 36, ...fadeUp(frame, askAt, 24)}}>
            <Card style={{position: 'relative', width: 520}}>
              <div style={{fontSize: type.body, fontWeight: 600}}>One model</div>
              <div style={{fontSize: type.caption, color: colors.muted, marginTop: 8}}>corrects the speech</div>
            </Card>
            <div style={{fontSize: type.body, color: colors.muted}}>vs</div>
            <Card accent style={{position: 'relative', width: 520}}>
              <div style={{fontSize: type.body, fontWeight: 600}}>A council</div>
              <div style={{fontSize: type.caption, color: colors.accent, marginTop: 8}}>corrects it differently?</div>
            </Card>
          </div>
          <div style={{position: 'absolute', left: 120, top: 640, fontSize: type.body, color: colors.muted, ...fadeUp(frame, cue('A follow-up experiment'), 20)}}>
            A follow-up experiment would test that.
          </div>
        </div>
      )}
    </SceneFrame>
  );
};
