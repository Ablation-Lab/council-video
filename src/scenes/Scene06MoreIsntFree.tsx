import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Chip, TREE_ROOT, TreeNode} from '../components/Tree';
import {Heading, PartMarker, Tag, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s06');

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
// Shared by the shaded zone and its legend swatch so they match exactly.
const ZONE_OPACITY = 0.24;

const pathFor = (f: (n: number) => number) => {
  const pts: string[] = [];
  for (let n = 1; n <= N_MAX; n += 0.25) pts.push(`${px(n).toFixed(1)},${py(f(n)).toFixed(1)}`);
  return `M ${pts.join(' L ')}`;
};

const Chart: React.FC<{frame: number}> = ({frame}) => {
  const qDraw = prog(frame, cue('add reviewers'), 50);
  const cDraw = prog(frame, cue('costs tokens'), 50);
  const ceiling = prog(frame, cue('hits a ceiling'), 24);
  const gap = prog(frame, cue('Tokens are what you pay for'), 30);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <clipPath id="s06-plot">
            <rect x={P.left} y={P.top} width={P.right - P.left} height={P.bottom - P.top} />
          </clipPath>
          {/* Cost is dashed, so it's revealed by a growing clip instead of a dash offset. */}
          <clipPath id="s06-costReveal">
            <rect x={P.left} y={0} width={(P.right - P.left) * cDraw} height={1080} />
          </clipPath>
        </defs>
        <line x1={P.left} x2={P.right} y1={P.bottom} y2={P.bottom} stroke={colors.line} strokeWidth={2} />
        <line x1={P.left} x2={P.left} y1={P.top} y2={P.bottom} stroke={colors.line} strokeWidth={2} />
        <g clipPath="url(#s06-plot)">
          <rect x={px(KNEE)} y={P.top} width={P.right - px(KNEE)} height={P.bottom - P.top} fill={colors.accent} opacity={ZONE_OPACITY * gap} />
          {/* Solid edge so the zone's start reads clearly */}
          <line x1={px(KNEE)} x2={px(KNEE)} y1={P.top} y2={P.bottom} stroke={colors.accent} strokeWidth={3} opacity={gap} />
          <line x1={P.left} x2={P.right} y1={py(1)} y2={py(1)} stroke={colors.muted} strokeWidth={2} strokeDasharray="6 10" opacity={ceiling} />
          <path d={pathFor(cost)} fill="none" stroke={colors.muted} strokeWidth={4} strokeDasharray="14 10" clipPath="url(#s06-costReveal)" />
          <path d={pathFor(quality)} fill="none" stroke={colors.text} strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - qDraw} />
        </g>
      </svg>
      {[1, 5, 10, 15, 20].map((n) => (
        <div
          key={n}
          style={{position: 'absolute', left: px(n) - 30, width: 60, top: P.bottom + 14, textAlign: 'center', fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted}}
        >
          {n}
        </div>
      ))}
      <div style={{position: 'absolute', left: P.left, top: P.bottom + 58, fontSize: type.caption, color: colors.muted}}>reviewers on the council →</div>
      <div style={{position: 'absolute', left: P.left + 20, top: py(1) - 46, fontSize: type.caption, color: colors.muted, opacity: ceiling}}>ceiling</div>

      <div style={{position: 'absolute', left: 1280, top: 320, width: 520}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, ...fadeUp(frame, cue('add reviewers'))}}>
          <div style={{width: 48, height: 5, backgroundColor: colors.text}} />
          <span style={{fontSize: type.small}}>quality</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, ...fadeUp(frame, cue('costs tokens'))}}>
          <svg width={48} height={6}>
            <line x1={0} x2={48} y1={3} y2={3} stroke={colors.muted} strokeWidth={5} strokeDasharray="14 8" />
          </svg>
          <span style={{fontSize: type.small, color: colors.muted}}>token cost</span>
        </div>
        <div style={{marginTop: 48, ...fadeUp(frame, cue('Tokens are what you pay for'))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{position: 'relative', width: 48, height: 28}}>
              <div style={{position: 'absolute', inset: 0, backgroundColor: colors.accent, opacity: ZONE_OPACITY}} />
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.accent}} />
            </div>
            <span style={{fontSize: type.small}}>paying more for less</span>
          </div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 24, lineHeight: 1.35, ...fadeUp(frame, cue("a cheaper council that's just as good"), 20)}}>
            A cheaper council that's just as good
            <br />
            is a real win.
          </div>
        </div>
      </div>
    </>
  );
};

/* ---------- The real pre-launch audit ---------- */

// The pre-launch audit's merged report: 17 findings, which reviewer caught each.
// R1 caught 4, R2 3, R3 11; one finding (column 10) was caught by R1 and R3.
const AUDIT_REVIEWERS = [
  {id: 'R1', brief: 'visibility, leaks'},
  {id: 'R2', brief: 'privacy'},
  {id: 'R3', brief: 'accuracy, links'},
];
const AUDIT: string[][] = [
  ['R1'], ['R1'], ['R3'], ['R3'], ['R3'], ['R3'], ['R3'], ['R3'], ['R3'],
  ['R1', 'R3'], ['R2'], ['R2'], ['R1'], ['R3'], ['R3'], ['R3'], ['R2'],
];
const CELL = 56;
const CELL_GAP = 10;
const GRID_LEFT = 520;
const GRID_TOP = 420;

