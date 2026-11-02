import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Caveat} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s01');

/* ---------- Opening: what an agent is, and why reviewers matter ---------- */

const Intro: React.FC<{frame: number}> = ({frame}) => {
  const moreAt = cue('They now write more code');
  const trustAt = cue('so we need AI reviewers');
  const ABILITIES = ['write files', 'run code', 'use tools'];
  return (
    <div style={{position: 'absolute', left: 120, top: 250, width: 1680}}>
      <Eyebrow style={{...fadeUp(frame, 0, 24)}}>AI agents</Eyebrow>
      <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 10, ...fadeUp(frame, 4, 24)}}>
        AIs that act on their own
      </div>
      <div style={{display: 'flex', gap: 18, marginTop: 30}}>
        {ABILITIES.map((a) => (
          <div
            key={a}
            style={{
              height: 72,
              padding: '0 28px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 36,
              border: `2px solid ${colors.line}`,
              fontSize: type.small,
              ...fadeUp(frame, cue(a), 18, 8),
            }}
          >
            {a}
          </div>
        ))}
      </div>
      <div style={{fontSize: type.body, marginTop: 70, color: colors.muted, ...fadeUp(frame, moreAt, 24)}}>
        More code than people can review
      </div>
      <div style={{fontSize: type.heading, fontWeight: 600, color: colors.accent, marginTop: 14, ...fadeUp(frame, trustAt, 24)}}>
        So we need AI reviewers we can trust
      </div>
    </div>
  );
};

/* ---------- The pilot's headline number ---------- */

const Hook: React.FC<{frame: number}> = ({frame}) => {
  const winscopeAt = cue('This is WinScope');
  const roundsAt = cue('Over four review rounds');
  const numberAt = cue('found 97 problems');
  const oneAt = cue('and one was hiding');
  const caveatAt = cue('It was a single pilot');
  const count = Math.round(
    interpolate(frame, [numberAt, numberAt + 18], [0, 97], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, winscopeAt, 30)}}>
        <Eyebrow>Pilot run</Eyebrow>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 6}}>
          <span style={{fontSize: type.heading, fontWeight: 600}}>WinScope</span>
          <span style={{fontSize: type.small, color: colors.muted}}>a Windows app built by AI agents</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 330, width: 1680}}>
        {/* The 97 built up over several rounds, with fixes in between: never one pass. */}
        <div style={{fontFamily: fonts.mono, fontSize: type.small, color: colors.accent, ...fadeUp(frame, roundsAt, 20)}}>
          over 4 review rounds
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 40, marginTop: 8, ...fadeUp(frame, numberAt, 20)}}>
          <span style={{fontSize: 240, fontWeight: 700, lineHeight: 1, letterSpacing: -8, color: colors.accent, fontVariantNumeric: 'tabular-nums'}}>
            {count}
          </span>
          <span style={{fontSize: type.heading, fontWeight: 600, lineHeight: 1.15}}>
            problems the
            <br />
            authors had missed
          </span>
        </div>
        <div style={{fontSize: type.body, color: colors.muted, marginTop: 30, ...fadeUp(frame, oneAt, 20)}}>
          one was in code the AI had already <span style={{color: colors.accent}}>checked itself</span>
        </div>
        <div style={{marginTop: 50, ...fadeUp(frame, caveatAt, 20, 8)}}>
          <Caveat>a single pilot · could be how one AI behaves</Caveat>
        </div>
      </div>
    </>
  );
};

export const Scene01Spark: React.FC = () => {
  const frame = useCurrentFrame();
  const winscopeAt = cue('This is WinScope');
  const introOut = prog(frame, winscopeAt - 12, 16);
  const questionAt = cue('But it raised a bigger question');
  const hookOut = prog(frame, questionAt - 8, 18);
  return (
    <SceneFrame sceneId="s01" hideChapter={hookOut > 0.5}>
      {introOut < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - introOut}}>
          <Intro frame={frame} />
        </div>
      )}
      {hookOut < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: (1 - hookOut) * prog(frame, winscopeAt - 8, 16)}}>
          <Hook frame={frame} />
        </div>
      )}
      {/* Title card: the question the film is about. */}
      <div style={{position: 'absolute', left: 120, top: 400, width: 1680, ...fadeUp(frame, questionAt + 4, 36)}}>
        <div style={{fontSize: type.title, fontWeight: 600, letterSpacing: -1}}>Evolving Review Councils</div>
        <div style={{fontSize: type.body, color: colors.muted, marginTop: 18, ...fadeUp(frame, cue('what happens when'), 30)}}>
          What happens when a whole group of reviewers checks the work?
        </div>
      </div>
    </SceneFrame>
  );
};
