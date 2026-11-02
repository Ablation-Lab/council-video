import React from 'react';
import {Composition, Series} from 'remotion';
import {Narration} from './components/Narration';
import {PlaceholderScene} from './scenes/PlaceholderScene';
import {Scene01Spark} from './scenes/Scene01Spark';
import {Scene02BigQuestion} from './scenes/Scene02BigQuestion';
import {Scene03FreshEyes} from './scenes/Scene03FreshEyes';
import {Scene04SimplerFixes} from './scenes/Scene04SimplerFixes';
import {Scene05Homework} from './scenes/Scene05Homework';
import {Scene06MoreIsntFree} from './scenes/Scene06MoreIsntFree';
import {Scene07Size} from './scenes/Scene07Size';
import {Scene08Evolution} from './scenes/Scene08Evolution';
import {Scene09Fairness} from './scenes/Scene09Fairness';
import {Scene10Gaming} from './scenes/Scene10Gaming';
import {Scene11Meet} from './scenes/Scene11Meet';
import {Scene12SideExperiments} from './scenes/Scene12SideExperiments';
import {Scene13WinningCouncil} from './scenes/Scene13WinningCouncil';
import {Scene14Calculator} from './scenes/Scene14Calculator';
import {Scene15Accents} from './scenes/Scene15Accents';
import {Scene16WhatsNext} from './scenes/Scene16WhatsNext';
import {Teaser, teaserDurationInFrames} from './Teaser';
import {FPS, SCENES, sceneDurationInFrames, totalDurationInFrames} from './timing';

const WIDTH = 1920;
const HEIGHT = 1080;

// Built scenes. Anything missing here renders as a placeholder card.
const COMPONENTS: Record<string, React.FC> = {
  s01: Scene01Spark,
  s02: Scene02BigQuestion,
  s03: Scene03FreshEyes,
  s04: Scene04SimplerFixes,
  s05: Scene05Homework,
  s06: Scene06MoreIsntFree,
  s07: Scene07Size,
  s08: Scene08Evolution,
  s09: Scene09Fairness,
  s10: Scene10Gaming,
  s11: Scene11Meet,
  s12: Scene12SideExperiments,
  s13: Scene13WinningCouncil,
  s14: Scene14Calculator,
  s15: Scene15Accents,
  s16: () => <Scene16WhatsNext />,
};

const SceneById: React.FC<{id: string}> = ({id}) => {
  const Component = COMPONENTS[id];
  return (
    <>
      {Component ? <Component /> : <PlaceholderScene sceneId={id} />}
      <Narration sceneId={id} />
    </>
  );
};

// One stable component per scene for the single-scene preview compositions.
const SCENE_PREVIEWS: Record<string, React.FC> = Object.fromEntries(
  SCENES.map((s) => [s.id, () => <SceneById id={s.id} />]),
);

const Explainer: React.FC = () => (
  <Series>
    {SCENES.map((s) => (
      <Series.Sequence key={s.id} durationInFrames={sceneDurationInFrames(s)} name={`${s.chapter} ${s.title}`}>
        <SceneById id={s.id} />
      </Series.Sequence>
    ))}
  </Series>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Explainer"
      component={Explainer}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="Teaser"
      component={Teaser}
      durationInFrames={teaserDurationInFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {SCENES.map((s) => (
      <Composition
        key={s.id}
        id={`Scene${s.chapter}`}
        component={SCENE_PREVIEWS[s.id]}
        durationInFrames={sceneDurationInFrames(s)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
