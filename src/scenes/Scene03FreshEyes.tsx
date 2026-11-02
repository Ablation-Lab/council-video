import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Check, Folder} from '../components/Icons';
import {Card, Caveat, Citation, Heading, PartMarker, Tag, phase} from '../components/Kit';
import {fadeUp, prog, typed} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s03');

/* ---------- The flaw: who wrote what, and who caught it ---------- */

const TIMELINE_Y = 262;
const STOPS = [
  {x: 120, title: 'Coordinator', sub: 'writes shared code', at: 'A coordinator wrote'},
  {x: 540, title: 'Coordinator', sub: 'reviews its own code', at: 'reviewed it itself'},
  {x: 960, title: '4 builders', sub: 'work in parallel', at: 'Then four builders'},
  {x: 1380, title: 'Builder tests', sub: 'all passing', at: 'Their tests passed'},
];

const ROWS = [
  {name: 'shared/', owner: 'coordinator', shared: true},
  {name: 'builder-1/', owner: 'builder 1'},
  {name: 'builder-2/', owner: 'builder 2'},
  {name: 'builder-3/', owner: 'builder 3'},
  {name: 'builder-4/', owner: 'builder 4'},
];

const LOG = [
  {key: 'runs as', value: 'administrator', at: 'with full administrator powers'},
  {key: 'saves files to', value: '%APPDATA%', at: 'it saved files'},
  {key: 'can change it', value: 'everyday user', at: 'the everyday, non-admin user'},
];

const Timeline: React.FC<{frame: number}> = ({frame}) => {
  const cues = STOPS.map((s) => cue(s.at));
  const head = interpolate(
    frame,
    [cues[0], cues[1], cues[2], cues[3], cues[3] + 30],
    [STOPS[0].x, STOPS[1].x, STOPS[2].x, STOPS[3].x, 1800],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <>
      <svg width={1920} height={40} style={{position: 'absolute', left: 0, top: TIMELINE_Y - 20}}>
        <line x1={120} x2={1800} y1={20} y2={20} stroke={colors.faint} strokeWidth={2} />
        <line x1={120} x2={head} y1={20} y2={20} stroke={colors.muted} strokeWidth={2} />
        {STOPS.map((s, i) => (
          <circle key={s.x} cx={s.x + 7} cy={20} r={7} fill={colors.text} opacity={prog(frame, cues[i], 12)} />
        ))}
      </svg>
      {STOPS.map((s, i) => (
        <div key={s.x} style={{position: 'absolute', left: s.x, top: TIMELINE_Y + 26, ...fadeUp(frame, cues[i])}}>
          <div style={{fontSize: type.small, fontWeight: 600, display: 'flex', gap: 10, alignItems: 'center'}}>
            {s.title}
            {i === 1 && <Check size={30} color={colors.muted} />}
          </div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 4}}>{s.sub}</div>
        </div>
      ))}
    </>
  );
};

