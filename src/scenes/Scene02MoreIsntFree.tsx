import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Chip, TREE_ROOT, TreeNode} from '../components/Tree';
import {fadeUp, mix, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s02');

// Plot area for the "quality vs cost" chart.
const P = {left: 200, right: 1180, top: 300, bottom: 800};
const Y_MAX = 1.2;
const N_MAX = 20;
const px = (n: number) => P.left + ((n - 1) / (N_MAX - 1)) * (P.right - P.left);
const py = (v: number) => P.bottom - (v / Y_MAX) * (P.bottom - P.top);

// Illustrative shapes only: quality saturates, cost grows linearly.
const quality = (n: number) => 1 - Math.exp(-n / 3.2);
const cost = (n: number) => 0.055 * n;
// Past this size, quality is nearly flat while cost keeps climbing.
const KNEE = 8;

const pathFor = (f: (n: number) => number) => {
  const pts: string[] = [];
  for (let n = 1; n <= N_MAX; n += 0.25) pts.push(`${px(n).toFixed(1)},${py(f(n)).toFixed(1)}`);
  return `M ${pts.join(' L ')}`;
};

const Chart: React.FC<{frame: number}> = ({frame}) => {
  const qDraw = prog(frame, cue('more reviewers'), 50);
  const cDraw = prog(frame, cue('costs tokens'), 50);
  const ceiling = prog(frame, cue('hits a ceiling'), 24);
  const gap = prog(frame, cue('hits a ceiling', 0.8), 30);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <clipPath id="s02-plot">
            <rect x={P.left} y={P.top} width={P.right - P.left} height={P.bottom - P.top} />
          </clipPath>
          {/* Cost is dashed, so it's revealed by a growing clip instead of a dash offset. */}
          <clipPath id="s02-costReveal">
            <rect x={P.left} y={0} width={(P.right - P.left) * cDraw} height={1080} />
          </clipPath>
        </defs>
        {/* Axes */}
        <line x1={P.left} x2={P.right} y1={P.bottom} y2={P.bottom} stroke={colors.line} strokeWidth={2} />
        <line x1={P.left} x2={P.left} y1={P.top} y2={P.bottom} stroke={colors.line} strokeWidth={2} />
        <g clipPath="url(#s02-plot)">
          <rect
            x={px(KNEE)}
            y={P.top}
            width={P.right - px(KNEE)}
            height={P.bottom - P.top}
            fill={colors.accent}
            opacity={0.12 * gap}
          />
          <line
            x1={P.left}
            x2={P.right}
            y1={py(1)}
            y2={py(1)}
            stroke={colors.muted}
            strokeWidth={2}
            strokeDasharray="6 10"
            opacity={ceiling}
          />
          <path
            d={pathFor(cost)}
            fill="none"
            stroke={colors.muted}
            strokeWidth={4}
            strokeDasharray="14 10"
            clipPath="url(#s02-costReveal)"
          />
          <path
            d={pathFor(quality)}
            fill="none"
            stroke={colors.text}
            strokeWidth={5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - qDraw}
          />
        </g>
      </svg>

      {/* Axis labels */}
      {[1, 5, 10, 15, 20].map((n) => (
        <div
          key={n}
          style={{
            position: 'absolute',
            left: px(n) - 30,
            width: 60,
            top: P.bottom + 14,
            textAlign: 'center',
            fontFamily: fonts.mono,
            fontSize: type.caption,
            color: colors.muted,
          }}
        >
          {n}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: P.left,
          top: P.bottom + 58,
          fontSize: type.caption,
          color: colors.muted,
        }}
      >
        reviewers on the council →
      </div>
      <div
        style={{
          position: 'absolute',
          left: P.left + 20,
          top: py(1) - 46,
          fontSize: type.caption,
          color: colors.muted,
          opacity: ceiling,
        }}
      >
        ceiling
      </div>

      {/* Legend + annotations on the right */}
      <div style={{position: 'absolute', left: 1280, top: 320, width: 520}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, ...fadeUp(frame, cue('more reviewers'))}}>
          <div style={{width: 48, height: 5, backgroundColor: colors.text}} />
          <span style={{fontSize: type.small}}>quality</span>
        </div>
        <div
          style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, ...fadeUp(frame, cue('costs tokens'))}}
        >
          <svg width={48} height={6}>
            <line x1={0} x2={48} y1={3} y2={3} stroke={colors.muted} strokeWidth={5} strokeDasharray="14 8" />
          </svg>
          <span style={{fontSize: type.small, color: colors.muted}}>token cost</span>
        </div>
        <div style={{marginTop: 48, ...fadeUp(frame, cue('hits a ceiling', 0.8))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 48, height: 28, backgroundColor: colors.accent, opacity: 0.35, borderRadius: 4}} />
            <span style={{fontSize: type.small}}>paying more for less</span>
          </div>
        </div>
        <div style={{marginTop: 56, ...fadeUp(frame, cue('Identical reviewers'))}}>
          <div style={{display: 'flex', gap: 12}}>
            {[0, 1, 2].map((i) => (
              <Chip key={i} style={{opacity: mix(1, 0.45, i / 2)}}>
                security
              </Chip>
            ))}
          </div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 16, lineHeight: 1.35}}>
            Identical reviewers mostly
            <br />
            repeat each other
          </div>
        </div>
      </div>
    </>
  );
};

