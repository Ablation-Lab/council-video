import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Card, Citation, Heading, PartMarker, Tag, phase} from '../components/Kit';
import {fadeUp, mix, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s07');

/* ---------- The optimum: illustrative size sweep, no numbers ---------- */

const SWEEP = [
  {quality: 52, tokens: 20},
  {quality: 70, tokens: 40},
  {quality: 78, tokens: 60},
  {quality: 80, tokens: 80},
  {quality: 81, tokens: 100},
];
const BASE = 860;
const BAR_W = 64;
const groupX = (i: number) => 420 + i * 250;

const Sweep: React.FC<{frame: number}> = ({frame}) => {
  const markerAt = cue('the optimum is where');
  const marker = prog(frame, markerAt, 30);
  return (
    <>
      <Heading eyebrow="Same run, different council sizes" title="Where's the optimum?" frame={frame} start={0} />
      <div style={{position: 'absolute', left: 1500, top: 330, display: 'flex', flexDirection: 'column', gap: 14, ...fadeUp(frame, 6, 24)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: type.caption}}>
          <div style={{width: 24, height: 24, backgroundColor: colors.text, borderRadius: 3}} />
          quality
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: type.caption, color: colors.muted}}>
          <div style={{width: 24, height: 24, backgroundColor: colors.line, borderRadius: 3}} />
          tokens
        </div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={320} x2={1440} y1={BASE} y2={BASE} stroke={colors.line} strokeWidth={2} />
        {SWEEP.map((s, i) => {
          const p = prog(frame, 8 + i * 5, 26);
          const qh = s.quality * 4.2 * p;
          const th = s.tokens * 3.8 * p;
          const x = groupX(i);
          return (
            <g key={i}>
              <rect x={x - BAR_W - 4} y={BASE - qh} width={BAR_W} height={qh} fill={colors.text} rx={3} />
              <rect x={x + 4} y={BASE - th} width={BAR_W} height={th} fill={colors.line} rx={3} />
            </g>
          );
        })}
        <line x1={groupX(2)} x2={groupX(2)} y1={BASE} y2={mix(BASE, 440, marker)} stroke={colors.accent} strokeWidth={3} strokeDasharray="8 8" />
      </svg>
      <div style={{position: 'absolute', left: 320, top: BASE + 16, fontSize: type.caption, color: colors.muted, ...fadeUp(frame, 10, 20)}}>
        more reviewers →
      </div>
      <div style={{position: 'absolute', left: groupX(2) + 22, top: 420, fontSize: type.small, color: colors.accent, ...fadeUp(frame, markerAt + 20, 24)}}>
        optimum: the next reviewer
        <br />
        costs more than it adds
      </div>
    </>
  );
};

/* ---------- The optimum differs by task: three tiers, no numbers ---------- */

const TIERS = [
  {tier: 'Tier 1', title: 'Basic app', sub: 'e.g. rename-cli'},
  {tier: 'Tier 2', title: 'Scientific app', sub: ''},
  {tier: 'Tier 3', title: 'System-level tool', sub: ''},
];

const Tiers: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <>
    <Heading eyebrow="The optimum probably isn't one number" title="The same sweep, three tiers" frame={frame} start={start} />
    <Tag style={{...fadeUp(frame, start + 6, 20)}}>HYPOTHESIS</Tag>
    {TIERS.map((t, i) => (
      <Card key={t.title} style={{left: 120 + i * 570, top: 340, width: 540, height: 380, ...fadeUp(frame, cue('the same sweep runs', i * 0.5), 24)}}>
        <Eyebrow>{t.tier}</Eyebrow>
        <div style={{fontSize: type.body, fontWeight: 600, marginTop: 8}}>{t.title}</div>
        {t.sub && <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, marginTop: 4}}>{t.sub}</div>}
        <div style={{position: 'absolute', left: 28, bottom: 30, display: 'flex', alignItems: 'baseline', gap: 16}}>
          <span style={{fontSize: 96, fontWeight: 600, color: colors.accent, lineHeight: 1}}>?</span>
          <span style={{fontSize: type.small, color: colors.muted}}>reviewers</span>
        </div>
      </Card>
    ))}
  </>
);

