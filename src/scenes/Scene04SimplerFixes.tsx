import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Chip} from '../components/Tree';
import {Card, Citation, Heading, PartMarker, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s04');

/* ---------- Objection 1: one reviewer with a broader brief ---------- */

const BroadBrief: React.FC<{frame: number}> = ({frame}) => {
  const councilAt = cue('one strong reviewer against');
  const costAt = cue('at the same cost');
  const verdictAt = cue('If the single reviewer');
  const budget = prog(frame, costAt, 24);
  return (
    <>
      <Heading eyebrow="Objection 1" title="Why not one reviewer with a broader brief?" frame={frame} start={0} />
      <Card style={{left: 120, top: 380, width: 620, height: 330, ...fadeUp(frame, cue('a better, broader brief'), 24)}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>1 strong reviewer</div>
        <div style={{fontSize: type.caption, color: colors.muted, marginTop: 6}}>one broad brief</div>
        <Chip style={{marginTop: 30, height: 'auto', padding: '14px 22px', whiteSpace: 'normal', lineHeight: 1.35, borderRadius: 16}}>
          Find every problem: bugs, security, risky changes, anything else
        </Chip>
      </Card>
      <Card style={{left: 1180, top: 380, width: 620, height: 330, ...fadeUp(frame, councilAt, 24)}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>A council</div>
        <div style={{fontSize: type.caption, color: colors.muted, marginTop: 6}}>narrow briefs, one role each</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start', marginTop: 30}}>
          <Chip>bugs only</Chip>
          <Chip>security only</Chip>
          <Chip>risky changes only</Chip>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 740, width: 440, top: 380, height: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: type.body, fontWeight: 600, color: colors.muted, ...fadeUp(frame, councilAt + 6, 20)}}>vs</div>
        <svg width={360} height={40} style={{marginTop: 18, opacity: budget}}>
          <line x1={22} x2={338} y1={20} y2={20} stroke={colors.accent} strokeWidth={3} />
          <polyline points="34,8 20,20 34,32" fill="none" stroke={colors.accent} strokeWidth={3} />
          <polyline points="326,8 340,20 326,32" fill="none" stroke={colors.accent} strokeWidth={3} />
        </svg>
        <div style={{marginTop: 14, fontSize: type.small, fontWeight: 600, color: colors.accent, opacity: budget}}>same cost</div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 780, fontSize: type.small, ...fadeUp(frame, verdictAt, 24)}}>
        If one reviewer matches the council, <span style={{color: colors.accent}}>the calculator will say so.</span>
      </div>
    </>
  );
};

/* ---------- Objection 2: rerun one reviewer (the 2026 study) ---------- */

const Rerun: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const studyAt = cue("That's what the 2026 study suggests");
  const voteAt = cue('Simply asking one model');
  const labelsAt = cue('And giving agents role labels');
  return (
    <>
      <Heading eyebrow="Objection 2" title="Why not just rerun one reviewer?" frame={frame} start={start} />
      <div style={{position: 'absolute', left: 120, top: 300, fontSize: type.caption, color: colors.muted, ...fadeUp(frame, studyAt, 20)}}>
        A 2026 study: small models debating test questions
      </div>
      <Card accent style={{left: 120, top: 370, width: 1680, ...fadeUp(frame, voteAt, 24)}}>
        <Eyebrow style={{color: colors.accent}}>Did as well, at a fraction of the cost</Eyebrow>
        <div style={{fontSize: 48, fontWeight: 600, marginTop: 14}}>Ask one model several times, take its most common answer</div>
      </Card>
      <Card style={{left: 120, top: 600, width: 1680, ...fadeUp(frame, labelsAt, 24)}}>
        <Eyebrow>And</Eyebrow>
        <div style={{fontSize: 48, fontWeight: 600, marginTop: 14}}>Role labels made the debating agents worse</div>
      </Card>
      <Citation title="Beyond Symmetric Agents" who="Ferreira et al., 2026 (preprint)" opacity={prog(frame, studyAt, 20)} />
    </>
  );
};