export const Scene02MoreIsntFree: React.FC = () => {
  const frame = useCurrentFrame();
  const askAt = cue('So this experiment asks');
  const followAt = cue("We'll follow one small app");
  const chartOut = prog(frame, askAt - 6, 30);
  const statementUp = prog(frame, followAt, 30);

  return (
    <SceneFrame sceneId="s02">
      {chartOut < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - chartOut, transform: `translateX(${-60 * chartOut}px)`}}>
          <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
            <Eyebrow>The usual fix</Eyebrow>
            <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Add more reviewers</div>
          </div>
          <Chart frame={frame} />
          <Caption style={{maxWidth: 1300, opacity: prog(frame, cue('studies of multi-agent systems'), 24)}}>
            Shape reported in published research, not this experiment's data.
            <br />
            Google Research, "Towards a science of scaling agent systems" (180 setups)
          </Caption>
        </div>
      )}

      {/* The question this experiment answers */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: mix(400, 120, statementUp),
          width: 1600,
          ...fadeUp(frame, askAt + 12, 30),
        }}
      >
        <Eyebrow style={{opacity: statementUp}}>The experiment's question</Eyebrow>
        <div
          style={{
            fontSize: mix(type.heading, 48, statementUp),
            fontWeight: 600,
            lineHeight: 1.2,
            marginTop: 8,
            color: statementUp > 0.5 ? colors.muted : colors.text,
          }}
        >
          How many reviewers each kind of task is worth
        </div>
      </div>

      {/* The example app enters as the tree's root */}
      <TreeNode x={TREE_ROOT[0]} y={TREE_ROOT[1]} label="G0" appear={prog(frame, followAt + 6, 24)} />
      <div style={{position: 'absolute', left: 440, top: 470, ...fadeUp(frame, followAt + 14, 28)}}>
        <div style={{fontFamily: fonts.mono, fontSize: 48, fontWeight: 600}}>rename-cli</div>
        <div style={{fontSize: type.small, color: colors.muted, marginTop: 6}}>a small command-line file renamer</div>
      </div>
      <div style={{position: 'absolute', left: 440, top: 620, ...fadeUp(frame, followAt + 30, 28)}}>
        <Eyebrow style={{marginBottom: 14}}>Council · 3 reviewers</Eyebrow>
        <div style={{display: 'flex', gap: 14}}>
          <Chip>bugs</Chip>
          <Chip>security</Chip>
          <Chip>risky changes</Chip>
        </div>
      </div>
    </SceneFrame>
  );
};
