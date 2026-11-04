import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {LucideIcon} from 'lucide-react';
import {colors} from '../theme';
import {glowColor} from './Accent';

/**
 * The film's icon style: thin Lucide line icons, in the muted text grey, or
 * amber only where the box they sit in is already highlighted. At most one per
 * box, placed next to or above the box label, so it fades in with the box.
 * Only for slides that show things or roles, never text-heavy slides.
 * `glowAt`: the frame the box enters; the icon lights amber briefly, then settles to grey.
 */
export const LineIcon: React.FC<{icon: LucideIcon; size?: number; accent?: boolean; glowAt?: number; style?: React.CSSProperties}> = ({
  icon: Icon,
  size = 40,
  accent,
  glowAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const color = accent ? colors.accent : glowAt === undefined ? colors.muted : glowColor(frame, glowAt, colors.muted);
  return <Icon size={size} strokeWidth={1.5} color={color} style={{display: 'block', flexShrink: 0, ...style}} />;
};
