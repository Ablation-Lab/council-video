import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Check, Lock} from '../components/Icons';
import {Chip, Lines} from '../components/Tree';
import {Card, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s13');

/* ---------- Phase A: an example council at work ---------- */

const WORK = {left: 120, top: 440, width: 300, height: 170};
const ROLE_X = 540;
const ROLE_W = 440;
const ROLE_H = 100;
const ROLE_Y = [300, 416, 532, 648];
const FLOW_X = 1180;
const FLOW_W = 620;
const FLOW_Y = [300, 470, 640];

const ROLES = [
  {role: 'Code logic', brief: 'is the logic correct?'},
  {role: 'User', brief: 'does it make sense to the user?'},
  {role: 'Security', brief: 'any security holes?'},
  {role: 'Privacy', brief: 'does anything private leak?'},
];

const FLOW = [
  {title: 'Findings merged', sub: 'one list, duplicates removed', at: 'Their findings are merged'},
  {title: 'Author fixes them', sub: 'the agent that wrote the code', at: 'the author fixes them'},
  {title: 'Independent reviewer verifies', sub: "didn't write the code or the fixes", at: 'an independent reviewer verifies'},
];

const Box: React.FC<{style: React.CSSProperties; accent?: boolean; children: React.ReactNode}> = ({style, accent, children}) => (
  <div
    style={{
      position: 'absolute',
      boxSizing: 'border-box',
      padding: '14px 22px',
      borderRadius: 12,
      border: `2px solid ${accent ? colors.accent : colors.line}`,
      backgroundColor: colors.panel,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

const PhaseCouncil: React.FC<{frame: number}> = ({frame}) => {
  const rolesAt = cue('Four reviewers with different roles');
  const sameAt = cue('check the same work independently');
  const judgeAt = cue('and a judge scores the results blind');
  const mergeAt = cue(FLOW[0].at);
  const workMid = WORK.top + WORK.height / 2;
  return (
    <>
      <Box style={{left: WORK.left, top: WORK.top, width: WORK.width, height: WORK.height, ...fadeUp(frame, cue("here's an example"), 24)}}>
        <Eyebrow>Work under review</Eyebrow>
        <div style={{fontFamily: fonts.mono, fontSize: type.small, marginTop: 8}}>rename-cli</div>
        <div style={{fontSize: type.caption, color: colors.muted, marginTop: 4}}>one change</div>
      </Box>

      <Lines>
        {/* The same work goes to every reviewer */}
        {ROLE_Y.map((y, i) => (
          <path
            key={y}
            d={`M ${WORK.left + WORK.width} ${workMid} C ${ROLE_X - 60} ${workMid}, ${ROLE_X - 60} ${y + ROLE_H / 2}, ${ROLE_X} ${y + ROLE_H / 2}`}
            fill="none"
            stroke={colors.muted}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - prog(frame, sameAt + i * 3, 20)}
          />
        ))}
        {/* Findings converge on the merge step */}
        {ROLE_Y.map((y, i) => (
          <path
            key={`m${y}`}
            d={`M ${ROLE_X + ROLE_W} ${y + ROLE_H / 2} C ${FLOW_X - 80} ${y + ROLE_H / 2}, ${FLOW_X - 80} ${FLOW_Y[0] + 50}, ${FLOW_X} ${FLOW_Y[0] + 50}`}
            fill="none"
            stroke={colors.muted}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - prog(frame, mergeAt + i * 2, 18)}
          />
        ))}
        {FLOW.slice(1).map((f, i) => {
          const y1 = FLOW_Y[i] + 100;
          const y2 = FLOW_Y[i + 1];
          const p = prog(frame, cue(f.at), 14);
          const x = FLOW_X + 60;
          return (
            <g key={f.title} opacity={p} stroke={colors.muted} strokeWidth={2.5} fill="none">
              <line x1={x} x2={x} y1={y1 + 4} y2={y2 - 6} />
              <path d={`M ${x - 10} ${y2 - 18} L ${x} ${y2 - 6} L ${x + 10} ${y2 - 18}`} />
            </g>
          );
        })}
      </Lines>

      {ROLES.map((r, i) => (
        <Box key={r.role} style={{left: ROLE_X, top: ROLE_Y[i], width: ROLE_W, height: ROLE_H, ...fadeUp(frame, rolesAt + i * 6, 22)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={{fontSize: 36, fontWeight: 600}}>{r.role}</span>
          </div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 2}}>{r.brief}</div>
        </Box>
      ))}

      <Box accent style={{left: FLOW_X, top: 810, width: FLOW_W, height: 100, ...fadeUp(frame, judgeAt, 22)}}>
        <div style={{fontSize: 36, fontWeight: 600}}>Judge <span style={{fontSize: type.caption, fontWeight: 400, color: colors.muted}}>· outside the council</span></div>
        <div style={{fontSize: type.caption, color: colors.accent, marginTop: 2}}>scores the results blind</div>
      </Box>

      {FLOW.map((f, i) => {
        const last = i === FLOW.length - 1;
        return (
          <Box key={f.title} accent={last} style={{left: FLOW_X, top: FLOW_Y[i], width: FLOW_W, height: 100, ...fadeUp(frame, cue(f.at), 22)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 600}}>
              {f.title}
              {last && <Check size={34} color={colors.accent} />}
            </div>
            <div style={{fontSize: type.caption, color: colors.muted, marginTop: 2}}>{f.sub}</div>
          </Box>
        );
      })}
    </>
  );
};

/* ---------- Phase A2: what "winning" means ---------- */

const CRITERIA = [
  {text: 'most real problems found', at: 'the most real problems found'},
  {text: 'most serious ones caught', at: 'including the most serious'},
  {text: 'fewest false alarms', at: 'with the fewest false alarms'},
  {text: 'for the tokens used', at: 'for the tokens used'},
];

const PhaseWinning: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const resultAt = cue('In practice, that should mean');
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 290, ...fadeUp(frame, start, 20)}}>
        <Eyebrow>How a council wins</Eyebrow>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: type.body, fontWeight: 600, marginTop: 10}}>
          <Lock size={40} color={colors.accent} />
          best score on the held-out tests
        </div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 450, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: 1160}}>
        {CRITERIA.map((c) => (
          <div
            key={c.text}
            style={{
              height: 96,
              boxSizing: 'border-box',
              padding: '0 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderRadius: 12,
              border: `2px solid ${colors.line}`,
              backgroundColor: colors.panel,
              fontSize: type.small,
              ...fadeUp(frame, cue(c.at), 18, 8),
            }}
          >
            <Check size={30} color={colors.accent} />
            {c.text}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 120, top: 720, ...fadeUp(frame, resultAt, 24)}}>
        <Eyebrow>In practice</Eyebrow>
        <div style={{fontSize: 56, fontWeight: 600, color: colors.accent, marginTop: 10}}>More secure, more reliable code</div>
      </div>
    </>
  );
};

