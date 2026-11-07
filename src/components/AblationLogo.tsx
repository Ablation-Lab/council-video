// The Ablation Lab logo (beaker holding a network), drawn from the same
// geometry as the channel and site logo (ablationlab.org assets/logo.svg),
// without its background tile so it sits on the slide. It enters calmly: the
// beaker outline takes the section's brief amber highlight and settles to the
// text colour, then the network inside fades up.
import React from "react";
import { useCurrentFrame } from "remotion";
import { prog } from "../anim";
import { colors } from "../theme";
import { glowColor } from "./Accent";

const EDGES: [number, number, number, number, boolean][] = [
  // x1, y1, x2, y2, dashed (an untested link)
  [198, 276, 180, 326, false],
  [198, 276, 234, 326, false],
  [256, 276, 234, 326, false],
  [256, 276, 276.7, 308.3, true],
  [314, 276, 297.7, 307.4, true],
  [314, 276, 342, 326, false],
  [180, 326, 198, 374, false],
  [234, 326, 198, 374, false],
  [234, 326, 256, 374, false],
  [256, 374, 276.4, 343.5, true],
  [314, 374, 298.0, 344.5, true],
  [342, 326, 314, 374, false],
];
const NODES: [number, number][] = [
  [198, 276],
  [256, 276],
  [314, 276],
  [180, 326],
  [234, 326],
  [342, 326],
  [198, 374],
  [256, 374],
  [314, 374],
];

/** `at`: the frame the logo starts to enter. `duration`: frames for it to arrive. */
export const AblationLogo: React.FC<{
  size: number;
  at: number;
  duration: number;
  style?: React.CSSProperties;
}> = ({ size, at, duration, style }) => {
  const frame = useCurrentFrame();
  const outline = glowColor(frame, at, colors.text);
  const net = prog(frame, at + duration / 3, duration);
  return (
    <svg
      viewBox="100 84 302 336"
      width={size}
      height={(size * 336) / 302}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <g opacity={net}>
        <line
          x1={152}
          y1={238}
          x2={360}
          y2={238}
          stroke={colors.text}
          strokeWidth={3}
          opacity={0.28}
          strokeLinecap="round"
        />
        {/* The cluster spans x 166–356 (centre 261) but the glass's inner faces are at
            148.5 and 363.5 (centre 256): shift it 5 left so both gaps are 12.5. */}
        <g transform="translate(-5 0)">
          {EDGES.map(([x1, y1, x2, y2, dashed], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.accent}
              strokeWidth={dashed ? 3 : 5}
              strokeLinecap="round"
              opacity={dashed ? 0.3 : 0.55}
              strokeDasharray={dashed ? "2 8" : undefined}
            />
          ))}
          {NODES.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={14} fill={colors.accent} />
          ))}
          <circle
            cx={288}
            cy={326}
            r={14}
            fill="none"
            stroke={colors.accent}
            strokeWidth={4}
            opacity={0.85}
            strokeDasharray="6 5"
          />
        </g>
      </g>
      <g stroke={outline} strokeLinecap="round" opacity={0.7}>
        <line x1={142} y1={150} x2={176} y2={150} strokeWidth={6} />
        <line x1={142} y1={182} x2={164} y2={182} strokeWidth={6} />
        <line x1={142} y1={214} x2={176} y2={214} strokeWidth={6} />
      </g>
      <path
        d="M 116 100 Q 138 102 142 122 L 142 372 Q 142 404 174 404 L 338 404 Q 370 404 370 372 L 370 122 Q 370 106 386 102"
        fill="none"
        stroke={outline}
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