const THEIRS = ['debate', 'test questions', 'small models', 'role labels'];
const OURS = [
  {text: 'independent review', at: 'Ours review independently'},
  {text: 'real code, actually run', at: 'where the code is actually run'},
  {text: 'find different problems', at: 'and the goal is finding'},
  {text: 'top models', at: 'and the goal is finding', offset: 1.4},
  {text: 'real task briefs', at: 'and the goal is finding', offset: 2.0},
];

const DifferentSetup: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const swayAt = cue('Their agents debated');
  const column = (title: string, accent: boolean, items: {text: string; at: number}[], left: number, appear: number) => (
    <Card accent={accent} style={{left, top: 300, width: 800, height: 560, ...fadeUp(frame, appear, 24)}}>
      <Eyebrow style={{color: accent ? colors.accent : colors.muted}}>{title}</Eyebrow>
      {items.map((it) => (
        <div key={it.text} style={{fontSize: type.body, marginTop: 26, ...fadeUp(frame, it.at, 18, 8)}}>
          {it.text}
        </div>
      ))}
    </Card>
  );
  return (
    <>
      <Heading eyebrow="But that's a different setup" title="Their study vs our test" frame={frame} start={start} />
      {column('Their study', false, THEIRS.map((t, i) => ({text: t, at: swayAt + i * 8})), 120, start + 6)}
      {column('Our test', true, OURS.map((o) => ({text: o.text, at: cue(o.at, o.offset ?? 0)})), 1000, cue('Ours review independently'))}
    </>
  );
};

const ARMS = [
  {text: 'same model, rerun', at: 'the same model rerun'},
  {text: 'generalists', sub: 'one broad brief', at: 'councils of generalists'},
  {text: 'specialists', sub: 'narrow briefs', at: 'councils of specialists'},
  {text: 'a mix of both', at: 'mixes of both'},
  {text: 'mixed AI models', at: 'and a mix of AI models'},
];

const WhatWeTest: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <>
    <Heading eyebrow="So we don't assume councils win" title="We test it, at equal cost" frame={frame} start={start} />
    <div style={{position: 'absolute', left: 120, top: 330, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20}}>
      {ARMS.map((a) => (
        <div
          key={a.text}
          style={{
            height: 200,
            boxSizing: 'border-box',
            padding: '24px 22px',
            borderRadius: 14,
            border: `2px solid ${colors.line}`,
            backgroundColor: colors.panel,
            ...fadeUp(frame, cue(a.at), 18, 8),
          }}
        >
          <div style={{fontSize: 36, fontWeight: 600, lineHeight: 1.2}}>{a.text}</div>
          {a.sub && <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, marginTop: 10}}>{a.sub}</div>}
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 120, top: 600, fontSize: type.small, color: colors.accent, ...fadeUp(frame, cue('at equal cost'), 20)}}>
      all at the same cost
    </div>
    <div style={{position: 'absolute', left: 120, top: 700, fontSize: type.body, ...fadeUp(frame, cue('Evolution then shows'), 24)}}>
      Then evolution shows whether <span style={{color: colors.accent}}>specialising earns its place.</span>
    </div>
  </>
);

export const Scene04SimplerFixes: React.FC = () => {
  const frame = useCurrentFrame();
  const rerunAt = cue('Why not just rerun one reviewer');
  const setupAt = cue("But that's a different setup");
  const testAt = cue("So we don't assume councils win");
  return (
    <SceneFrame sceneId="s04">
      <PartMarker part={1} frame={frame} />
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, rerunAt)}}>
        <BroadBrief frame={frame} />
      </div>
      {frame >= rerunAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, rerunAt, setupAt)}}>
          <Rerun frame={frame} start={rerunAt} />
        </div>
      )}
      {frame >= setupAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, setupAt, testAt)}}>
          <DifferentSetup frame={frame} start={setupAt} />
        </div>
      )}
      {frame >= testAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, testAt)}}>
          <WhatWeTest frame={frame} start={testAt} />
        </div>
      )}
    </SceneFrame>
  );
};