/* ---------- A hint from human code review ---------- */

const Porter: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const twoAt = cue('teams of two reviewers');
  const oneAt = cue('though one reviewer alone');
  const smallAt = cue('So we start small');
  const teams = [
    {n: 1, label: '1 reviewer', note: 'found fewer', at: oneAt, accent: false},
    {n: 2, label: '2 reviewers', note: 'as many as 4', at: twoAt, accent: true},
    {n: 4, label: '4 reviewers', note: 'no more than 2', at: twoAt + 10, accent: false},
  ];
  return (
    <>
      <Heading eyebrow="A hint from human code review" title="A 1990s study at a real software company" frame={frame} start={start} />
      {teams.map((t, i) => (
        <Card key={t.n} accent={t.accent} style={{left: 120 + i * 570, top: 330, width: 540, height: 250, ...fadeUp(frame, t.at, 24)}}>
          <div style={{display: 'flex', gap: 10}}>
            {Array.from({length: t.n}).map((_, j) => (
              <div key={j} style={{width: 40, height: 40, borderRadius: 20, border: `3px solid ${t.accent ? colors.accent : colors.muted}`}} />
            ))}
          </div>
          <div style={{fontSize: type.body, fontWeight: 600, marginTop: 20}}>{t.label}</div>
          <div style={{fontSize: type.small, color: t.accent ? colors.accent : colors.muted, marginTop: 6}}>{t.note}</div>
        </Card>
      ))}
      <div style={{position: 'absolute', left: 120, top: 660, ...fadeUp(frame, smallAt, 24)}}>
        <div style={{fontSize: type.heading, fontWeight: 600}}>
          Start small. <span style={{color: colors.accent}}>Let the results decide.</span>
        </div>
        <div style={{fontSize: type.small, color: colors.muted, marginTop: 14, ...fadeUp(frame, cue('the calculator will say'), 20)}}>
          The calculator will say if a small council is enough.
        </div>
      </div>
      <Citation
        title="An Experiment to Assess the Cost-Benefits of Code Inspections"
        who="Porter et al., IEEE TSE 1997"
        opacity={prog(frame, twoAt, 20)}
      />
    </>
  );
};

const Lead: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <div style={{position: 'absolute', left: 120, top: 420, ...fadeUp(frame, start, 24)}}>
    <div style={{fontSize: type.heading, fontWeight: 600}}>How do we find the best council for each task?</div>
    <div style={{fontFamily: fonts.mono, fontSize: type.body, color: colors.accent, marginTop: 24, letterSpacing: 3, ...fadeUp(frame, cue("That's question two"), 20)}}>
      QUESTION 2
    </div>
  </div>
);

export const Scene07Size: React.FC = () => {
  const frame = useCurrentFrame();
  const tiersAt = cue("The optimum probably isn't one number");
  const porterAt = cue('Human code review offers a hint');
  const leadAt = cue('So how do we find the best council');
  return (
    <SceneFrame sceneId="s07">
      <PartMarker part={1} frame={frame} />
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, tiersAt)}}>
        <Sweep frame={frame} />
        <Caption>Illustrative shape. No numbers implied.</Caption>
      </div>
      {frame >= tiersAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, tiersAt, porterAt)}}>
          <Tiers frame={frame} start={tiersAt} />
        </div>
      )}
      {frame >= porterAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, porterAt, leadAt)}}>
          <Porter frame={frame} start={porterAt} />
        </div>
      )}
      {frame >= leadAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, leadAt)}}>
          <Lead frame={frame} start={leadAt} />
        </div>
      )}
    </SceneFrame>
  );
};
