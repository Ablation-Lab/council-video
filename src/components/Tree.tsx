import React from 'react';
import {colors, fonts, type} from '../theme';
import {mix} from '../anim';

export const NODE_W = 200;
export const NODE_H = 108;
// Where the tree's root (G0) sits in every scene, so it reads as one object.
export const TREE_ROOT: [number, number] = [260, 540];

export type NodeState = {
  /** 0→1 entrance. */
  appear: number;
  /** 0→1 move into the "kept" (accent) style. */
  kept?: number;
  /** 0→1 move into the "discarded" (dashed, faded) style. */
  discard?: number;
  /** 0→1 winner ring. */
  ring?: number;
  /** 0→1 general dimming without being discarded. */
  dim?: number;
};

/**
 * One node of the Generation Tree, centred on (x, y) in canvas pixels.
 */
export const TreeNode: React.FC<
  NodeState & {
    x: number;
    y: number;
    label: string;
    score?: React.ReactNode;
    sub?: React.ReactNode;
    width?: number;
  }
> = ({x, y, label, score, sub, appear, kept = 0, discard = 0, ring = 0, dim = 0, width = NODE_W}) => {
  const opacity = appear * mix(1, 0.32, discard) * mix(1, 0.45, dim);
  const border = discard > 0.5 ? colors.muted : kept > 0.5 ? colors.accent : colors.line;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - NODE_H / 2,
        width,
        height: NODE_H,
        opacity,
        transform: `translateY(${(1 - appear) * 14}px)`,
        borderRadius: 14,
        border: `2px ${discard > 0.5 ? 'dashed' : 'solid'} ${border}`,
        backgroundColor: kept > 0 && discard < 0.5 ? `rgba(242,165,65,${0.1 * kept})` : colors.panel,
        boxShadow: ring > 0 ? `0 0 0 ${6 * ring}px ${colors.bg}, 0 0 0 ${9 * ring}px ${colors.accent}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted}}>{label}</span>
        {score !== undefined && (
          <span
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: kept > 0.5 && discard < 0.5 ? colors.accent : colors.text,
              textDecoration: discard > 0.5 ? 'line-through' : 'none',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {score}
          </span>
        )}
      </div>
      {sub !== undefined && (
        <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, marginTop: 2}}>
          {sub}
        </div>
      )}
    </div>
  );
};

/**
 * Edge between two nodes, drawn from the right side of `from` to the left side
 * of `to`. Rendered inside a full-canvas <svg>.
 */
export const TreeEdge: React.FC<{
  from: [number, number];
  to: [number, number];
  draw: number;
  kept?: number;
  discard?: number;
  fromWidth?: number;
  toWidth?: number;
}> = ({from, to, draw, kept = 0, discard = 0, fromWidth = NODE_W, toWidth = NODE_W}) => {
  const x1 = from[0] + fromWidth / 2;
  const y1 = from[1];
  const x2 = to[0] - toWidth / 2;
  const y2 = to[1];
  const mx = (x1 + x2) / 2;
  const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  const stroke = kept > 0.5 && discard < 0.5 ? colors.accent : colors.muted;
  return (
    <g opacity={mix(1, 0.4, discard)}>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - draw}
        opacity={1 - discard}
      />
      {discard > 0 && (
        <path d={d} fill="none" stroke={colors.muted} strokeWidth={2.5} strokeDasharray="8 10" opacity={discard} />
      )}
    </g>
  );
};

/** Full-canvas SVG layer for edges and other line work. */
export const Lines: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}
  >
    {children}
  </svg>
);

/** Small rounded label, e.g. a reviewer focus area. */
export const Chip: React.FC<{children: React.ReactNode; accent?: boolean; style?: React.CSSProperties}> = ({
  children,
  accent,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 48,
      padding: '0 18px',
      borderRadius: 24,
      border: `2px solid ${accent ? colors.accent : colors.line}`,
      color: accent ? colors.accent : colors.text,
      fontSize: type.caption,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);
