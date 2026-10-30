import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Lock} from '../components/Icons';
import {Lines, NODE_H, TREE_ROOT, TreeEdge, TreeNode} from '../components/Tree';
import {fadeUp, mix, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s03');

const ROW = 440;
// Illustrative generation tree for rename-cli.
const N = {
  G0: [TREE_ROOT[0], TREE_ROOT[1]] as [number, number],
  G1a: [560, ROW] as [number, number],
  G1b: [560, 680] as [number, number],
  G2: [860, ROW] as [number, number],
  G3: [1160, ROW] as [number, number],
  G4: [1460, ROW] as [number, number],
};

/** Counts a score up from `from` to `to` once it starts. */
const countTo = (frame: number, start: number, from: number, to: number, decimals = 0) => {
  const v = interpolate(frame, [start, start + 24], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return frame < start ? '–' : v.toFixed(decimals);
};

const HeldOut: React.FC<{x: number; value: number; start: number; frame: number; accent?: boolean}> = ({
  x,
  value,
  start,
  frame,
  accent,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 150,
      width: 300,
      whiteSpace: 'nowrap',
      top: ROW + NODE_H / 2 + 14,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      fontFamily: fonts.mono,
      fontSize: type.caption,
      color: accent ? colors.accent : colors.muted,
      ...fadeUp(frame, start, 20, 10),
    }}
  >
    <Lock size={26} color={accent ? colors.accent : colors.muted} />
    held-out {value}
  </div>
);

const Tree: React.FC<{frame: number}> = ({frame}) => {
  const tryAt = cue('Each generation starts');
  const judgeAt = cue('A judge runs fixed tests');
  const keepAt = cue('If the score rises');
  const discardAt = cue("If not, it's discarded");
  const g2At = cue('A second set of tests', -0.6);
  const lockAt = cue('never shown to the agents', -0.3);
  const g3At = cue('The run stops when');
  const g4At = cue('improve by less than');
  const bracketAt = cue('about two percent');
  const capAt = cue('or a cap is hit');
  const heldAt = cue('The winner scores best');
  const winnerAt = cue("which isn't always the last version", -0.3);

  const keep = prog(frame, keepAt, 20);
  const discard = prog(frame, discardAt, 20);
  const g2 = prog(frame, g2At, 24);
  const g3 = prog(frame, g3At, 24);
  const g4 = prog(frame, g4At, 24);
  const ring = prog(frame, winnerAt, 24);

  return (
    <>
      <Lines>
        <TreeEdge from={N.G0} to={N.G1a} draw={prog(frame, tryAt, 24)} kept={keep} />
        <TreeEdge from={N.G0} to={N.G1b} draw={prog(frame, tryAt + 6, 24)} discard={discard} />
        <TreeEdge from={N.G1a} to={N.G2} draw={g2} kept={g2} />
        <TreeEdge from={N.G2} to={N.G3} draw={g3} kept={g3} />
        <TreeEdge from={N.G3} to={N.G4} draw={g4} kept={g4} />
        {/* Plateau bracket over G3–G4 */}
        <g opacity={prog(frame, bracketAt, 20)}>
          <path
            d={`M ${N.G3[0] - 100} 360 V 344 H ${N.G4[0] + 100} V 360`}
            fill="none"
            stroke={colors.muted}
            strokeWidth={2}
          />
        </g>
      </Lines>

      <TreeNode x={N.G0[0]} y={N.G0[1]} label="G0" score="62" sub="baseline" appear={1} kept={1} />
      <TreeNode
        x={N.G1a[0]}
        y={N.G1a[1]}
        label="G1a"
        score={countTo(frame, judgeAt, 0, 68)}
        appear={prog(frame, tryAt + 10, 24)}
        kept={keep}
      />
      <TreeNode
        x={N.G1b[0]}
        y={N.G1b[1]}
        label="G1b"
        score={countTo(frame, judgeAt + 4, 0, 60)}
        appear={prog(frame, tryAt + 16, 24)}
        discard={discard}
      />
      <TreeNode x={N.G2[0]} y={N.G2[1]} label="G2" score="71" appear={g2} kept={g2} />
      <TreeNode x={N.G3[0]} y={N.G3[1]} label="G3" score="72.1" sub="+1.5%" appear={g3} kept={g3} ring={ring} />
      <TreeNode
        x={N.G4[0]}
        y={N.G4[1]}
        label="G4"
        score="72.9"
        sub="+1.1%"
        appear={g4}
        kept={g4}
        dim={prog(frame, winnerAt, 24)}
      />

      {/* Judge verdicts */}
      <div
        style={{
          position: 'absolute',
          left: N.G1b[0] + 124,
          top: N.G1b[1] - 20,
          fontFamily: fonts.mono,
          fontSize: type.caption,
          color: colors.muted,
          ...fadeUp(frame, discardAt, 20),
        }}
      >
        judge: 60 &lt; 62 → discard
      </div>
      <div
        style={{
          position: 'absolute',
          left: N.G1a[0] - 100,
          top: N.G1a[1] - NODE_H / 2 - 48,
          fontFamily: fonts.mono,
          fontSize: type.caption,
          color: colors.accent,
          ...fadeUp(frame, keepAt, 20),
          opacity: prog(frame, keepAt, 20) * (1 - prog(frame, g3At, 20)),
        }}
      >
        68 &gt; 62 → keep
      </div>

      {/* Stopping rule */}
      <div
        style={{
          position: 'absolute',
          left: (N.G3[0] + N.G4[0]) / 2 - 400,
          width: 800,
          whiteSpace: 'nowrap',
          top: 290,
          textAlign: 'center',
          fontSize: type.caption,
          ...fadeUp(frame, bracketAt, 20),
        }}
      >
        stop: 2 generations under 2%
        <span style={{color: colors.muted, opacity: prog(frame, capAt, 20)}}> · or a cap is hit</span>
      </div>

      {/* Held-out panel */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '16px 24px',
          borderRadius: 12,
          border: `2px solid ${colors.line}`,
          backgroundColor: colors.panel,
          ...fadeUp(frame, lockAt, 24),
        }}
      >
        <Lock size={40} color={colors.text} />
        <div>
          <div style={{fontSize: type.small, fontWeight: 600}}>Held-out tests</div>
          <div style={{fontSize: type.caption, color: colors.muted}}>never shown to agents</div>
        </div>
      </div>

      <HeldOut x={N.G2[0]} value={70} start={heldAt} frame={frame} />
      <HeldOut x={N.G3[0]} value={71} start={heldAt + 8} frame={frame} accent={ring > 0.5} />
      <HeldOut x={N.G4[0]} value={68} start={heldAt + 16} frame={frame} />
      <div
        style={{
          position: 'absolute',
          left: N.G3[0] - 250,
          width: 500,
          top: ROW + NODE_H / 2 + 62,
          textAlign: 'center',
          fontSize: type.caption,
          color: colors.accent,
          ...fadeUp(frame, winnerAt + 10, 20),
        }}
      >
        winner = best held-out score
      </div>
    </>
  );
};

