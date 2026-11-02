import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Card} from '../components/Kit';
import {fadeUp, mix, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s11');

const PARTS = ['size', 'roles', 'mix of models'];

export const Scene11Meet: React.FC = () => {
  const frame = useCurrentFrame();
  const meetAt = cue('Now the two questions meet');
  const joinAt = cue('Evolution, together with the size tests');
  const bestAt = cue('is how we search for the best council');
  const join = prog(frame, joinAt, 36);
  const best = prog(frame, bestAt, 24);
  const cards = [
    {n: 1, title: 'Size tests', x: mix(120, 560, join)},
    {n: 2, title: 'Evolution', x: mix(1000, 980, join)},
  ];
  return (
    <SceneFrame sceneId="s11">
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, meetAt, 30)}}>
        <Eyebrow>Now the two questions meet</Eyebrow>
      </div>
      {cards.map((c) => (
        <Card
          key={c.n}
          accent={best > 0.5}
          style={{left: c.x, top: 260, width: 400, height: 200, opacity: prog(frame, meetAt + (c.n - 1) * 8, 24) * mix(1, 0.6, best)}}
        >
          <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.accent, letterSpacing: 3}}>QUESTION {c.n}</div>
          <div style={{fontSize: type.body, fontWeight: 600, marginTop: 18}}>{c.title}</div>
        </Card>
      ))}
      <div style={{position: 'absolute', left: 120, width: 1680, top: 560, textAlign: 'center', ...fadeUp(frame, bestAt, 24)}}>
        <div style={{fontSize: type.heading, fontWeight: 600}}>The search for the best council</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 24, marginTop: 36}}>
          {PARTS.map((p) => (
            <div
              key={p}
              style={{
                height: 84,
                padding: '0 36px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 42,
                border: `2px solid ${colors.accent}`,
                fontSize: type.body,
                ...fadeUp(frame, cue(p === 'size' ? 'its size' : p === 'roles' ? 'its roles' : 'its mix of models'), 18, 8),
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
};
