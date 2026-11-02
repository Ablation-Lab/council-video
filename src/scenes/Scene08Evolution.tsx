import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Lock} from '../components/Icons';
import {Lines, NODE_H, TREE_ROOT, TreeEdge, TreeNode} from '../components/Tree';
import {Card, Citation, Heading, PartMarker, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s08');

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
const countTo = (frame: number, start: number, from: number, to: number) => {
  const v = interpolate(frame, [start, start + 24], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return frame < start ? '–' : v.toFixed(0);
};

const HeldOut: React.FC<{x: number; value: number; start: number; frame: number; accent?: boolean}> = ({x, value, start, frame, accent}) => (
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
  const tryAt = cue('a few council variants');
  const judgeAt = cue('A judge runs fixed tests');
  const keepAt = cue('If the score rises');
  const discardAt = cue("If not, it's discarded");
  const g2At = cue('A second set of tests', -0.6);
  const lockAt = cue('never shown to the agents', -0.3);
  // The stopping rule isn't narrated; it plays out between the two sentences.
  const g3At = cue('never shown to the agents', 1.0);
  const g4At = cue('The winner scores best', -0.5);
  const bracketAt = cue('The winner scores best', -0.1);
  const capAt = bracketAt + 12;
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
        <g opacity={prog(frame, bracketAt, 20)}>
          <path d={`M ${N.G3[0] - 100} 360 V 344 H ${N.G4[0] + 100} V 360`} fill="none" stroke={colors.muted} strokeWidth={2} />
        </g>
      </Lines>

      <TreeNode x={N.G0[0]} y={N.G0[1]} label="G0" score="62" sub="baseline" appear={1} kept={1} />
      <TreeNode x={N.G1a[0]} y={N.G1a[1]} label="G1a" score={countTo(frame, judgeAt, 0, 68)} appear={prog(frame, tryAt + 10, 24)} kept={keep} />
      <TreeNode x={N.G1b[0]} y={N.G1b[1]} label="G1b" score={countTo(frame, judgeAt + 4, 0, 60)} appear={prog(frame, tryAt + 16, 24)} discard={discard} />
      <TreeNode x={N.G2[0]} y={N.G2[1]} label="G2" score="71" appear={g2} kept={g2} />
      <TreeNode x={N.G3[0]} y={N.G3[1]} label="G3" score="72.1" sub="+1.5%" appear={g3} kept={g3} ring={ring} />
      <TreeNode x={N.G4[0]} y={N.G4[1]} label="G4" score="72.9" sub="+1.1%" appear={g4} kept={g4} dim={prog(frame, winnerAt, 24)} />

      <div style={{position: 'absolute', left: N.G1b[0] + 124, top: N.G1b[1] - 20, fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, ...fadeUp(frame, discardAt, 20)}}>
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
          opacity: prog(frame, keepAt, 20) * (1 - prog(frame, g3At, 20)),
        }}
      >
        68 &gt; 62 → keep
      </div>

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

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 120,
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
          <div style={{fontSize: type.caption, color: colors.muted}}>a second, secret set</div>
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

// What one generation is, shown as it's defined.
const STEPS = [
  {text: 'councils review', at: 'a few council variants review'},
  {text: 'author fixes', at: 'an author agent fixes'},
  {text: 'best carries forward', at: 'and the best one carries forward'},
  {text: '+ small changes', at: 'with small changes'},
];

const GenerationStrip: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: 'absolute', left: 120, top: 806, display: 'flex', alignItems: 'center', gap: 12, opacity: prog(frame, cue('Each generation is one round'), 20)}}>
    <Eyebrow style={{color: colors.text, marginRight: 6}}>1 generation =</Eyebrow>
    {STEPS.map((st, i) => (
      <React.Fragment key={st.text}>
        {i > 0 && <span style={{color: colors.muted, fontSize: type.small, opacity: prog(frame, cue(st.at), 14)}}>→</span>}
        <div
          style={{
            height: 60,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 30,
            border: `2px solid ${i === 2 ? colors.accent : colors.line}`,
            color: i === 2 ? colors.accent : colors.text,
            fontSize: type.caption,
            whiteSpace: 'nowrap',
            ...fadeUp(frame, cue(st.at), 18, 8),
          }}
        >
          {st.text}
        </div>
      </React.Fragment>
    ))}
  </div>
);

/* ---------- What a brief is ---------- */

