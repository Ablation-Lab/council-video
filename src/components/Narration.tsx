import React, {createContext, useContext} from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, getScene, getVoiceover, LEAD_IN_S} from '../timing';

/**
 * Volume (0–1) for a given frame of the scene. The full film plays at 1; the
 * teaser ramps it at each cut so excerpts start and end without clicks.
 * `visibleFrom` is the scene frame where playback starts (an excerpt's cut-in),
 * because Remotion counts the volume callback's frames from there when the
 * audio began before it.
 */
export const NarrationVolume = createContext<{volumeAt: (sceneFrame: number) => number; visibleFrom: number}>({
  volumeAt: () => 1,
  visibleFrom: 0,
});

/**
 * Plays a scene's recorded narration, starting after the same lead-in the
 * animation cues assume. Scenes without a recording stay silent.
 * Recordings: public/audio/sceneNN.mp3 (see scripts/normalize-voiceover.mjs).
 */
export const Narration: React.FC<{sceneId: string}> = ({sceneId}) => {
  const {volumeAt, visibleFrom} = useContext(NarrationVolume);
  const clip = getVoiceover(getScene(sceneId));
  if (!clip) return null;
  const lead = Math.round(LEAD_IN_S * FPS);
  // The callback's frame 0 is wherever the audio first becomes audible.
  const firstAudible = Math.max(lead, visibleFrom);
  return (
    <Sequence from={lead} name="Narration" layout="none">
      <Audio src={staticFile(clip.file)} volume={(f) => volumeAt(f + firstAudible)} />
    </Sequence>
  );
};
