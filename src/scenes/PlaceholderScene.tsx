import React from 'react';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {colors, type} from '../theme';
import {getScene} from '../timing';

/** Stand-in for scenes not built yet, so the full timeline already has its final length. */
export const PlaceholderScene: React.FC<{sceneId: string}> = ({sceneId}) => {
  const scene = getScene(sceneId);
  return (
    <SceneFrame sceneId={sceneId}>
      <div style={{position: 'absolute', left: 120, top: 120, width: 1680}}>
        <Eyebrow>Scene {scene.chapter} · not built yet</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 8}}>{scene.title}</div>
        <div style={{fontSize: type.small, color: colors.muted, marginTop: 40, lineHeight: 1.5}}>
          {scene.narration}
        </div>
      </div>
    </SceneFrame>
  );
};