// Illustrative size sweep. Quality flattens; tokens grow steadily.
const SWEEP = [
  {size: 2, quality: 52, tokens: 20},
  {size: 4, quality: 70, tokens: 40},
  {size: 6, quality: 78, tokens: 60},
  {size: 8, quality: 80, tokens: 80},
  {size: 10, quality: 81, tokens: 100},
];
const BASE = 900;
const BAR_W = 56;
const groupX = (i: number) => 520 + i * 220;

const SizeSweep: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const markerAt = cue('the optimum is where');
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 120, top: 548, ...fadeUp(frame, start, 24)}}>
        <Eyebrow>Same run, different council sizes</Eyebrow>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 40}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: type.caption}}>
            <div style={{width: 24, height: 24, backgroundColor: colors.text, borderRadius: 3}} />
            quality
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: type.caption, color: colors.muted}}>
            <div style={{width: 24, height: 24, backgroundColor: colors.line, borderRadius: 3}} />
            tokens
          </div>
        </div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={460} x2={1460} y1={BASE} y2={BASE} stroke={colors.line} strokeWidth={2} />
        {SWEEP.map((s, i) => {
          const p = prog(frame, start + 8 + i * 5, 26);
          const qh = s.quality * 3.2 * p;
          const th = s.tokens * 3.0 * p;
          const x = groupX(i);
          return (
            <g key={s.size}>
              <rect x={x - BAR_W - 4} y={BASE - qh} width={BAR_W} height={qh} fill={colors.text} rx={3} />
              <rect x={x + 4} y={BASE - th} width={BAR_W} height={th} fill={colors.line} rx={3} />
            </g>
          );
        })}
        <line
          x1={groupX(2)}
          x2={groupX(2)}
          y1={BASE}
          y2={mix(BASE, 560, prog(frame, markerAt, 30))}
          stroke={colors.accent}
          strokeWidth={3}
          strokeDasharray="8 8"
        />
      </svg>
      {SWEEP.map((s, i) => (
        <div
          key={s.size}
          style={{
            position: 'absolute',
            left: groupX(i) - 40,
            width: 80,
            top: BASE + 12,
            textAlign: 'center',
            fontFamily: fonts.mono,
            fontSize: type.caption,
            color: i === 2 && prog(frame, markerAt, 30) > 0.5 ? colors.accent : colors.muted,
            opacity: prog(frame, start + 8 + i * 5, 26),
          }}
        >
          {s.size}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: groupX(2) + 22,
          top: 548,
          fontSize: type.caption,
          color: colors.accent,
          ...fadeUp(frame, markerAt + 20, 24),
        }}
      >
        optimum: the next reviewer costs more than it adds
      </div>
    </div>
  );
};

export const Scene03Evolution: React.FC = () => {
  const frame = useCurrentFrame();
  const sweepAt = cue('Across council sizes', -0.3);
  const shrink = prog(frame, sweepAt, 36);

  return (
    <SceneFrame sceneId="s03">
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
        <Eyebrow>rename-cli</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Generation tree</div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '960px 100px',
          transform: `scale(${mix(1, 0.55, shrink)}) translateY(${mix(0, 40, shrink)}px)`,
          opacity: mix(1, 0.35, shrink),
        }}
      >
        <Tree frame={frame} />
      </div>

      {shrink > 0 && <SizeSweep frame={frame} start={sweepAt + 10} />}

      <Caption>Illustrative numbers. The experiment hasn't run yet.</Caption>
    </SceneFrame>
  );
};
