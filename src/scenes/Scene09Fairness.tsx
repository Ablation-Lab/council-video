import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Check} from '../components/Icons';
import {Lines} from '../components/Tree';
import {Card, Citation, Heading, PartMarker, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s09');

/* ---------- The stage: one shared input feeding three runs ---------- */

const BOX = {left: 100, right: 1180, top: 270, bottom: 860};
const INPUT = {left: 140, right: 400, top: 330, bottom: 800};
const TAG = {left: 490, width: 340, height: 112};
const ROWS = [
  {y: 400, setup: '3 reviewers · Sonnet', code: 'run #A7', prior: 14},
  {y: 565, setup: '6 reviewers · Opus', code: 'run #C2', prior: 9},
  {y: 730, setup: '9 reviewers · Opus', code: 'run #F4', prior: 21},
];
const CHAIN_X = [880, 975, 1070];

const RULES: {title: string; sub: string; at: string}[] = [
  {title: 'Fresh chat', sub: 'no memory, no hint of the hoped-for result', at: 'Every run starts in a fresh chat'},
  {title: 'Blind judging', sub: 'judge never sees the size or model', at: 'The judge scores outputs blind'},
  {title: 'Hard tests, not AI votes', sub: 'AI judges tend to favour their own style', at: 'The hard tests decide each round'},
  {title: 'Sandbox', sub: 'nothing outside the project folder', at: 'And everything runs in a sandbox'},
];

const RunRow: React.FC<{i: number; frame: number}> = ({i, frame}) => {
  const r = ROWS[i];
  const appearAt = cue('only the council is allowed', 0.4 + i * 0.25);
  const fresh = prog(frame, cue('Every run starts in a fresh chat', 0.6), 30);
  const blind = prog(frame, cue('The judge scores outputs blind', 0.4), 20);
  const refresh = prog(frame, cue('Every run starts in a fresh chat', 1.8), 15);
  const prior = Math.round(interpolate(fresh, [0, 1], [r.prior, 0]));
  const kept = prog(frame, appearAt + 20 + i * 4, 30);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: TAG.left,
          top: r.y - TAG.height / 2,
          width: TAG.width,
          height: TAG.height,
          boxSizing: 'border-box',
          padding: '14px 20px',
          borderRadius: 12,
          border: `2px solid ${colors.line}`,
          backgroundColor: colors.panel,
          ...fadeUp(frame, appearAt),
        }}
      >
        <div style={{position: 'relative', height: 40, fontSize: type.caption, fontWeight: 600}}>
          <span style={{position: 'absolute', opacity: 1 - blind, whiteSpace: 'nowrap'}}>{r.setup}</span>
          <span style={{position: 'absolute', opacity: blind, fontFamily: fonts.mono, color: colors.accent, whiteSpace: 'nowrap'}}>{r.code}</span>
        </div>
        <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: refresh > 0.5 ? colors.accent : colors.muted, marginTop: 6, whiteSpace: 'nowrap'}}>
          {fresh < 1 ? `context: ${prior} msgs` : 'context: empty'}
        </div>
      </div>
      <Lines>
        <line x1={TAG.left + TAG.width} x2={CHAIN_X[2]} y1={r.y} y2={r.y} stroke={colors.line} strokeWidth={2.5} opacity={kept} />
      </Lines>
      {CHAIN_X.map((x, j) => (
        <div
          key={x}
          style={{
            position: 'absolute',
            left: x - 30,
            top: r.y - 22,
            width: 60,
            height: 44,
            borderRadius: 8,
            boxSizing: 'border-box',
            border: `2px solid ${j === 2 ? colors.accent : colors.muted}`,
            backgroundColor: colors.panel,
            opacity: prog(frame, appearAt + 20 + j * 8, 20),
          }}
        />
      ))}
    </>
  );
};