const OwnershipTable: React.FC<{frame: number}> = ({frame}) => {
  const sharedAccent = prog(frame, cue('It sat in shared code'), 20);
  return (
    <div style={{position: 'absolute', left: 120, top: 414, width: 760}}>
      <Eyebrow style={{display: 'flex', marginBottom: 14, ...fadeUp(frame, cue('A coordinator wrote'))}}>
        <span style={{width: 270, paddingLeft: 20}}>Folder</span>
        <span style={{width: 180}}>Owner</span>
        <span>Check</span>
      </Eyebrow>
      {ROWS.map((r, i) => {
        const appearAt = r.shared ? cue('A coordinator wrote', 0.6) : cue('Then four builders', 0.25 * i);
        const statusAt = r.shared ? cue('reviewed it itself') : cue('Their tests passed', 0.15 * i);
        const accent = r.shared ? sharedAccent : 0;
        return (
          <div
            key={r.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 80,
              marginBottom: 6,
              padding: '0 18px',
              borderRadius: 12,
              border: `2px solid ${accent > 0.5 ? colors.accent : colors.faint}`,
              backgroundColor: accent > 0 ? `rgba(242,165,65,${0.1 * accent})` : colors.panel,
              ...fadeUp(frame, appearAt),
            }}
          >
            <span style={{width: 270, display: 'flex', alignItems: 'center', gap: 14}}>
              <Folder size={30} color={accent > 0.5 ? colors.accent : colors.muted} />
              <span style={{fontFamily: fonts.mono, fontSize: type.small}}>{r.name}</span>
            </span>
            <span style={{width: 180, fontSize: type.caption, color: r.shared ? (accent > 0.5 ? colors.accent : colors.text) : colors.muted}}>
              {r.owner}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                whiteSpace: 'nowrap',
                fontFamily: fonts.mono,
                fontSize: type.caption,
                opacity: prog(frame, statusAt, 14),
              }}
            >
              <Check size={28} color={colors.muted} />
              {r.shared ? 'self-reviewed' : 'PASS'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ReviewerAndFinding: React.FC<{frame: number}> = ({frame}) => {
  const reviewerAt = cue('Then an independent reviewer');
  const emphasis = prog(frame, cue('A reviewer that had never seen'), 20);
  const findingAt = cue("That's a back door", -0.2);
  const locationAt = cue('It sat in shared code');
  return (
    <div style={{position: 'absolute', left: 960, top: 414, width: 840}}>
      <div
        style={{
          height: 76,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 22px',
          borderRadius: 12,
          border: `2px solid ${emphasis > 0.5 ? colors.accent : colors.line}`,
          backgroundColor: colors.panel,
          opacity: prog(frame, reviewerAt, 24),
          transform: `translateX(${(1 - prog(frame, reviewerAt, 24)) * 60}px)`,
        }}
      >
        <Eyebrow style={{color: emphasis > 0.5 ? colors.accent : colors.muted}}>Reviewer</Eyebrow>
        <span style={{fontSize: type.small}}>didn't write it · checks how parts fit</span>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: '16px 22px',
          borderRadius: 12,
          backgroundColor: colors.panel,
          border: `2px solid ${colors.faint}`,
          fontFamily: fonts.mono,
          fontSize: 30,
          ...fadeUp(frame, reviewerAt + 12),
        }}
      >
        <div style={{fontSize: type.caption, color: colors.muted, marginBottom: 8}}>integration-review.log</div>
        {LOG.map((l, i) => {
          const hot = i >= 1 && frame >= findingAt;
          return (
            <div key={l.key} style={{height: 42, lineHeight: '42px', whiteSpace: 'pre', color: hot ? colors.accent : colors.text}}>
              {typed(`${l.key.padEnd(16, ' ')}${l.value}`, frame, cue(l.at), 40)}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: '18px 22px',
          borderRadius: 12,
          border: `2px solid ${colors.accent}`,
          backgroundColor: colors.panel,
          ...fadeUp(frame, findingAt, 24, 12),
        }}
      >
        <Eyebrow style={{color: colors.accent}}>Finding · Serious</Eyebrow>
        <div style={{fontSize: 34, fontWeight: 600, marginTop: 8}}>A back door to admin powers</div>
        <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, marginTop: 8, opacity: prog(frame, locationAt, 18)}}>
          location: <span style={{color: colors.accent}}>shared code (no builder owns it)</span>
        </div>
      </div>
    </div>
  );
};

const Flaw: React.FC<{frame: number}> = ({frame}) => (
  <>
    <Heading eyebrow="Pilot run · WinScope" title="The flaw" frame={frame} start={0} />
    <Timeline frame={frame} />
    <OwnershipTable frame={frame} />
    <ReviewerAndFinding frame={frame} />
  </>
);

/* ---------- The 97, round by round ---------- */

// Figures from "How the agents built and reviewed WinScope": the four review
// rounds, with fix rounds between them (eleven rounds in all).
const FINDINGS = [
  {n: 48, label: 'first council'},
  {n: 10, label: 'first verification'},
  {n: 25, label: 'privacy audit'},
  {n: 14, label: 'second verification'},
];
const TOTAL = FINDINGS.reduce((s, f) => s + f.n, 0);
const BAR_W = 1680;

const Rounds: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const count = Math.round(interpolate(frame, [start, start + 18], [0, TOTAL], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const fixesAt = cue('with fixes going in between');
  const laterAt = cue('and each later round');
  const notProofAt = cue('not proof that councils work');
  let x = 0;
  return (
    <>
      <Heading eyebrow="Across the pilot" title="The 97, round by round" frame={frame} start={start} />
      <div style={{position: 'absolute', left: 120, top: 300, display: 'flex', alignItems: 'baseline', gap: 28, ...fadeUp(frame, start, 24)}}>
        <span style={{fontSize: 140, fontWeight: 600, color: colors.accent, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{count}</span>
        <span style={{fontSize: type.small, color: colors.muted, lineHeight: 1.3}}>
          problems the authors
          <br />
          had missed
        </span>
      </div>
      <svg width={BAR_W} height={80} style={{position: 'absolute', left: 120, top: 540, overflow: 'visible'}}>
        {FINDINGS.map((f, i) => {
          const w = (f.n / TOTAL) * BAR_W;
          const x0 = x;
          x += w;
          const p = prog(frame, start + 16 + i * 10, 20);
          const later = i > 0 && frame >= laterAt;
          return (
            <g key={f.label} opacity={p}>
              {/* Fixes went in before each later round, so each round saw a newer version. */}
              {i > 0 && (
                <g opacity={prog(frame, fixesAt + (i - 1) * 6, 16)}>
                  <line x1={x0} x2={x0} y1={-30} y2={-6} stroke={colors.muted} strokeWidth={2} />
                  <text x={x0} y={-40} textAnchor="middle" fontFamily={fonts.mono} fontSize={26} fill={colors.muted}>
                    fixes
                  </text>
                </g>
              )}
              <rect
                x={x0 + 3}
                y={0}
                width={Math.max(0, w - 6)}
                height={80}
                rx={6}
                fill={colors.line}
                stroke={later ? colors.accent : 'none'}
                strokeWidth={3}
              />
              <text x={x0 + w / 2} y={52} textAnchor="middle" fontFamily={fonts.mono} fontSize={type.small} fill={colors.text}>
                {f.n}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 120, top: 640, width: BAR_W, height: 40}}>
        {FINDINGS.reduce<{x: number; els: React.ReactNode[]}>(
          (acc, f, i) => {
            const w = (f.n / TOTAL) * BAR_W;
            acc.els.push(
              <div
                key={f.label}
                style={{
                  position: 'absolute',
                  left: acc.x,
                  width: w,
                  textAlign: 'center',
                  fontSize: type.caption,
                  color: colors.muted,
                  whiteSpace: 'nowrap',
                  opacity: prog(frame, start + 30 + i * 10, 20),
                }}
              >
                {w > 300 ? f.label : f.label.replace('verification', 'verif.')}
              </div>,
            );
            acc.x += w;
            return acc;
          },
          {x: 0, els: []},
        ).els}
      </div>
      <div style={{position: 'absolute', left: 120, top: 720, fontSize: type.body, ...fadeUp(frame, fixesAt + 20, 20)}}>
        Each round checked a newer version.
        <span style={{color: colors.accent, ...fadeUp(frame, laterAt, 20)}}> Each later round still found new ones.</span>
      </div>
      <div style={{position: 'absolute', left: 120, top: 820, ...fadeUp(frame, notProofAt, 20, 8)}}>
        <Caveat>one pilot · not proof that councils work</Caveat>
      </div>
    </>
  );
};

/* ---------- Why the author misses it: an idea ---------- */

const Idea: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const authorAt = cue('an author reads what it meant');
  const reviewerAt = cue("A reviewer who didn't write the code");
  const researchAt = cue('Related research finds');
  return (
    <>
      <Heading eyebrow="Why would the author miss it?" title="An idea, not a result" frame={frame} start={start} />
      <Tag style={{...fadeUp(frame, cue("Here's an idea"), 20)}}>IDEA · NOT A RESULT</Tag>
      <Card style={{left: 120, top: 340, width: 820, height: 260, ...fadeUp(frame, authorAt, 24)}}>
        <Eyebrow>The author</Eyebrow>
        <div style={{fontSize: 48, fontWeight: 600, marginTop: 18, lineHeight: 1.2}}>reads what it meant to write</div>
      </Card>
      <Card accent style={{left: 980, top: 340, width: 820, height: 260, ...fadeUp(frame, reviewerAt, 24)}}>
        <Eyebrow style={{color: colors.accent}}>A reviewer who didn't write it</Eyebrow>
        <div style={{fontSize: 48, fontWeight: 600, marginTop: 18, lineHeight: 1.2}}>sees only what's really there</div>
      </Card>
      <div style={{position: 'absolute', left: 120, top: 680, width: 1680, fontSize: type.body, color: colors.muted, lineHeight: 1.35, ...fadeUp(frame, researchAt, 24)}}>
        Related research: AIs often struggle to correct their own reasoning
        <br />
        without outside feedback.
      </div>
      <Citation title="Large Language Models Cannot Self-Correct Reasoning Yet" who="Huang et al., 2023" opacity={prog(frame, researchAt, 20)} />
    </>
  );
};

/* ---------- Lead-in: three objections ---------- */

const OBJECTIONS = ['a broader brief?', 'rerun one reviewer?', 'a smarter model?'];

const Objections: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const threeAt = cue('Three objections come up');
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 340, fontSize: type.heading, fontWeight: 600, ...fadeUp(frame, start, 24)}}>
        But do you need a council for that?
      </div>
      <div style={{position: 'absolute', left: 120, top: 500, display: 'flex', gap: 24}}>
        {OBJECTIONS.map((o, i) => (
          <div
            key={o}
            style={{
              height: 84,
              padding: '0 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderRadius: 42,
              border: `2px solid ${colors.line}`,
              fontSize: type.body,
              ...fadeUp(frame, threeAt + i * 8, 18, 8),
            }}
          >
            <span style={{fontFamily: fonts.mono, fontSize: type.small, color: colors.accent}}>{i + 1}</span>
            {o}
          </div>
        ))}
      </div>
    </>
  );
};

export const Scene03FreshEyes: React.FC = () => {
  const frame = useCurrentFrame();
  const roundsAt = cue('Across the pilot');
  const ideaAt = cue('Why would the author miss it');
  const leadAt = cue('But do you need a council');
  return (
    <SceneFrame sceneId="s03">
      <PartMarker part={1} frame={frame} />
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, roundsAt)}}>
        <Flaw frame={frame} />
      </div>
      {frame >= roundsAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, roundsAt, ideaAt)}}>
          <Rounds frame={frame} start={roundsAt} />
        </div>
      )}
      {frame >= ideaAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, ideaAt, leadAt)}}>
          <Idea frame={frame} start={ideaAt} />
        </div>
      )}
      {frame >= leadAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, leadAt)}}>
          <Objections frame={frame} start={leadAt} />
        </div>
      )}
    </SceneFrame>
  );
};
