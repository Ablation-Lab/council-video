import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Check} from '../components/Icons';
import {Lines} from '../components/Tree';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s05');

// Stage: one shared input feeding three runs, all inside the sandbox.
const BOX = {left: 100, right: 1180, top: 270, bottom: 860};
const INPUT = {left: 140, right: 400, top: 330, bottom: 800};
const TAG = {left: 490, width: 340, height: 112};
const ROWS = [
  {y: 400, setup: '3 reviewers · Sonnet', code: 'run #A7', prior: 14},
  {y: 565, setup: '6 reviewers · Opus', code: 'run #C2', prior: 9},
  {y: 730, setup: '9 reviewers · Opus', code: 'run #F4', prior: 21},
];
const CHAIN_X = [880, 975, 1070];

const RULES = [
  {title: 'Fresh chat', sub: 'no memory, no hint of the hoped-for result', at: 'Every run starts in a fresh chat'},
  {title: 'Blind judging', sub: 'judge never sees the size or model', at: 'The judge scores outputs blind'},
  {title: 'Same inputs', sub: 'same app, starting code and tests', at: 'Every setup gets the same app'},
  {title: 'Sandbox', sub: 'nothing outside the project folder', at: 'And everything runs in a sandbox'},
];

const RunRow: React.FC<{i: number; frame: number}> = ({i, frame}) => {
  const r = ROWS[i];
  const appearAt = cue('Only the council', 0.4 + i * 0.25);
  const fresh = prog(frame, cue('Every run starts in a fresh chat', 0.6), 30);
  const blind = prog(frame, cue('The judge scores outputs blind', 0.4), 20);
  const refresh = prog(frame, cue('Fresh chats stop earlier context'), 15);
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
          <span
            style={{position: 'absolute', opacity: blind, fontFamily: fonts.mono, color: colors.accent, whiteSpace: 'nowrap'}}
          >
            {r.code}
          </span>
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: type.caption,
            color: refresh > 0.5 ? colors.accent : colors.muted,
            marginTop: 6,
            whiteSpace: 'nowrap',
          }}
        >
          {fresh < 1 ? `context: ${prior} prior msgs` : 'context: empty'}
        </div>
      </div>
      {/* A small generation chain per run */}
      <Lines>
        <line
          x1={TAG.left + TAG.width}
          x2={CHAIN_X[2]}
          y1={r.y}
          y2={r.y}
          stroke={colors.line}
          strokeWidth={2.5}
          opacity={kept}
        />
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

export const Scene05Fairness: React.FC = () => {
  const frame = useCurrentFrame();
  const sameAt = cue('Every setup gets the same app', 0.4);
  const same = prog(frame, sameAt, 24);
  const sandboxAt = cue('And everything runs in a sandbox');
  const sandbox = prog(frame, sandboxAt, 45);
  const realAt = cue('The sandbox stops agents touching anything real');
  const perimeter = 2 * (BOX.right - BOX.left + BOX.bottom - BOX.top);

  return (
    <SceneFrame sceneId="s05">
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
        <Eyebrow>Fair comparisons</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Only the council changes</div>
      </div>

      {/* Shared inputs */}
      <div
        style={{
          position: 'absolute',
          left: INPUT.left,
          top: INPUT.top,
          width: INPUT.right - INPUT.left,
          height: INPUT.bottom - INPUT.top,
          boxSizing: 'border-box',
          borderRadius: 12,
          border: `2px solid ${same > 0.5 ? colors.accent : colors.line}`,
          backgroundColor: colors.panel,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 22px',
          gap: 14,
          ...fadeUp(frame, cue('Only the council'), 24),
        }}
      >
        <Eyebrow>Inputs</Eyebrow>
        {['app', 'starting code', 'tests'].map((t) => (
          <div key={t} style={{fontSize: type.caption}}>
            {t}
          </div>
        ))}
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: type.caption,
            color: same > 0.5 ? colors.accent : colors.muted,
            marginTop: 10,
          }}
        >
          3f9c…
        </div>
      </div>
      <Lines>
        {ROWS.map((r, i) => (
          <line
            key={r.y}
            x1={INPUT.right}
            x2={TAG.left}
            y1={r.y}
            y2={r.y}
            stroke={same > 0.5 ? colors.accent : colors.muted}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - prog(frame, cue('Only the council', 0.4 + i * 0.25), 20)}
          />
        ))}
      </Lines>
      {ROWS.map((r) => (
        <div
          key={r.y}
          style={{
            position: 'absolute',
            left: INPUT.right + 8,
            top: r.y - 44,
            fontFamily: fonts.mono,
            fontSize: type.caption,
            color: colors.accent,
            opacity: same,
          }}
        >
          3f9c
        </div>
      ))}

      {ROWS.map((_, i) => (
        <RunRow key={i} i={i} frame={frame} />
      ))}

      {/* Sandbox border draws around the whole stage */}
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
      <div
        style={{
          position: 'absolute',
          left: BOX.left + 24,
          top: BOX.top - 18,
          padding: '0 12px',
          backgroundColor: colors.bg,
          ...fadeUp(frame, sandboxAt + 20, 20, 6),
        }}
      >
        <Eyebrow style={{color: colors.text}}>Sandbox · project folder only</Eyebrow>
      </div>
      <div
        style={{
          position: 'absolute',
          left: BOX.left,
          top: BOX.bottom + 18,
          fontSize: type.caption,
          color: colors.muted,
          ...fadeUp(frame, realAt, 24),
        }}
      >
        Outside: real system, drivers, boot settings. <span style={{color: colors.accent}}>Unreachable.</span>
      </div>

      {/* Rule cards */}
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
                padding: '18px 22px',
                marginBottom: 16,
                borderRadius: 12,
                boxSizing: 'border-box',
                minHeight: 132,
                border: `2px solid ${active ? colors.accent : colors.line}`,
                backgroundColor: colors.panel,
                ...fadeUp(frame, at, 24),
              }}
            >
              <div
                style={{
                  width: 32,
                  paddingTop: 4,
                  fontFamily: fonts.mono,
                  fontSize: type.caption,
                  color: active ? colors.accent : colors.muted,
                }}
              >
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
    </SceneFrame>
  );
};
