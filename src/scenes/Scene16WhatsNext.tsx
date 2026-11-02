import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Lines, TreeEdge, TreeNode} from '../components/Tree';
import {Heading, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s16');

/* ---------- Simpler alternatives, and three more checks ---------- */

const ALTERNATIVES = [
  {text: 'linters and security scanners', at: 'traditional code-checking tools'},
  {text: 'one AI thinking for longer', at: 'letting one AI think'},
  {text: 'hand-tuned briefs', at: 'hand-tuned briefs'},
  {text: 'reviewing in stages', at: 'and reviewing in stages'},
];
const CHECKS = [
  {text: 'Do fixes actually land?', at: 'whether fixes actually land'},
  {text: 'Only worth it on hard or high-risk code?', at: 'whether councils only pay off'},
  {text: "What if reviewers see each other's findings?", at: 'and what happens if reviewers'},
];

const Pill: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      height: 84,
      padding: '0 30px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: 42,
      border: `2px solid ${colors.line}`,
      backgroundColor: colors.panel,
      fontSize: type.small,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

const Alternatives: React.FC<{frame: number}> = ({frame}) => {
  const checksAt = cue('And we check three more things');
  return (
    <>
      <Heading eyebrow="We also test" title="Simpler alternatives" frame={frame} start={0} />
      <div style={{position: 'absolute', left: 120, top: 300, width: 1680, display: 'flex', flexWrap: 'wrap', gap: 20}}>
        {ALTERNATIVES.map((a) => (
          <Pill key={a.text} style={fadeUp(frame, cue(a.at), 18, 8)}>
            {a.text}
          </Pill>
        ))}
      </div>
      <Eyebrow style={{position: 'absolute', left: 120, top: 540, ...fadeUp(frame, checksAt, 20)}}>And three more checks</Eyebrow>
      <div style={{position: 'absolute', left: 120, top: 590, width: 1680, display: 'flex', flexWrap: 'wrap', gap: 20}}>
        {CHECKS.map((c) => (
          <Pill key={c.text} style={{borderStyle: 'dashed', color: colors.muted, ...fadeUp(frame, cue(c.at), 18, 8)}}>
            {c.text}
          </Pill>
        ))}
      </div>
      <div style={{position: 'absolute', left: 120, top: 820, fontSize: type.small, color: colors.accent, ...fadeUp(frame, cue('These will be discussed more'), 20)}}>
        More in the research write-up
      </div>
    </>
  );
};

/* ---------- Back to the pilot: its limits ---------- */

const LIMITS = [
  {text: 'one app; the pilot ran only once', at: 'Its limits'},
  {text: 'built and tested on Linux, never on Windows', at: 'It was built and tested on Linux'},
  {text: 'reviewers kept some saved memory', at: 'Its reviewers kept some saved memory'},
  {text: 'council size never changed', at: 'And the council size never changed'},
];

const Limits: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const variesAt = cue('which the formal experiment will vary');
  const varies = prog(frame, variesAt, 20);
  return (
    <>
      <Heading eyebrow="Back to the pilot" title="Informal, but its numbers are real" frame={frame} start={start} />
      <Eyebrow style={{position: 'absolute', left: 120, top: 300, ...fadeUp(frame, cue('Its limits'), 20)}}>Pilot limits</Eyebrow>
      <div style={{position: 'absolute', left: 120, top: 350, width: 1680}}>
        {LIMITS.map((l, i) => {
          const last = i === LIMITS.length - 1;
          return (
            <div
              key={l.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                height: 96,
                marginBottom: 14,
                padding: '0 28px',
                borderRadius: 12,
                border: `2px solid ${last && varies > 0.5 ? colors.accent : colors.line}`,
                backgroundColor: colors.panel,
                fontSize: type.body,
                ...fadeUp(frame, cue(l.at), 18, 8),
              }}
            >
              <span style={{fontFamily: fonts.mono, fontSize: type.small, color: colors.muted}}>0{i + 1}</span>
              <span style={{color: last && varies > 0.5 ? colors.accent : colors.text}}>
                {last && varies > 0.5 ? 'council size → varied in the formal experiment' : l.text}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- End card ---------- */

const DELIVERABLES = [
  {title: 'GitHub repo', sub: 'public now: the plan, pilot results and the video source', at: 'The GitHub repo is public'},
  {title: 'Write-up', sub: 'after the runs: results, and why each council is set up as it is', at: 'and the write-up'},
  {title: 'Raw run logs', sub: 'after the runs: every run, so anyone can check', at: 'raw run logs will be'},
];

// A faint generation tree behind the end card.
const GhostTree: React.FC = () => {
  const n: Record<string, [number, number]> = {
    G0: [460, 160],
    G1a: [760, 100],
    G1b: [760, 240],
    G2: [1060, 100],
    G3: [1360, 100],
  };
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 0.12}}>
      <Lines>
        <TreeEdge from={n.G0} to={n.G1a} draw={1} kept={1} />
        <TreeEdge from={n.G0} to={n.G1b} draw={1} discard={1} />
        <TreeEdge from={n.G1a} to={n.G2} draw={1} kept={1} />
        <TreeEdge from={n.G2} to={n.G3} draw={1} kept={1} />
      </Lines>
      {Object.entries(n).map(([k, [x, y]]) => (
        <TreeNode key={k} x={x} y={y} label={k} appear={1} kept={k === 'G1b' ? 0 : 1} discard={k === 'G1b' ? 1 : 0} />
      ))}
    </div>
  );
};

export const EndCard: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <>
    <div style={{opacity: prog(frame, start, 40)}}>
      <GhostTree />
    </div>
    <div style={{position: 'absolute', left: 120, top: 330, ...fadeUp(frame, start + 6, 30)}}>
      <Eyebrow>Public now, and after the runs</Eyebrow>
      <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Evolving Review Councils</div>
    </div>
    <div style={{position: 'absolute', left: 120, top: 500, display: 'flex', gap: 30}}>
      {DELIVERABLES.map((d, i) => (
        <div
          key={d.title}
          style={{
            width: 540,
            boxSizing: 'border-box',
            padding: '22px 26px',
            borderRadius: 12,
            border: `2px solid ${i === 0 ? colors.accent : colors.line}`,
            backgroundColor: colors.panel,
            ...fadeUp(frame, cue(d.at), 24),
          }}
        >
          <div style={{fontSize: type.body, fontWeight: 600}}>{d.title}</div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 8, lineHeight: 1.35}}>{d.sub}</div>
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 120, top: 730, fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, ...fadeUp(frame, cue('raw run logs will be', 1), 24)}}>
      github.com/ablation-lab/evolving-review-councils
    </div>
  </>
);

