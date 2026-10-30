import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Chip, Lines} from '../components/Tree';
import {fadeUp, mix, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s08');

/* ---------- Phase A: knockout tournament vs a varied team ---------- */

const BOX_W = 180;
const BOX_H = 56;
const COL_X = [120, 400, 680, 960];
const TOP = 330;
const STEP = 76;
// Index of the winner within each pair, per round. Illustrative.
const ROUNDS = [
  ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'],
  ['R2', 'R3', 'R5', 'R8'],
  ['R3', 'R5'],
  ['R5'],
];
const rowY = (round: number, i: number) => {
  const span = 2 ** round;
  return TOP + STEP * (i * span + (span - 1) / 2);
};

const Bracket: React.FC<{frame: number}> = ({frame}) => {
  const startAt = cue('In a knockout tournament');
  const roundAt = [
    startAt,
    cue('eliminated round by round'),
    cue('eliminated round by round', 1.4),
    cue('until one remains', 0.2),
  ];
  return (
    <>
      <Lines>
        {ROUNDS.slice(1).map((names, r) =>
          names.map((_, i) => {
            const round = r + 1;
            const p = prog(frame, roundAt[round], 20);
            const x1 = COL_X[round - 1] + BOX_W;
            const x2 = COL_X[round];
            const ya = rowY(round - 1, i * 2);
            const yb = rowY(round - 1, i * 2 + 1);
            const y = rowY(round, i);
            const mx = x1 + 40;
            return (
              <path
                key={`${round}-${i}`}
                d={`M ${x1} ${ya} H ${mx} V ${yb} H ${x1} M ${mx} ${y} H ${x2}`}
                fill="none"
                stroke={colors.line}
                strokeWidth={2.5}
                opacity={p}
              />
            );
          }),
        )}
      </Lines>
      {ROUNDS.map((names, round) =>
        names.map((name, i) => {
          const appear = prog(frame, roundAt[round] + (round === 0 ? i * 3 : 6), 20);
          const next = ROUNDS[round + 1];
          const knockedOut = next && !next.includes(name) ? prog(frame, roundAt[round + 1], 20) : 0;
          const champion = round === 3;
          return (
            <div
              key={`${round}-${name}`}
              style={{
                position: 'absolute',
                left: COL_X[round],
                top: rowY(round, i) - BOX_H / 2,
                width: BOX_W,
                height: BOX_H,
                boxSizing: 'border-box',
                borderRadius: 10,
                border: `2px solid ${champion ? colors.accent : colors.line}`,
                backgroundColor: colors.panel,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.mono,
                fontSize: type.caption,
                color: champion ? colors.accent : colors.text,
                opacity: appear * mix(1, 0.3, knockedOut),
                textDecoration: knockedOut > 0.5 ? 'line-through' : 'none',
              }}
            >
              {name}
            </div>
          );
        }),
      )}
      {['Round 1', 'Round 2', 'Final', 'Winner'].map((label, r) => (
        <Eyebrow
          key={label}
          style={{position: 'absolute', left: COL_X[r], top: TOP - 76, opacity: prog(frame, roundAt[r], 20)}}
        >
          {label}
        </Eyebrow>
      ))}
    </>
  );
};

const VARIED = ['Opus · security', 'Sonnet · bugs', 'Opus · risky changes', 'Sonnet · efficiency'];

const Comparison: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('The single winner is then compared');
  const teamAt = cue('compared with a varied team');
  return (
    <div style={{position: 'absolute', left: 1260, top: 254, width: 540}}>
      <div style={{...fadeUp(frame, at, 24)}}>
        <Eyebrow>Compared on hard tests</Eyebrow>
        <div
          style={{
            marginTop: 16,
            padding: '16px 22px',
            borderRadius: 12,
            border: `2px solid ${colors.accent}`,
            backgroundColor: colors.panel,
          }}
        >
          <div style={{fontSize: type.small, fontWeight: 600}}>1 tournament winner</div>
          <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.accent, marginTop: 4}}>R5</div>
        </div>
      </div>
      <div style={{fontSize: type.small, color: colors.muted, margin: '18px 0', ...fadeUp(frame, teamAt, 20)}}>vs</div>
      <div
        style={{
          padding: '16px 22px',
          borderRadius: 12,
          border: `2px solid ${colors.line}`,
          backgroundColor: colors.panel,
          ...fadeUp(frame, teamAt, 24),
        }}
      >
        <div style={{fontSize: type.small, fontWeight: 600}}>A varied team</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14}}>
          {VARIED.map((v, i) => (
            <Chip key={v} style={{opacity: prog(frame, teamAt + 10 + i * 5, 16)}}>
              {v}
            </Chip>
          ))}
        </div>
      </div>
      <div
        style={{
          fontSize: type.caption,
          color: colors.muted,
          marginTop: 16,
          lineHeight: 1.35,
          ...fadeUp(frame, cue('since earlier research suggests'), 20),
        }}
      >
        Earlier research: mixing models and prompts keeps paying off where identical reviewers stall.
      </div>
    </div>
  );
};

const PhaseTournament: React.FC<{frame: number}> = ({frame}) => (
  <>
    <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
      <Eyebrow>Side experiment 1</Eyebrow>
      <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Knockout tournament</div>
    </div>
    <Bracket frame={frame} />
    <div
      style={{
        position: 'absolute',
        left: COL_X[3],
        top: 650,
        width: 240,
        lineHeight: 1.35,
        fontSize: type.caption,
        color: colors.accent,
        ...fadeUp(frame, cue('The hard tests decide each round'), 20, 6),
      }}
    >
      Each round decided by the hard tests, not votes
    </div>
    <Comparison frame={frame} />
  </>
);

/* ---------- Phase B: Split or Steal ---------- */

