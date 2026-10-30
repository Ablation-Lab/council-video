import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Lock} from '../components/Icons';
import {Lines, NODE_H, NODE_W, TreeEdge, TreeNode} from '../components/Tree';
import {fadeUp, mix, prog, typed} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s06');

const Heading: React.FC<{eyebrow: string; title: string; frame: number; start: number}> = ({
  eyebrow,
  title,
  frame,
  start,
}) => (
  <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, start, 30)}}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>{title}</div>
  </div>
);

/* ---------- Phase A: a branch games the visible tests ---------- */

const G2: [number, number] = [300, 380];
const G3X: [number, number] = [640, 380];
const DIFF = [
  {sign: '+', text: '@pytest.mark.skip(reason="flaky")', hot: true},
  {sign: ' ', text: 'def test_rename_collision():', hot: false},
  {sign: ' ', text: '    src, dst = make_collision()', hot: false},
];
const FLAGS = ['weakens tests', 'skips tests', 'edits tests'];

const PhaseGaming: React.FC<{frame: number}> = ({frame}) => {
  const jumpAt = cue('A branch jumps');
  const diffAt = cue('The diff shows why');
  const hotAt = cue('it skipped the test');
  const heldAt = cue('On the held-out tests');
  const flagsAt = cue('The judge also flags');
  const outAt = cue('so the branch is thrown out');

  const branch = prog(frame, jumpAt, 24);
  const score = Math.round(interpolate(frame, [jumpAt + 10, jumpAt + 40], [71, 94], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  const hot = prog(frame, hotAt, 15);
  const out = prog(frame, outAt, 24);

  return (
    <>
      <Heading eyebrow="Gaming the score" title="A branch that only looks better" frame={frame} start={0} />
      <Lines>
        <TreeEdge from={G2} to={G3X} draw={branch} kept={1 - out} discard={out} />
      </Lines>
      <TreeNode x={G2[0]} y={G2[1]} label="G2" score="71" appear={prog(frame, 6, 24)} kept={1} />
      <TreeNode
        x={G3X[0]}
        y={G3X[1]}
        label="G3′"
        score={frame < jumpAt + 10 ? '–' : score}
        appear={branch}
        kept={1 - out}
        discard={out}
      />
      <div
        style={{
          position: 'absolute',
          left: G3X[0] - 150,
          width: 300,
          top: G3X[1] + NODE_H / 2 + 14,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          whiteSpace: 'nowrap',
          fontFamily: fonts.mono,
          fontSize: type.caption,
          color: colors.accent,
          ...fadeUp(frame, heldAt, 20, 10),
        }}
      >
        <Lock size={26} color={colors.accent} />
        held-out 65
      </div>

      {/* Disqualified stamp */}
      <div
        style={{
          position: 'absolute',
          left: G3X[0] + NODE_W / 2 + 40,
          top: G3X[1] - 36,
          padding: '8px 20px',
          border: `3px solid ${colors.accent}`,
          borderRadius: 8,
          fontFamily: fonts.mono,
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: 4,
          color: colors.accent,
          opacity: out,
          transform: `rotate(-4deg) scale(${mix(1.15, 1, out)})`,
        }}
      >
        DISQUALIFIED
      </div>

      {/* Diff panel */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 520,
          width: 940,
          padding: '18px 24px',
          boxSizing: 'border-box',
          borderRadius: 12,
          border: `2px solid ${colors.faint}`,
          backgroundColor: colors.panel,
          fontFamily: fonts.mono,
          fontSize: 30,
          ...fadeUp(frame, diffAt, 24),
        }}
      >
        <div style={{fontSize: type.caption, color: colors.muted, marginBottom: 10}}>
          diff · tests/test_rename.py
        </div>
        {DIFF.map((d, i) => (
          <div
            key={i}
            style={{
              height: 46,
              lineHeight: '46px',
              whiteSpace: 'pre',
              padding: '0 10px',
              margin: '0 -10px',
              borderRadius: 4,
              borderLeft: d.hot && hot > 0 ? `4px solid ${colors.accent}` : '4px solid transparent',
              backgroundColor: d.hot ? `rgba(242,165,65,${0.16 * hot})` : 'transparent',
              color: d.hot && hot > 0.5 ? colors.accent : d.sign === ' ' ? colors.muted : colors.text,
            }}
          >
            {typed(`${d.sign} ${d.text}`, frame, diffAt + 12 + i * 20, 45)}
          </div>
        ))}
        <div style={{fontFamily: fonts.sans, fontSize: type.caption, color: colors.muted, marginTop: 10, ...fadeUp(frame, hotAt + 10, 20, 6)}}>
          No fix to the code. The failing test was switched off.
        </div>
      </div>

      {/* Judge's test-change checks */}
      <div style={{position: 'absolute', left: 1200, top: 300, width: 600, ...fadeUp(frame, flagsAt, 24)}}>
        <Eyebrow>Judge flags any change that</Eyebrow>
        {FLAGS.map((f, i) => {
          const isHot = i === 1 && frame >= flagsAt + 20;
          return (
            <div
              key={f}
              style={{
                marginTop: 14,
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 22px',
                borderRadius: 12,
                boxSizing: 'border-box',
                border: `2px solid ${isHot ? colors.accent : colors.line}`,
                backgroundColor: colors.panel,
                fontSize: type.small,
                ...fadeUp(frame, flagsAt + 6 + i * 6, 20),
              }}
            >
              <span>{f}</span>
              {isHot && (
                <span style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.accent}}>flagged</span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- Phase B: no channel for collusion ---------- */

const REVIEWERS = [360, 540, 720];
const ORCH = {left: 640, right: 1040, top: 300, bottom: 780};
const LOG = [
  '10:41  R1 → R2  #14',
  '10:41  R3 → R1  #15',
  '10:42  R2 → R3  #16',
  '10:42  R1 → R3  #17',
  '10:43  R2 → R1  #18',
  '10:43  R3 → R2  #19',
  '10:44  R1 → R2  #20',
  '10:44  R3 → R1  #21',
  '10:45  R2 → R3  #22',
  '10:45  R1 → R3  #23',
  '10:46  R3 → R2  #24',
  '10:46  R2 → R1  #25',
];
const LOG_LINE = 44;
const LOG_VISIBLE = 9;

const PhaseCollusion: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const directAt = cue('Agents never message each other directly');
  const orchAt = cue('Everything goes through the orchestrator');
  const paraAt = cue('Messages are paraphrased');
  const judgeAt = cue('The judge sees code and test results');
  const auditAt = cue('And the logs are audited');

  const direct = prog(frame, directAt, 24);
  const directOut = prog(frame, orchAt, 20);
  const strike = prog(frame, directAt + 18, 14);
  const orch = prog(frame, orchAt, 24);
  // Log steps up one line at a time, then stops when the audit begins.
  const raw = interpolate(frame, [orchAt, auditAt], [0, LOG.length - LOG_VISIBLE], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const step = Math.floor(raw);
  const scroll = step + interpolate(raw - step, [0.75, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const audit = prog(frame, auditAt, 20);
  const flaggedIndex = LOG.length - 3;

  return (
    <>
      <Heading eyebrow="Collusion" title="Remove the channels" frame={frame} start={start} />

      {/* Reviewers */}
      {REVIEWERS.map((y, i) => (
        <div
          key={y}
          style={{
            position: 'absolute',
            left: 120,
            top: y - 45,
            width: 240,
            height: 90,
            boxSizing: 'border-box',
            borderRadius: 12,
            border: `2px solid ${colors.line}`,
            backgroundColor: colors.panel,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: type.small,
            ...fadeUp(frame, start + 6 + i * 5, 24),
          }}
        >
          Reviewer {i + 1}
        </div>
      ))}

      <Lines>
        {/* Direct R1 → R3 message, crossed out */}
        <g opacity={direct * (1 - directOut)}>
          <path
            d={`M 360 ${REVIEWERS[0]} C 500 ${REVIEWERS[0]}, 500 ${REVIEWERS[2]}, 360 ${REVIEWERS[2]}`}
            fill="none"
            stroke={colors.muted}
            strokeWidth={2.5}
            strokeDasharray="8 8"
          />
          <g opacity={strike} stroke={colors.accent} strokeWidth={5} strokeLinecap="round">
            <line x1={448} y1={518} x2={492} y2={562} />
            <line x1={492} y1={518} x2={448} y2={562} />
          </g>
        </g>
        {/* Every message routed through the orchestrator */}
        {REVIEWERS.map((y, i) => (
          <line
            key={y}
            x1={360}
            x2={ORCH.left}
            y1={y}
            y2={y}
            stroke={colors.muted}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - prog(frame, orchAt + i * 4, 20)}
          />
        ))}
        <line
          x1={ORCH.right}
          x2={1140}
          y1={410}
          y2={410}
          stroke={colors.muted}
          strokeWidth={2.5}
          opacity={prog(frame, paraAt, 20)}
        />
      </Lines>
      <div
        style={{
          position: 'absolute',
          left: 520,
          top: REVIEWERS[1] - 20,
          fontSize: type.caption,
          color: colors.accent,
          whiteSpace: 'nowrap',
          opacity: strike * (1 - directOut),
        }}
      >
        no direct messages
      </div>

      {/* Orchestrator with its message log */}
      <div
        style={{
          position: 'absolute',
          left: ORCH.left,
          top: ORCH.top,
          width: ORCH.right - ORCH.left,
          height: ORCH.bottom - ORCH.top,
          boxSizing: 'border-box',
          padding: '18px 22px',
          borderRadius: 12,
          border: `2px solid ${colors.text}`,
          backgroundColor: colors.panel,
          opacity: orch,
        }}
      >
        <Eyebrow style={{color: colors.text, whiteSpace: 'nowrap'}}>Orchestrator log</Eyebrow>
        <div style={{position: 'relative', height: LOG_LINE * LOG_VISIBLE, overflow: 'hidden', marginTop: 14}}>
          <div style={{transform: `translateY(${-scroll * LOG_LINE}px)`}}>
            {LOG.map((l, i) => {
              const flagged = i === flaggedIndex && audit > 0;
              return (
                <div
                  key={l}
                  style={{
                    height: LOG_LINE,
                    lineHeight: `${LOG_LINE}px`,
                    fontFamily: fonts.mono,
                    fontSize: type.caption,
                    whiteSpace: 'pre',
                    paddingLeft: 8,
                    borderRadius: 4,
                    color: flagged ? colors.accent : colors.muted,
                    backgroundColor: flagged ? `rgba(242,165,65,${0.16 * audit})` : 'transparent',
                  }}
                >
                  {l}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: ORCH.left,
          top: ORCH.bottom + 14,
          fontSize: type.caption,
          color: colors.accent,
          ...fadeUp(frame, auditAt + 10, 20, 6),
        }}
      >
        audit: odd phrasing, repeated patterns
      </div>

      {/* Paraphrase */}
      <div
        style={{
          position: 'absolute',
          left: 1140,
          top: 300,
          width: 660,
          boxSizing: 'border-box',
          padding: '18px 24px',
          borderRadius: 12,
          border: `2px solid ${colors.line}`,
          backgroundColor: colors.panel,
          ...fadeUp(frame, paraAt, 24),
        }}
      >
        <Eyebrow>Paraphrase</Eyebrow>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 30,
            marginTop: 12,
            color: colors.muted,
            textDecoration: frame > paraAt + 30 ? 'line-through' : 'none',
          }}
        >
          "LGTM 3-3-1, ship it"
        </div>
        <div style={{fontSize: 34, marginTop: 10, ...fadeUp(frame, paraAt + 36, 20, 8)}}>
          → "Reviewer approves the change."
        </div>
      </div>

      {/* Judge */}
      <div
        style={{
          position: 'absolute',
          left: 1140,
          top: 580,
          width: 660,
          boxSizing: 'border-box',
          padding: '18px 24px',
          borderRadius: 12,
          border: `2px solid ${colors.accent}`,
          backgroundColor: colors.panel,
          ...fadeUp(frame, judgeAt, 24),
        }}
      >
        <Eyebrow style={{color: colors.accent}}>Judge sees</Eyebrow>
        <div style={{fontSize: 36, fontWeight: 600, marginTop: 8}}>Final code + test results</div>
        <div style={{fontSize: type.caption, color: colors.muted, marginTop: 6}}>
          never the reviewers' messages or arguments
        </div>
      </div>
    </>
  );
};

/* ---------- Phase C: quieter failure modes ---------- */

const FAILURES = [
  {name: 'Rubber-stamping', check: 'Count real issues raised per reviewer'},
  {name: 'Sandbagging', check: 'Realistic prompts, compared with normal runs'},
  {name: 'Pushing past caps', check: 'Caps enforced by the orchestrator, not the agents'},
  {name: 'Prompt injection', check: 'Reviewed files treated as data, never instructions'},
  {name: 'Noisy results', check: 'Repeat key runs; count only gains that hold'},
  {name: 'Getting stuck', check: 'Stop a generation that repeats without progress'},
];

const PhaseFailures: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <>
    <Heading eyebrow="Each one gets a specific check" title="Quieter failures" frame={frame} start={start} />
    {FAILURES.map((f, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const at = start + 18 + i * 30;
      return (
        <div
          key={f.name}
          style={{
            position: 'absolute',
            left: 120 + col * 570,
            top: 280 + row * 320,
            width: 540,
            height: 290,
            boxSizing: 'border-box',
            padding: '28px 30px',
            borderRadius: 14,
            border: `2px solid ${colors.line}`,
            backgroundColor: colors.panel,
            ...fadeUp(frame, at, 24),
          }}
        >
          <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.accent}}>0{i + 1}</div>
          <div style={{fontSize: type.body, fontWeight: 600, marginTop: 10}}>{f.name}</div>
          <div style={{height: 2, backgroundColor: colors.line, margin: '20px 0'}} />
          <div style={{fontSize: type.small, color: colors.muted, lineHeight: 1.35}}>{f.check}</div>
        </div>
      );
    })}
  </>
);

export const Scene06Gaming: React.FC = () => {
  const frame = useCurrentFrame();
  const bAt = cue('Collusion is harder to see');
  const cAt = cue('Some failures are quieter');
  const aOut = prog(frame, bAt - 12, 18);
  const bOut = prog(frame, cAt - 12, 18);

  return (
    <SceneFrame sceneId="s06">
      {aOut < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - aOut}}>
          <PhaseGaming frame={frame} />
          <Caption>Illustrative example.</Caption>
        </div>
      )}
      {frame >= bAt - 6 && bOut < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - bOut}}>
          <PhaseCollusion frame={frame} start={bAt} />
        </div>
      )}
      {frame >= cAt - 6 && <PhaseFailures frame={frame} start={cAt} />}
    </SceneFrame>
  );
};
