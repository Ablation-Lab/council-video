import React from 'react';
import {Composition, Series} from 'remotion';
import {Narration} from './components/Narration';
import {PlaceholderScene} from './scenes/PlaceholderScene';
import {Scene01Finding} from './scenes/Scene01Finding';
import {Scene02MoreIsntFree} from './scenes/Scene02MoreIsntFree';
import {Scene03Evolution} from './scenes/Scene03Evolution';
import {Scene04SizeByTask} from './scenes/Scene04SizeByTask';
import {Scene05Fairness} from './scenes/Scene05Fairness';
import {Scene06Gaming} from './scenes/Scene06Gaming';
import {Scene07Pilot} from './scenes/Scene07Pilot';
import {Scene08SideExperiments} from './scenes/Scene08SideExperiments';
import {Scene09Accents} from './scenes/Scene09Accents';
import {Scene10Calculator} from './scenes/Scene10Calculator';
import {FPS, SCENES, sceneDurationInFrames, totalDurationInFrames} from './timing';

const WIDTH = 1920;
const HEIGHT = 1080;

// Built scenes. Anything missing here renders as a placeholder card.
const COMPONENTS: Record<string, React.FC> = {
  s01: Scene01Finding,
  s02: Scene02MoreIsntFree,
  s03: Scene03Evolution,
  s04: Scene04SizeByTask,
  s05: Scene05Fairness,
  s06: Scene06Gaming,
  s07: Scene07Pilot,
  s08: Scene08SideExperiments,
  s09: Scene09Accents,
  s10: Scene10Calculator,
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