const Audit: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const countAt = cue('Sixteen of their seventeen');
  return (
    <>
      <Heading eyebrow="Before this video went live" title="Three reviewers, different briefs" frame={frame} start={start} />
      <Tag style={{...fadeUp(frame, start + 6, 20)}}>REAL DATA</Tag>
      <div style={{position: 'absolute', left: 120, top: 300, fontSize: type.small, color: colors.muted, ...fadeUp(frame, start + 6, 20)}}>
        A pre-launch audit of this project's public repos
      </div>
      {AUDIT_REVIEWERS.map((r, row) => (
        <div
          key={r.id}
          style={{position: 'absolute', left: 120, top: GRID_TOP + row * (CELL + CELL_GAP), height: CELL, display: 'flex', alignItems: 'center', gap: 16, ...fadeUp(frame, start + 10 + row * 5, 20)}}
        >
          <span style={{fontFamily: fonts.mono, fontSize: type.small}}>{r.id}</span>
          <span style={{fontSize: type.caption, color: colors.muted}}>{r.brief}</span>
        </div>
      ))}
      {AUDIT.map((by, col) =>
        AUDIT_REVIEWERS.map((r, row) => {
          const hit = by.includes(r.id);
          const shared = by.length > 1;
          return (
            <div
              key={`${col}-${row}`}
              style={{
                position: 'absolute',
                left: GRID_LEFT + col * (CELL + CELL_GAP),
                top: GRID_TOP + row * (CELL + CELL_GAP),
                width: CELL,
                height: CELL,
                boxSizing: 'border-box',
                borderRadius: 8,
                border: `2px solid ${hit && shared && frame >= countAt ? colors.muted : hit ? colors.accent : colors.faint}`,
                backgroundColor: hit ? (shared && frame >= countAt ? colors.line : colors.accentSoft) : 'transparent',
                opacity: prog(frame, start + 16 + col * 2, 14),
              }}
            />
          );
        }),
      )}
      <div style={{position: 'absolute', left: GRID_LEFT, top: GRID_TOP + 3 * (CELL + CELL_GAP) + 8, fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, ...fadeUp(frame, start + 30, 20)}}>
        17 findings →
      </div>
      <div style={{position: 'absolute', left: 120, top: 720, display: 'flex', alignItems: 'baseline', gap: 24, ...fadeUp(frame, countAt, 24)}}>
        <span style={{fontSize: 120, fontWeight: 600, color: colors.accent, lineHeight: 1}}>16 of 17</span>
        <span style={{fontSize: type.small, color: colors.muted, lineHeight: 1.3}}>
          caught by only
          <br />
          one reviewer
        </span>
      </div>
      <Caption style={{opacity: prog(frame, countAt, 20)}}>One finding was caught by two reviewers, so the rows add up to 18.</Caption>
    </>
  );
};

export const Scene06MoreIsntFree: React.FC = () => {
  const frame = useCurrentFrame();
  const auditAt = cue('Before this video went live');
  const askAt = cue('So this experiment asks');
  const followAt = cue("We'll follow one small app");
  return (
    <SceneFrame sceneId="s06">
      <PartMarker part={1} frame={frame} />
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, auditAt)}}>
        <Heading eyebrow="The usual fix" title="Add more reviewers" frame={frame} start={0} />
        <Chart frame={frame} />
        <Caption style={{maxWidth: 1300, opacity: prog(frame, cue('studies of multi-agent systems'), 24)}}>
          Shape reported in published research, not this experiment's data.
          <br />
          Kim et al., “Towards a science of scaling agent systems”, Google Research, 2025, revised 2026 (260 setups)
        </Caption>
      </div>
      {frame >= auditAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, auditAt, askAt)}}>
          <Audit frame={frame} start={auditAt} />
        </div>
      )}
      {frame >= askAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, askAt)}}>
          <div style={{position: 'absolute', left: 120, top: 120, width: 1600, ...fadeUp(frame, askAt, 30)}}>
            <Eyebrow>The experiment asks</Eyebrow>
            <div style={{fontSize: 56, fontWeight: 600, lineHeight: 1.2, marginTop: 8}}>How many reviewers is each kind of task worth?</div>
          </div>
          <TreeNode x={TREE_ROOT[0]} y={TREE_ROOT[1]} label="G0" appear={prog(frame, followAt + 6, 24)} />
          <div style={{position: 'absolute', left: 440, top: 470, ...fadeUp(frame, followAt + 14, 28)}}>
            <div style={{fontFamily: fonts.mono, fontSize: 48, fontWeight: 600}}>rename-cli</div>
            <div style={{fontSize: type.small, color: colors.muted, marginTop: 6}}>a small command-line file renamer</div>
          </div>
          <div style={{position: 'absolute', left: 440, top: 620, ...fadeUp(frame, followAt + 30, 28)}}>
            <Eyebrow style={{marginBottom: 14}}>Example council · 3 reviewers</Eyebrow>
            <div style={{display: 'flex', gap: 14}}>
              <Chip>bugs</Chip>
              <Chip>security</Chip>
              <Chip>risky changes</Chip>
            </div>
          </div>
        </div>
      )}
    </SceneFrame>
  );
};
