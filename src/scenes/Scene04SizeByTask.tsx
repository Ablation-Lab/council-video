import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s04');

const COL_W = 480;
const COL_X = [120, 720, 1320];
const CHART = {top: 360, height: 280, nMax: 40};

// Hypothesised curves: quality saturates at a different council size per tier.
const TIERS = [
  {tier: 'Tier 1', title: 'Basic app', sub: 'e.g. rename-cli', k: 2.4, knee: 6, label: '~6', units: 1, at: 'A basic app like the renamer'},
  {tier: 'Tier 2', title: 'Scientific app', sub: '', k: 7.5, knee: 20, label: '~20', units: 3, at: 'a scientific app around twenty'},
  {tier: 'Tier 3', title: 'Frontier research', sub: '', k: 40, knee: null, label: 'far more', units: 8, at: 'frontier research far more'},
];

const MiniTree: React.FC = () => (
  <svg width={110} height={56} viewBox="0 0 110 56">
    <path d="M 14 28 C 30 28, 30 12, 46 12 M 14 28 C 30 28, 30 44, 46 44 M 62 12 H 82" stroke={colors.muted} strokeWidth={2} fill="none" />
    <rect x={2} y={20} width={20} height={16} rx={3} fill="none" stroke={colors.accent} strokeWidth={2} />
    <rect x={44} y={4} width={20} height={16} rx={3} fill="none" stroke={colors.accent} strokeWidth={2} />
    <rect x={44} y={36} width={20} height={16} rx={3} fill="none" stroke={colors.muted} strokeWidth={2} strokeDasharray="3 3" />
    <rect x={84} y={4} width={20} height={16} rx={3} fill="none" stroke={colors.accent} strokeWidth={2} />
  </svg>
);

const Column: React.FC<{i: number; frame: number}> = ({i, frame}) => {
  const t = TIERS[i];
  const x0 = COL_X[i];
  const introAt = cue('the same sweep runs on tasks', i * 0.3);
  const drawAt = cue(t.at);
  const draw = prog(frame, drawAt, 45);
  const px = (n: number) => (n / CHART.nMax) * COL_W;
  const py = (v: number) => CHART.height - v * (CHART.height - 20);
  const pts: string[] = [];
  for (let n = 0; n <= CHART.nMax; n += 0.5) pts.push(`${px(n).toFixed(1)},${py(1 - Math.exp(-n / t.k)).toFixed(1)}`);

  return (
    <div style={{position: 'absolute', left: x0, top: 0, width: COL_W}}>
      <div style={{position: 'absolute', top: 246, ...fadeUp(frame, introAt, 24)}}>
        <Eyebrow>{t.tier}</Eyebrow>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 6}}>
          <span style={{fontSize: type.body, fontWeight: 600}}>{t.title}</span>
          {i === 0 && <MiniTree />}
        </div>
        {t.sub && <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, marginTop: 2}}>{t.sub}</div>}
      </div>

      <svg
        width={COL_W}
        height={CHART.height}
        style={{position: 'absolute', top: CHART.top + 30, overflow: 'visible', opacity: prog(frame, introAt, 24)}}
      >
        <line x1={0} x2={COL_W} y1={CHART.height} y2={CHART.height} stroke={colors.line} strokeWidth={2} />
        <line x1={0} x2={0} y1={0} y2={CHART.height} stroke={colors.line} strokeWidth={2} />
        <path
          d={`M ${pts.join(' L ')}`}
          fill="none"
          stroke={colors.text}
          strokeWidth={4}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
        {t.knee !== null ? (
          <line
            x1={px(t.knee)}
            x2={px(t.knee)}
            y1={CHART.height}
            y2={py(1 - Math.exp(-t.knee / t.k))}
            stroke={colors.accent}
            strokeWidth={3}
            strokeDasharray="6 6"
            opacity={prog(frame, drawAt + 30, 20)}
          />
        ) : (
          // Still rising at 40 reviewers: an arrow continues the curve off the chart.
          <path
            d={`M ${COL_W + 8} ${py(1 - Math.exp(-CHART.nMax / t.k))} l 30 -12 m 0 0 l -13 -6 m 13 6 l -6 12`}
            stroke={colors.accent}
            strokeWidth={3}
            fill="none"
            opacity={prog(frame, drawAt + 30, 20)}
          />
        )}
      </svg>
      <div
        style={{
          position: 'absolute',
          top: CHART.top + 30 + CHART.height + 8,
          width: COL_W,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: fonts.mono,
          fontSize: type.caption,
          color: colors.muted,
          opacity: prog(frame, introAt, 24),
        }}
      >
        <span>0</span>
        <span>reviewers</span>
        <span>40</span>
      </div>

      <div style={{position: 'absolute', top: 716, ...fadeUp(frame, drawAt + 24, 24)}}>
        <span style={{fontSize: 72, fontWeight: 600, color: colors.accent}}>{t.label}</span>
        <span style={{fontSize: type.small, color: colors.muted, marginLeft: 16}}>reviewers</span>
      </div>
    </div>
  );
};

export const Scene04SizeByTask: React.FC = () => {
  const frame = useCurrentFrame();
  const guessAt = cue('These are guesses to test');
  const scaleAt = cue('The aim is a rough scale');
  const pulse = prog(frame, guessAt, 15) * (1 - prog(frame, guessAt + 40, 30));

  return (
    <SceneFrame sceneId="s04">
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
        <Eyebrow>Council size by task complexity</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>The same sweep, three tiers</div>
      </div>

      {/* Pinned hypothesis tag */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 96,
          padding: '10px 20px',
          borderRadius: 8,
          border: `2px solid ${colors.accent}`,
          backgroundColor: `rgba(242,165,65,${0.22 * pulse})`,
          fontFamily: fonts.mono,
          fontSize: type.caption,
          letterSpacing: 3,
          color: colors.accent,
          ...fadeUp(frame, 6, 24),
        }}
      >
        HYPOTHESIS
      </div>
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 160,
          fontSize: type.caption,
          color: colors.muted,
          ...fadeUp(frame, guessAt, 24),
        }}
      >
        starting guesses, not results
      </div>

      {TIERS.map((_, i) => (
        <Column key={i} i={i} frame={frame} />
      ))}

      {/* Units of review effort per tier */}
      <div style={{position: 'absolute', left: 120, top: 832, ...fadeUp(frame, scaleAt, 24)}}>
        <Eyebrow>Units of review effort → starting council size for a new task</Eyebrow>
      </div>
      {TIERS.map((t, i) => (
        <div key={t.title} style={{position: 'absolute', left: COL_X[i], top: 884, display: 'flex', gap: 10}}>
          {Array.from({length: t.units}).map((_, u) => (
            <div
              key={u}
              style={{
                width: 34,
                height: 34,
                borderRadius: 5,
                backgroundColor: colors.text,
                opacity: prog(frame, scaleAt + 12 + i * 10 + u * 3, 12),
              }}
            />
          ))}
          {i === 2 && (
            <span
              style={{
                fontSize: type.small,
                color: colors.muted,
                marginLeft: 6,
                lineHeight: '34px',
                opacity: prog(frame, scaleAt + 50, 12),
              }}
            >
              …
            </span>
          )}
        </div>
      ))}
    </SceneFrame>
  );
};