const Brief: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const labelAt = cue("A brief isn't just a label");
  const realAt = cue("It's real instructions");
  const checkAt = cue('what to check');
  const showAt = cue('how to show a problem');
  const labelsAt = cue("Labels alone don't reliably help");
  const vsAt = cue('briefs against no briefs');
  return (
    <>
      <Heading eyebrow="One thing that changes" title="Each reviewer's brief" frame={frame} start={start} />
      <Card dashed style={{left: 120, top: 320, width: 640, height: 300, ...fadeUp(frame, labelAt, 24)}}>
        <Eyebrow>Just a label</Eyebrow>
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            marginTop: 30,
            color: frame >= realAt ? colors.muted : colors.text,
            textDecoration: frame >= realAt + 10 ? 'line-through' : 'none',
          }}
        >
          “You're a security expert.”
        </div>
      </Card>
      <Card accent style={{left: 800, top: 320, width: 1000, height: 300, ...fadeUp(frame, realAt, 24)}}>
        <Eyebrow style={{color: colors.accent}}>Real instructions</Eyebrow>
        <div style={{fontSize: type.small, marginTop: 26, ...fadeUp(frame, checkAt, 18, 6)}}>
          <span style={{fontFamily: fonts.mono, color: colors.muted}}>check · </span>input paths, privileges, secrets in logs
        </div>
        <div style={{fontSize: type.small, marginTop: 20, ...fadeUp(frame, showAt, 18, 6)}}>
          <span style={{fontFamily: fonts.mono, color: colors.muted}}>prove · </span>a failing test, or exact steps to reproduce
        </div>
      </Card>
      <div style={{position: 'absolute', left: 120, top: 690, fontSize: type.body, ...fadeUp(frame, labelsAt, 24)}}>
        Labels alone don't reliably help, research suggests.
      </div>
      <div style={{position: 'absolute', left: 120, top: 780, display: 'flex', alignItems: 'center', gap: 20, ...fadeUp(frame, vsAt, 20)}}>
        <span style={{fontSize: type.small, color: colors.muted}}>So we also test</span>
        <span style={{fontSize: type.small, fontWeight: 600, color: colors.accent}}>briefs vs no briefs</span>
      </div>
      <Citation title="When “A Helpful Assistant” Is Not Really Helpful" who="Zheng et al., 2024" opacity={prog(frame, labelsAt, 20)} />
    </>
  );
};

/* ---------- Control for evolution ---------- */

const Control: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const otherwiseAt = cue('Otherwise');
  return (
    <>
      <Heading eyebrow="Does evolution really help?" title="A control" frame={frame} start={start} />
      <Card accent style={{left: 120, top: 340, width: 800, height: 280, ...fadeUp(frame, cue('we compare an evolving council'), 24)}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>Evolving council</div>
        <div style={{fontSize: type.small, color: colors.muted, marginTop: 14}}>changes each generation</div>
      </Card>
      <div style={{position: 'absolute', left: 920, width: 80, top: 440, textAlign: 'center', fontSize: type.body, color: colors.muted, ...fadeUp(frame, cue('against one that gets'), 20)}}>vs</div>
      <Card style={{left: 1000, top: 340, width: 800, height: 280, ...fadeUp(frame, cue('against one that gets'), 24)}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>Same council, not evolving</div>
        <div style={{fontSize: type.small, color: colors.accent, marginTop: 14, ...fadeUp(frame, cue('the same number of review rounds'), 18, 6)}}>same number of rounds</div>
        <div style={{fontSize: type.small, color: colors.accent, marginTop: 8, ...fadeUp(frame, cue('and the same spend'), 18, 6)}}>same spend</div>
      </Card>
      <div style={{position: 'absolute', left: 120, top: 700, fontSize: type.body, ...fadeUp(frame, otherwiseAt, 24)}}>
        Otherwise “it got better” might just mean <span style={{color: colors.accent}}>“it spent more”.</span>
      </div>
    </>
  );
};

export const Scene08Evolution: React.FC = () => {
  const frame = useCurrentFrame();
  const briefAt = cue("One thing that changes is each reviewer's brief");
  const judgeAt = cue('A judge runs fixed tests');
  const controlAt = cue('And to show evolution really helps');
  const tree = phase(frame, 0, briefAt) + (frame >= judgeAt - 16 ? phase(frame, judgeAt, controlAt) : 0);
  return (
    <SceneFrame sceneId="s08">
      <PartMarker part={2} frame={frame} />
      {tree > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: tree}}>
          <Heading eyebrow="rename-cli" title="Generation tree" frame={frame} start={0} />
          <Tree frame={frame} />
          {frame < briefAt && <GenerationStrip frame={frame} />}
          <Caption>Illustrative numbers. The experiment hasn't run yet.</Caption>
        </div>
      )}
      {frame >= briefAt - 10 && frame < judgeAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, briefAt, judgeAt)}}>
          <Brief frame={frame} start={briefAt} />
        </div>
      )}
      {frame >= controlAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, controlAt)}}>
          <Control frame={frame} start={controlAt} />
        </div>
      )}
    </SceneFrame>
  );
};