/* ---------- Phase B: who merges the findings ---------- */

const MERGE = {left: 820, top: 440, width: 320, height: 150};
const SEES = {left: 1380, top: 440, width: 420, height: 150};
const IN_Y = [330, 440, 550, 660];
const RISKS = [
  {text: "drops a reviewer's best catch", at: "drop a reviewer's best catch"},
  {text: 'lets a false alarm through', at: 'let a false alarm through'},
  {text: 'brings its own blind spots', at: 'or bring blind spots'},
];

const PhaseMerger: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const decidesAt = cue('and that step decides');
  const badAt = cue('A bad merger can drop');
  const mid = MERGE.top + MERGE.height / 2;
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, start, 30)}}>
        <Eyebrow>Someone has to merge the reports</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Who merges the findings?</div>
      </div>
      {IN_Y.map((y, i) => (
        <Box key={y} style={{left: 120, top: y, width: 440, height: 90, ...fadeUp(frame, start + 6 + i * 4, 20)}}>
          <div style={{fontSize: type.small, fontWeight: 600}}>Reviewer {i + 1} · report</div>
        </Box>
      ))}
      <Lines>
        {IN_Y.map((y, i) => (
          <path
            key={y}
            d={`M 560 ${y + 45} C ${MERGE.left - 120} ${y + 45}, ${MERGE.left - 120} ${mid}, ${MERGE.left} ${mid}`}
            fill="none"
            stroke={colors.muted}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - prog(frame, start + 14 + i * 3, 20)}
          />
        ))}
        <g opacity={prog(frame, decidesAt, 20)} stroke={colors.accent} strokeWidth={3} fill="none">
          <line x1={MERGE.left + MERGE.width} x2={SEES.left - 8} y1={mid} y2={mid} />
          <path d={`M ${SEES.left - 22} ${mid - 10} L ${SEES.left - 8} ${mid} L ${SEES.left - 22} ${mid + 10}`} />
        </g>
      </Lines>
      <Box accent style={{left: MERGE.left, top: MERGE.top, width: MERGE.width, height: MERGE.height, ...fadeUp(frame, start + 10, 22)}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>Merger</div>
        <div style={{fontSize: type.caption, color: colors.muted, marginTop: 4}}>combines the reports</div>
      </Box>
      <Box style={{left: SEES.left, top: SEES.top, width: SEES.width, height: SEES.height, ...fadeUp(frame, decidesAt, 22)}}>
        <div style={{fontSize: 36, fontWeight: 600}}>What the author sees</div>
      </Box>
      <div style={{position: 'absolute', left: 120, top: 800, display: 'flex', gap: 18}}>
        <Eyebrow style={{alignSelf: 'center', marginRight: 6, ...fadeUp(frame, badAt, 20)}}>A bad merger</Eyebrow>
        {RISKS.map((r) => (
          <Chip key={r.text} style={{height: 64, fontSize: type.small, ...fadeUp(frame, cue(r.at), 18, 8)}}>
            {r.text}
          </Chip>
        ))}
      </div>
    </>
  );
};