const CELL_W = 400;
const CELL_H = 220;
const GRID = {left: 1000, top: 360};
const CELLS = [
  {row: 0, col: 0, a: 'share', b: 'share', at: 'If both split'},
  {row: 0, col: 1, a: '0', b: 'all', at: 'If one steals'},
  {row: 1, col: 0, a: 'all', b: '0', at: 'If one steals'},
  {row: 1, col: 1, a: '0', b: '0', at: 'If both steal'},
];

const Finalist: React.FC<{label: string; x: number; frame: number; start: number}> = ({label, x, frame, start}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: 300,
      width: 300,
      height: 100,
      boxSizing: 'border-box',
      borderRadius: 12,
      border: `2px solid ${colors.line}`,
      backgroundColor: colors.panel,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 24,
      ...fadeUp(frame, start, 24),
    }}
  >
    <Eyebrow>Finalist</Eyebrow>
    <div style={{fontFamily: fonts.mono, fontSize: type.small, marginTop: 2}}>{label}</div>
  </div>
);

const PhaseSplitSteal: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const talkAt = cue('They talk');
  const secretAt = cue('each secretly chooses');
  const asideAt = cue("It doesn't affect the review result");
  const measuresAt = cue('It measures cooperation and trust');
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, start, 30)}}>
        <Eyebrow>Side experiment 2 · the two finalists</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Split or Steal</div>
      </div>

      <Finalist label="R3" x={120} frame={frame} start={start + 6} />
      <Finalist label="R5" x={540} frame={frame} start={start + 12} />

      {/* They talk */}
      {[
        {text: 'I plan to split.', left: 120, at: talkAt},
        {text: 'Same here.', left: 540, at: talkAt + 20},
      ].map((m) => (
        <div
          key={m.text}
          style={{
            position: 'absolute',
            left: m.left,
            top: 440,
            padding: '12px 20px',
            borderRadius: 12,
            backgroundColor: colors.faint,
            fontSize: type.caption,
            ...fadeUp(frame, m.at, 20),
          }}
        >
          “{m.text}”
        </div>
      ))}

      {/* Sealed choices */}
      {[120, 540].map((left, i) => (
        <div
          key={left}
          style={{
            position: 'absolute',
            left,
            top: 560,
            width: 300,
            height: 160,
            boxSizing: 'border-box',
            borderRadius: 12,
            border: `2px dashed ${colors.muted}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            ...fadeUp(frame, secretAt + i * 6, 24),
          }}
        >
          <div style={{fontSize: 64, fontWeight: 600, color: colors.muted}}>?</div>
          <div style={{fontSize: type.caption, color: colors.muted}}>sealed choice</div>
        </div>
      ))}

      {/* Payoff matrix */}
      <div style={{position: 'absolute', left: GRID.left, top: GRID.top - 60, width: CELL_W * 2, display: 'flex', ...fadeUp(frame, start + 10, 24)}}>
        <Eyebrow style={{width: CELL_W, textAlign: 'center'}}>R5 splits</Eyebrow>
        <Eyebrow style={{width: CELL_W, textAlign: 'center'}}>R5 steals</Eyebrow>
      </div>
      {['R3 splits', 'R3 steals'].map((label, r) => (
        <Eyebrow
          key={label}
          style={{
            position: 'absolute',
            left: GRID.left - 150,
            width: 130,
            top: GRID.top + r * CELL_H + CELL_H / 2 - 40,
            textAlign: 'right',
            lineHeight: 1.4,
            ...fadeUp(frame, start + 10, 24),
          }}
        >
          {label.split(' ')[0]}
          <br />
          {label.split(' ')[1]}
        </Eyebrow>
      ))}
      {CELLS.map((c) => {
        const lit = prog(frame, cue(c.at), 20);
        return (
          <div
            key={`${c.row}-${c.col}`}
            style={{
              position: 'absolute',
              left: GRID.left + c.col * CELL_W,
              top: GRID.top + c.row * CELL_H,
              width: CELL_W - 12,
              height: CELL_H - 12,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `2px solid ${lit > 0.5 ? colors.accent : colors.line}`,
              backgroundColor: lit > 0 ? `rgba(242,165,65,${0.1 * lit})` : colors.panel,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              opacity: prog(frame, start + 10, 24),
            }}
          >
            <div style={{fontFamily: fonts.mono, fontSize: type.small, color: lit > 0.5 ? colors.text : colors.muted}}>
              R3: {c.a}
            </div>
            <div style={{fontFamily: fonts.mono, fontSize: type.small, color: lit > 0.5 ? colors.text : colors.muted}}>
              R5: {c.b}
            </div>
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 120, top: 780, width: 720}}>
        <div style={{fontSize: type.caption, color: colors.muted, ...fadeUp(frame, asideAt, 20, 6)}}>
          Doesn't change the review result. The hard tests already decided that.
        </div>
        <div style={{fontSize: type.small, color: colors.accent, marginTop: 14, ...fadeUp(frame, measuresAt, 20, 6)}}>
          Measures cooperation, betrayal and trust
        </div>
      </div>
      <Caption style={{opacity: prog(frame, cue('They talk', 1.5), 20)}}>
        Varied: the models, and whether agents know the game repeats.
      </Caption>
    </>
  );
};

export const Scene08SideExperiments: React.FC = () => {
  const frame = useCurrentFrame();
  const bAt = cue('The two finalists then play Split or Steal');
  const aOut = prog(frame, bAt - 12, 18);
  return (
    <SceneFrame sceneId="s08">
      {aOut < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - aOut}}>
          <PhaseTournament frame={frame} />
          <Caption>Illustrative bracket.</Caption>
        </div>
      )}
      {frame >= bAt - 6 && <PhaseSplitSteal frame={frame} start={bAt} />}
    </SceneFrame>
  );
};
