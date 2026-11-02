import React from 'react';
import {AbsoluteFill, Freeze, interpolate, Sequence, Series, useCurrentFrame} from 'remotion';
import {Narration, NarrationVolume} from './components/Narration';
import {SceneEdgeFades} from './components/SceneFrame';
import {Scene01Spark} from './scenes/Scene01Spark';
import {Scene03FreshEyes} from './scenes/Scene03FreshEyes';
import {Scene08Evolution} from './scenes/Scene08Evolution';
import {Scene16WhatsNext} from './scenes/Scene16WhatsNext';
import {colors} from './theme';
import {FPS, getScene, makeCue, phraseSpan, sceneDurationInFrames} from './timing';

// Excerpts of the finished film, cut at sentence ends using the recording's
// word timings. Each plays the real scene with its real narration.
type ExcerptSpec = {
  id: string;
  first: string;
  last: string;
  // Freeze the picture just before the element cued here starts to appear,
  // when it would otherwise flicker in right before the cut.
  stillBefore?: {phrase: string; offsetS: number};
};

const EXCERPTS: ExcerptSpec[] = [
  {id: 's01', first: 'This is WinScope', last: 'during a pilot run'},
  {id: 's03', first: 'Then an independent reviewer', last: 'never seen the code caught it'},
  // The 97, round by round, with fixes in between (r4-03-pattern).
  {id: 's03', first: 'Across the pilot', last: 'not proof that councils work'},
  // G2 appears at cue('A second set of tests', -0.6) in Scene08Evolution.
  {id: 's08', first: 'A judge runs fixed tests', last: "If not, it's discarded", stillBefore: {phrase: 'A second set of tests', offsetS: -0.6}},
  {id: 's16', first: 'The GitHub repo is public now', last: 'after the runs'},
];

const PAD_BEFORE = Math.round(0.2 * FPS);
const PAD_AFTER = Math.round(0.35 * FPS);
// Short dip to the background between excerpts, and an audio ramp under it.
const DIP = 5;
const RAMP = 4;
// Ending: still on the repo card, then fade out.
const END_STILL = Math.round(1.5 * FPS);
const END_FADE = FPS;

const SCENES: Record<string, React.FC> = {
  s01: Scene01Spark,
  s03: Scene03FreshEyes,
  s08: Scene08Evolution,
  s16: () => <Scene16WhatsNext endCardOnly withFollow={false} />,
};

const segments = EXCERPTS.map((e, i) => {
  const span = phraseSpan(e.id, e.first, e.last);
  const start = Math.round(span.startS * FPS) - PAD_BEFORE;
  const audioEnd = Math.round(span.endS * FPS) + PAD_AFTER;
  // The last excerpt keeps playing (silently) until the repo URL has fully
  // faded in, so the card it freezes on is complete.
  const isLast = i === EXCERPTS.length - 1;
  const visualEnd = isLast ? Math.max(audioEnd, makeCue('s16')('raw run logs will be', 1) + 26) : audioEnd;
  const stillFrom = e.stillBefore ? makeCue(e.id)(e.stillBefore.phrase, e.stillBefore.offsetS) - 1 : Infinity;
  return {...e, start, audioEnd, visualEnd, isLast, stillFrom};
});

const Excerpt: React.FC<{seg: (typeof segments)[number]}> = ({seg}) => {
  const frame = useCurrentFrame();
  const length = seg.visualEnd - seg.start;
  const Scene = SCENES[seg.id];
  // Volume by scene frame: ramp in at the cut, out at the sentence end.
  const volumeAt = (sceneFrame: number) =>
    interpolate(
      sceneFrame,
      [seg.start, seg.start + RAMP, seg.audioEnd - RAMP, seg.audioEnd],
      [0, 1, 1, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );
  const dip = interpolate(frame, [0, DIP, length - DIP, length], [1, 0, 0, seg.isLast ? 0 : 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      {/* The scene sees its real length, so its own fades behave as in the film. */}
      <Sequence from={-seg.start} durationInFrames={sceneDurationInFrames(getScene(seg.id))} layout="none">
        <NarrationVolume.Provider value={{volumeAt, visibleFrom: seg.start}}>
          {/* The picture may hold still near the end; the narration keeps playing. */}
          <Freeze frame={Math.min(seg.stillFrom, seg.visualEnd)} active={(f) => f >= seg.stillFrom}>
            <Scene />
          </Freeze>
          <Narration sceneId={seg.id} />
        </NarrationVolume.Provider>
      </Sequence>
      <AbsoluteFill style={{backgroundColor: colors.bg, opacity: dip}} />
    </AbsoluteFill>
  );
};

const EndHold: React.FC = () => {
  const frame = useCurrentFrame();
  const last = segments[segments.length - 1];
  const Scene = SCENES[last.id];
  const fade = interpolate(frame, [END_STILL, END_STILL + END_FADE], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      {/* A frozen frame of the repo card; no narration plays here. The scene
          sees its real length so it doesn't treat the hold as its own end. */}
      <Sequence from={-(last.visualEnd - 1)} durationInFrames={sceneDurationInFrames(getScene(last.id))} layout="none">
        <Freeze frame={last.visualEnd - 1}>
          <Scene />
        </Freeze>
      </Sequence>
      <AbsoluteFill style={{backgroundColor: colors.bg, opacity: fade}} />
    </AbsoluteFill>
  );
};

export const teaserDurationInFrames =
  segments.reduce((sum, s) => sum + (s.visualEnd - s.start), 0) + END_STILL + END_FADE;

export const Teaser: React.FC = () => (
  // Excerpts are cut mid-scene, so the scenes' own start/end fades are off;
  // each cut gets the short dip in <Excerpt> instead.
  <SceneEdgeFades.Provider value={false}>
    <Series>
      {segments.map((seg, i) => (
        <Series.Sequence key={i} durationInFrames={seg.visualEnd - seg.start} name={`${seg.id}: ${seg.first}…`}>
          <Excerpt seg={seg} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={END_STILL + END_FADE} name="End card">
        <EndHold />
      </Series.Sequence>
    </Series>
  </SceneEdgeFades.Provider>
);