export const Scene16WhatsNext: React.FC<{endCardOnly?: boolean; withFollow?: boolean}> = ({endCardOnly = false, withFollow = true}) => {
  const frame = useCurrentFrame();
  const limitsAt = cue('Back to the pilot');
  const endAt = cue('The GitHub repo is public now');
  return (
    <SceneFrame sceneId="s16" fadeOutFrames={30}>
      {!endCardOnly && (
        <>
          <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, limitsAt)}}>
            <Alternatives frame={frame} />
          </div>
          {frame >= limitsAt - 10 && frame < endAt + 10 && (
            <div style={{position: 'absolute', inset: 0, opacity: phase(frame, limitsAt, endAt)}}>
              <Limits frame={frame} start={limitsAt} />
            </div>
          )}
        </>
      )}
      {frame >= endAt - 10 && <EndCard frame={frame} start={endAt} />}
      {withFollow && (
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 820,
            display: 'flex',
            gap: 28,
            alignItems: 'baseline',
            fontSize: type.small,
            ...fadeUp(frame, cue('Follow the channel'), 24),
          }}
        >
          <span style={{color: colors.accent, fontWeight: 600}}>Follow for the results</span>
          <span style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.text}}>youtube.com/@AblationLab</span>
          <span style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.text}}>ablationlab.org</span>
        </div>
      )}
    </SceneFrame>
  );
};