const Stage: React.FC<{frame: number}> = ({frame}) => {
  const sandboxAt = cue('And everything runs in a sandbox');
  const sandbox = prog(frame, sandboxAt, 45);
  const realAt = cue('The sandbox stops agents touching anything real');
  const perimeter = 2 * (BOX.right - BOX.left + BOX.bottom - BOX.top);
  return (
    <>
      <Heading eyebrow="Fair comparisons" title="Only the council changes" frame={frame} start={0} />
      <div
        style={{
          position: 'absolute',
          left: INPUT.left,
          top: INPUT.top,
          width: INPUT.right - INPUT.left,
          height: INPUT.bottom - INPUT.top,
          boxSizing: 'border-box',
          borderRadius: 12,
          border: `2px solid ${colors.line}`,
          backgroundColor: colors.panel,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 22px',
          gap: 14,
          ...fadeUp(frame, cue('only the council is allowed'), 24),
        }}
      >
        <Eyebrow>Same inputs</Eyebrow>
        {['app', 'starting code', 'tests'].map((t) => (
          <div key={t} style={{fontSize: type.caption}}>
            {t}
          </div>
        ))}
      </div>
      <Lines>
        {ROWS.map((r, i) => (
          <line
            key={r.y}
            x1={INPUT.right}
            x2={TAG.left}
            y1={r.y}
            y2={r.y}
            stroke={colors.muted}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - prog(frame, cue('only the council is allowed', 0.4 + i * 0.25), 20)}
          />
        ))}
      </Lines>
      {ROWS.map((_, i) => (
        <RunRow key={i} i={i} frame={frame} />
      ))}
      <Lines>
        <rect
          x={BOX.left}
          y={BOX.top}
          width={BOX.right - BOX.left}
          height={BOX.bottom - BOX.top}
          rx={18}
          fill="none"
          stroke={colors.text}
          strokeWidth={2.5}
          strokeDasharray={`${perimeter * sandbox} ${perimeter}`}
        />
      </Lines>
      <div style={{position: 'absolute', left: BOX.left + 24, top: BOX.top - 18, padding: '0 12px', backgroundColor: colors.bg, ...fadeUp(frame, sandboxAt + 20, 20, 6)}}>
        <Eyebrow style={{color: colors.text}}>Sandbox · project folder only</Eyebrow>
      </div>
      <div style={{position: 'absolute', left: BOX.left, top: BOX.bottom + 18, fontSize: type.caption, color: colors.muted, ...fadeUp(frame, realAt, 24)}}>
        Outside: the real system. <span style={{color: colors.accent}}>Unreachable.</span>
      </div>
      <div style={{position: 'absolute', left: 1260, top: 270, width: 540}}>
        {RULES.map((r, i) => {
          const at = cue(r.at);
          const next = i < RULES.length - 1 ? cue(RULES[i + 1].at) : Infinity;
          const active = frame >= at && frame < next;
          const done = frame >= next;
          return (
            <div
              key={r.title}
              style={{
                display: 'flex',
                gap: 18,
                alignItems: 'flex-start',
                padding: '14px 22px',
                marginBottom: 12,
                borderRadius: 12,
                boxSizing: 'border-box',
                minHeight: 112,
                border: `2px solid ${active ? colors.accent : colors.line}`,
                backgroundColor: colors.panel,
                ...fadeUp(frame, at, 24),
              }}
            >
              <div style={{width: 32, paddingTop: 4, fontFamily: fonts.mono, fontSize: type.caption, color: active ? colors.accent : colors.muted}}>
                {done ? <Check size={30} color={colors.muted} /> : `0${i + 1}`}
              </div>
              <div>
                <div style={{fontSize: 36, fontWeight: 600}}>{r.title}</div>
                <div style={{fontSize: type.caption, color: colors.muted, marginTop: 6, lineHeight: 1.3}}>{r.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Citation
        prefix="AI judges and their own style:"
        title="LLM Evaluators Recognize and Favor Their Own Generations"
        who="Panickssery et al., NeurIPS 2024"
        opacity={phase(frame, cue('The hard tests decide each round'), cue("Here's how we'll measure it"))}
      />
    </>
  );
};

/* ---------- How it's measured ---------- */

const OUTCOMES = [
  {label: 'caught', at: 'what it catches', accent: true},
  {label: 'missed', at: 'what it catches', offset: 0.8, accent: false},
  {label: 'false alarm', at: 'what it falsely flags', accent: false},
];

const Measure: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const plantAt = cue('We plant known bugs');
  const severityAt = cue('how serious its catches are');
  return (
    <>
      <Heading eyebrow="Here's how we'll measure it" title="Planted bugs" frame={frame} start={start} />
      <Card style={{left: 120, top: 320, width: 640, height: 420, ...fadeUp(frame, plantAt, 24)}}>
        <Eyebrow>Test app · bugs planted, kept secret</Eyebrow>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const bug = i === 1 || i === 4;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 18}}>
              <div style={{height: 14, width: [380, 300, 460, 260, 340, 420, 220][i], borderRadius: 7, backgroundColor: bug ? colors.accent : colors.line, opacity: bug ? prog(frame, plantAt + 12, 20) * 0.9 + 0.1 : 1}} />
            </div>
          );
        })}
      </Card>
      <div style={{position: 'absolute', left: 840, top: 320, width: 960}}>
        <Eyebrow style={{...fadeUp(frame, cue('and score each review'), 20)}}>Each review is scored on</Eyebrow>
        <div style={{display: 'flex', gap: 18, marginTop: 20}}>
          {OUTCOMES.map((o) => (
            <div
              key={o.label}
              style={{
                height: 84,
                padding: '0 30px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 42,
                border: `2px solid ${o.accent ? colors.accent : colors.line}`,
                color: o.accent ? colors.accent : colors.text,
                fontSize: type.body,
                ...fadeUp(frame, cue(o.at, o.offset ?? 0), 18, 8),
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
        <div style={{marginTop: 40, ...fadeUp(frame, severityAt, 20)}}>
          <div style={{display: 'flex', gap: 18}}>
            <Card style={{position: 'relative', padding: '16px 26px'}}>
              <div style={{fontSize: type.small, fontWeight: 600}}>serious</div>
            </Card>
            <Card accent style={{position: 'relative', padding: '16px 26px'}}>
              <div style={{fontSize: type.small, fontWeight: 600, color: colors.accent}}>critical</div>
            </Card>
          </div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 14, ...fadeUp(frame, cue("so an average can't hide"), 20)}}>
            scored separately, so an average can't hide a missed critical flaw
          </div>
        </div>
      </div>
    </>
  );
};

const Cost: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const resultAt = cue('Catching bugs is the result');
  const rewardAt = cue('so counting bugs alone');
  const budgetAt = cue("That's why we compare councils");
  const curve = prog(frame, budgetAt, 40);
  const pts: string[] = [];
  for (let x = 0; x <= 1; x += 0.02) pts.push(`${(x * 640).toFixed(1)},${(240 - 220 * (1 - Math.exp(-x * 3.2))).toFixed(1)}`);
  return (
    <>
      <Heading eyebrow="Cost is counted in money" title="Results, and what they cost" frame={frame} start={start} />
      <div style={{position: 'absolute', left: 120, top: 320, display: 'flex', gap: 24}}>
        <Card accent style={{position: 'relative', width: 520, ...fadeUp(frame, resultAt, 24)}}>
          <Eyebrow style={{color: colors.accent}}>The result</Eyebrow>
          <div style={{fontSize: type.body, fontWeight: 600, marginTop: 10}}>bugs caught</div>
        </Card>
        <Card style={{position: 'relative', width: 520, ...fadeUp(frame, cue('and cost is what it took'), 24)}}>
          <Eyebrow>What it took</Eyebrow>
          <div style={{fontSize: type.body, fontWeight: 600, marginTop: 10}}>cost, in money</div>
        </Card>
      </div>
      <div style={{position: 'absolute', left: 120, top: 520, width: 1080, fontSize: type.small, color: colors.muted, lineHeight: 1.35, ...fadeUp(frame, rewardAt, 20)}}>
        Counting bugs alone would just reward <span style={{color: colors.text}}>whoever spends the most.</span>
      </div>
      <div style={{position: 'absolute', left: 1260, top: 320, ...fadeUp(frame, budgetAt, 20)}}>
        <Eyebrow>Compared at every budget</Eyebrow>
        <svg width={640} height={260} style={{marginTop: 16, overflow: 'visible'}}>
          <line x1={0} x2={640} y1={240} y2={240} stroke={colors.line} strokeWidth={2} />
          <line x1={0} x2={0} y1={0} y2={240} stroke={colors.line} strokeWidth={2} />
          <path d={`M ${pts.join(' L ')}`} fill="none" stroke={colors.accent} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - curve} />
        </svg>
        <div style={{display: 'flex', justifyContent: 'space-between', width: 640, fontSize: type.caption, color: colors.muted, marginTop: 8}}>
          <span>cheap</span>
          <span>expensive</span>
        </div>
      </div>
    </>
  );
};

