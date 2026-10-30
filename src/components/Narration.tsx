import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, getScene, getVoiceover, LEAD_IN_S} from '../timing';

/**
 * Plays a scene's recorded narration, starting after the same lead-in the
 * animation cues assume. Scenes without a recording stay silent.
 * Recordings: public/audio/sceneNN.mp3 (see scripts/normalize-voiceover.mjs).
 */
export const Narration: React.FC<{sceneId: string}> = ({sceneId}) => {
  const clip = getVoiceover(getScene(sceneId));
  if (!clip) return null;
  return (
    <Sequence from={Math.round(LEAD_IN_S * FPS)} name="Narration" layout="none">
      <Audio src={staticFile(clip.file)} />
    </Sequence>
  );
};
