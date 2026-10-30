import React from 'react';

// Icons are drawn as SVG rather than font glyphs so they render identically
// whatever fonts are available at render time.

export const Check: React.FC<{size?: number; color: string}> = ({size = 32, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path
      d="M4 12.5l5 5L20 6.5"
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Lock: React.FC<{size?: number; color: string}> = ({size = 36, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <rect x={4.5} y={10.5} width={15} height={10} rx={2} fill="none" stroke={color} strokeWidth={2} />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke={color} strokeWidth={2} />
  </svg>
);

export const Folder: React.FC<{size?: number; color: string}> = ({size = 32, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path
      d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </svg>
);
