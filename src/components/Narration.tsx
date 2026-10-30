import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import manifest from '../../public/audio/manifest.json';
import {FPS, LEAD_IN_S} from '../timing';

type Manifest = {scenes: Record<string, {file: string; seconds: number}>};

/**
 * Plays a scene's narration WAV, starting after the same lead-in the
 * animation cues assume. Scenes without a file in public/audio/manifest.json
 * stay silent. Regenerate the temporary voice with `npm run narration`.
 */
export const Narration: React.FC<{sceneId: string}> = ({sceneId}) => {
  const entry = (manifest as Manifest).scenes[sceneId];
  if (!entry) return null;
  return (
    <Sequence from={Math.round(LEAD_IN_S * FPS)} name="Narration" layout="none">
      <Audio src={staticFile(entry.file)} />
    </Sequence>
  );
};
