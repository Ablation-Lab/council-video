import React, {createContext, useContext} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, layout, type} from '../theme';
import {getScene} from '../timing';

const FADE = 12;

/** False where a parent handles transitions itself (the teaser's excerpts). */
export const SceneEdgeFades = createContext(true);

/**
 * Shared wrapper for every scene: background, chapter tag, and a short fade at
 * the scene's edges. The background never fades, so cuts read as one surface.
 */
export const SceneFrame: React.FC<{
  sceneId: string;
  children: React.ReactNode;
  hideChapter?: boolean;
  /** Longer fade at the end, e.g. for the film's last scene. */
  fadeOutFrames?: number;
}> = ({sceneId, children, hideChapter, fadeOutFrames = FADE}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scene = getScene(sceneId);
  const edgeFades = useContext(SceneEdgeFades);
  const opacity = !edgeFades ? 1 : interpolate(
    frame,
    [0, FADE, durationInFrames - fadeOutFrames, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg, fontFamily: fonts.sans, color: colors.text}}>
      <AbsoluteFill style={{opacity}}>
        {children}
        {!hideChapter && (
          <div
            style={{
              position: 'absolute',
              left: layout.margin,
              bottom: 64,
              fontFamily: fonts.mono,
              fontSize: type.caption,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: colors.muted,
            }}
          >
            <span style={{color: colors.accent}}>{scene.chapter}</span>
            <span style={{margin: '0 14px', color: colors.line}}>/</span>
            {scene.title}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Bottom-right note used whenever numbers on screen are not real data. */
export const Caption: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      right: layout.margin,
      bottom: 64,
      maxWidth: 1000,
      textAlign: 'right',
      fontSize: type.caption,
      fontStyle: 'italic',
      color: colors.muted,
      lineHeight: 1.35,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small uppercase label used above panels. */
export const Eyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontSize: type.caption,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: colors.muted,
      ...style,
    }}
  >
    {children}
  </div>
);