const OPTIONS = [
  {text: 'a dedicated merger', at: 'a dedicated merger'},
  {text: 'keep everything', at: 'keeping everything'},
  {text: 'keep only findings two reviewers agree on', at: 'and keeping only findings'},
];

const PhaseMergerOptions: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const fixedAt = cue('For fair comparisons');
  const sepAt = cue('The judge itself');
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, start, 30)}}>
        <Eyebrow>So we compare</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Ways to merge</div>
      </div>
      {OPTIONS.map((o, i) => (
        <Card key={o.text} style={{left: 120 + i * 570, top: 300, width: 540, height: 190, ...fadeUp(frame, cue(o.at), 20, 8)}}>
          <div style={{fontSize: 40, fontWeight: 600, lineHeight: 1.25}}>{o.text}</div>
        </Card>
      ))}
      <Card accent style={{left: 120, top: 560, width: 1680, ...fadeUp(frame, fixedAt, 24)}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>
          For fair comparisons: <span style={{color: colors.accent}}>the same fixed, independent merger for every council</span>
        </div>
      </Card>
      <Card dashed style={{left: 120, top: 720, width: 1680, ...fadeUp(frame, sepAt, 24)}}>
        <Eyebrow>Tested separately</Eyebrow>
        <div style={{fontSize: type.small, marginTop: 10}}>the judge itself as merger · a merger that evolves with the council</div>
      </Card>
    </>
  );
};

export const Scene13WinningCouncil: React.FC = () => {
  const frame = useCurrentFrame();
  const mAt = cue('Someone has to merge those reports');
  const oAt = cue('So we compare a dedicated merger');
  const wAt = cue('A council wins by');
  const example = 1;
  return (
    <SceneFrame sceneId="s13">
      <div style={{position: 'absolute', left: 120, top: 84, opacity: phase(frame, 0, mAt) + phase(frame, wAt)}}>
        <div style={{position: 'relative'}}>
          <div style={{opacity: example}}>
            <Eyebrow>End of a run</Eyebrow>
            <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>What a winning council could look like</div>
          </div>
        </div>
      </div>
      {/* Pinned label: everything before the audit is an example */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 96,
          padding: '10px 20px',
          borderRadius: 8,
          border: `2px solid ${colors.accent}`,
          fontFamily: fonts.mono,
          fontSize: type.caption,
          letterSpacing: 3,
          color: colors.accent,
          opacity: prog(frame, 6, 24) * example,
        }}
      >
        EXAMPLE
      </div>
      {frame < mAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, mAt)}}>
          <PhaseCouncil frame={frame} />
        </div>
      )}
      {frame >= mAt - 10 && frame < oAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, mAt, oAt)}}>
          <PhaseMerger frame={frame} start={mAt} />
        </div>
      )}
      {frame >= oAt - 10 && frame < wAt + 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, oAt, wAt)}}>
          <PhaseMergerOptions frame={frame} start={oAt} />
        </div>
      )}
      {frame >= wAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, wAt)}}>
          <PhaseWinning frame={frame} start={wAt} />
        </div>
      )}
      <Caption style={{opacity: example}}>Example council, not a measured result.</Caption>
    </SceneFrame>
  );
};