const SAFEGUARDS = [
  {title: 'Same merger', sub: "every council's reports combined by the same independent step", at: 'combined by the same independent step'},
  {title: 'Outside judge', sub: 'judge and merger from a different family of AI models', at: 'come from a different family'},
  {title: 'Several runs', sub: 'only gains that hold count', at: 'Each setup runs several times'},
  {title: 'Plan published first', sub: "so the goalposts can't move", at: 'And the plan is published'},
];

const Safeguards: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <>
    <Heading eyebrow="And the comparison stays fair" title="Four safeguards" frame={frame} start={start} />
    <div style={{position: 'absolute', left: 120, top: 330, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
      {SAFEGUARDS.map((s) => (
        <div
          key={s.title}
          style={{
            height: 200,
            boxSizing: 'border-box',
            padding: '28px 32px',
            borderRadius: 14,
            border: `2px solid ${colors.line}`,
            backgroundColor: colors.panel,
            ...fadeUp(frame, cue(s.at), 20, 8),
          }}
        >
          <div style={{fontSize: type.body, fontWeight: 600}}>{s.title}</div>
          <div style={{fontSize: type.small, color: colors.muted, marginTop: 14, lineHeight: 1.3}}>{s.sub}</div>
        </div>
      ))}
    </div>
  </>
);

/** Change of pace: the one way left to score higher. */
const Closing: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const ruled = [
    {text: 'memorise the tests', at: cue('by memorising tests')},
    {text: 'game the judge', at: cue('or gaming the judge')},
  ];
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
      <Eyebrow style={{...fadeUp(frame, start, 20)}}>The only way to score higher</Eyebrow>
      <div style={{display: 'flex', justifyContent: 'center', gap: 28, marginTop: 40}}>
        {ruled.map((r) => (
          <div
            key={r.text}
            style={{
              height: 76,
              padding: '0 30px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 38,
              border: `2px dashed ${colors.muted}`,
              color: colors.muted,
              fontSize: type.small,
              textDecoration: frame >= r.at + 14 ? 'line-through' : 'none',
              ...fadeUp(frame, r.at, 18, 8),
            }}
          >
            {r.text}
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: type.title,
          fontWeight: 600,
          color: colors.accent,
          marginTop: 56,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          ...fadeUp(frame, cue('only by reviewing better'), 24),
        }}
      >
        <Check size={72} color={colors.accent} />
        Review better
      </div>
    </div>
  );
};

