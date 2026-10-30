import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s07');

// Figures from "How the agents built and reviewed WinScope", revision 20 (all 11 rounds).
const TOTAL_TOKENS = 3.7;
const REVIEW_TOKENS = 1.9;
const FINDINGS = [
  {n: 48, label: 'first council', verification: false},
  {n: 10, label: 'first verification', verification: true},
  {n: 25, label: 'privacy audit', verification: false},
  {n: 14, label: 'second verification', verification: true},
];
const TOTAL_FINDINGS = FINDINGS.reduce((s, f) => s + f.n, 0);

const LEFT = 120;
const BAR_W = 980;

const TokenBar: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('About half its 3.7 million');
  const grow = prog(frame, at, 30);
  const split = prog(frame, cue('went on review and verification', -0.2), 24);
  const reviewW = (REVIEW_TOKENS / TOTAL_TOKENS) * BAR_W;
  return (
    <div style={{position: 'absolute', left: LEFT, top: 286, width: BAR_W}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18, ...fadeUp(frame, at, 24)}}>
        <span style={{fontSize: 56, fontWeight: 600}}>~3.7M</span>
        <span style={{fontSize: type.small, color: colors.muted}}>subagent tokens, 11 rounds</span>
      </div>
      <div style={{position: 'relative', marginTop: 14, height: 44}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 44,
            width: BAR_W * grow,
            borderRadius: 6,
            backgroundColor: colors.line,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 44,
            width: reviewW * split,
            borderRadius: 6,
            backgroundColor: colors.accent,
          }}
        />
      </div>
      <div style={{position: 'relative', height: 40, marginTop: 10, fontSize: type.caption}}>
        <span style={{position: 'absolute', left: 0, color: colors.accent, opacity: split}}>
          review + verification ≈ 1.9M
        </span>
        <span style={{position: 'absolute', right: 0, color: colors.muted, opacity: split}}>
          building + fixing ≈ 1.8M
        </span>
      </div>
    </div>
  );
};

const FindingsBar: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('Those rounds found 97 problems');
  const count = Math.round(
    interpolate(frame, [at, at + 30], [0, TOTAL_FINDINGS], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  const verifyAt = cue('Verification after fixes never came back clean');
  const verify = prog(frame, verifyAt, 20);
  let x = 0;
  return (
    <div style={{position: 'absolute', left: LEFT, top: 500, width: BAR_W}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 24, ...fadeUp(frame, at, 24)}}>
        <span style={{fontSize: 120, fontWeight: 600, color: colors.accent, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
          {count}
        </span>
        <span style={{fontSize: type.small, color: colors.muted, lineHeight: 1.3}}>
          problems the builders'
          <br />
          own tests had passed
        </span>
      </div>
      <svg width={BAR_W} height={56} style={{display: 'block', marginTop: 24, overflow: 'visible'}}>
        {FINDINGS.map((f, i) => {
          const w = (f.n / TOTAL_FINDINGS) * BAR_W;
          const x0 = x;
          x += w;
          const p = prog(frame, at + 20 + i * 8, 20);
          return (
            <g key={f.label} opacity={p}>
              <rect
                x={x0 + 2}
                y={0}
                width={Math.max(0, w - 4)}
                height={56}
                rx={5}
                fill={f.verification ? colors.faint : colors.line}
                stroke={f.verification && verify > 0 ? colors.accent : 'none'}
                strokeWidth={3 * verify}
              />
              <text
                x={x0 + w / 2}
                y={38}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize={type.caption}
                fill={colors.text}
              >
                {f.n}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: 28,
          rowGap: 6,
          marginTop: 14,
          fontSize: type.caption,
          color: colors.muted,
          opacity: prog(frame, at + 40, 20),
        }}
      >
        {FINDINGS.map((f) => (
          <span key={f.label} style={{color: f.verification && verify > 0.5 ? colors.accent : colors.muted}}>
            {f.n} {f.label}
          </span>
        ))}
      </div>
      <div style={{fontSize: type.caption, color: colors.accent, marginTop: 10, ...fadeUp(frame, verifyAt + 16, 20, 6)}}>
        Every verification round found more.
      </div>
    </div>
  );
};

const NAMED = [
  {title: 'Privilege escalation', detail: 'admin writes to user AppData'},
  {title: 'Recycle Bin', detail: 'wrong file affected'},
];

const FindingsLog: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('and every serious bug came from');
  return (
    <div style={{position: 'absolute', left: 1200, top: 286, width: 600, ...fadeUp(frame, at, 24)}}>
      <Eyebrow>Serious findings</Eyebrow>
      {NAMED.map((f, i) => (
        <div
          key={f.title}
          style={{
            marginTop: 14,
            padding: '14px 20px',
            borderRadius: 12,
            border: `2px solid ${colors.line}`,
            backgroundColor: colors.panel,
            ...fadeUp(frame, at + 8 + i * 10, 20),
          }}
        >
          <div style={{fontSize: type.small, fontWeight: 600}}>{f.title}</div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 2}}>{f.detail}</div>
          <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.accent, marginTop: 6}}>
            found by a fresh reviewer
          </div>
        </div>
      ))}
      <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, marginTop: 12, ...fadeUp(frame, at + 30, 20, 6)}}>
        + 95 more
      </div>
    </div>
  );
};

const LIMITS = [
  {text: 'one app, one run', at: 'one app, one run'},
  {text: 'Linux only, not yet run on Windows', at: 'Linux only'},
  {text: 'reviewers inherited saved memory', at: 'reviewers with saved memory'},
  {text: 'council size never varied', at: 'and a fixed council size'},
];

const Limits: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('The limits');
  const variesAt = cue('The formal experiment varies that');
  const varies = prog(frame, variesAt, 20);
  return (
    <div style={{position: 'absolute', left: 1200, top: 720, width: 600, ...fadeUp(frame, at, 24)}}>
      <Eyebrow>Limits</Eyebrow>
      {LIMITS.map((l, i) => {
        const last = i === LIMITS.length - 1;
        return (
          <div
            key={l.text}
            style={{
              fontSize: type.caption,
              marginTop: 6,
              color: last && varies > 0.5 ? colors.accent : colors.text,
              whiteSpace: 'nowrap',
              ...fadeUp(frame, cue(l.at), 16, 6),
            }}
          >
            {last && varies > 0.5 ? 'council size → varied in the experiment' : l.text}
          </div>
        );
      })}
    </div>
  );
};

export const Scene07Pilot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame sceneId="s07">
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
        <Eyebrow>Pilot run · informal</Eyebrow>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 28, marginTop: 6}}>
          <span style={{fontSize: type.heading, fontWeight: 600}}>WinScope, by the numbers</span>
          <span style={{fontSize: type.caption, color: colors.muted, ...fadeUp(frame, 12, 30)}}>
            ~16,000 lines · ~33 min build · 1,051 tests passing
          </span>
        </div>
      </div>
      <TokenBar frame={frame} />
      <FindingsBar frame={frame} />
      <FindingsLog frame={frame} />
      <Limits frame={frame} />
      <Caption>Token counts are self-reported by agents.</Caption>
    </SceneFrame>
  );
};