export const Scene09Fairness: React.FC = () => {
  const frame = useCurrentFrame();
  const measureAt = cue("Here's how we'll measure it");
  const costAt = cue('Cost is counted in money');
  const guardsAt = cue("Every council's reports");
  const sandboxAt = cue('And everything runs in a sandbox');
  const closeAt = cue("The aim: a council can't improve");
  const stage = phase(frame, 0, measureAt) + (frame >= sandboxAt - 16 ? phase(frame, sandboxAt, closeAt) : 0);
  return (
    <SceneFrame sceneId="s09">
      <PartMarker part={2} frame={frame} />
      {stage > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: stage}}>
          <Stage frame={frame} />
        </div>
      )}
      {frame >= measureAt - 10 && frame < costAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, measureAt, costAt)}}>
          <Measure frame={frame} start={measureAt} />
        </div>
      )}
      {frame >= costAt - 10 && frame < guardsAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, costAt, guardsAt)}}>
          <Cost frame={frame} start={costAt} />
        </div>
      )}
      {frame >= guardsAt - 10 && frame < sandboxAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, guardsAt, sandboxAt)}}>
          <Safeguards frame={frame} start={guardsAt} />
        </div>
      )}
      {frame >= closeAt - 10 && <Closing frame={frame} start={closeAt} />}
    </SceneFrame>
  );
};
