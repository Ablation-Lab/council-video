import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Card, Citation, Heading, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s02');

/* ---------- What a council is ---------- */

const ROLES = [
  {role: 'Security', brief: 'Look only for security holes.', at: 'security holes, the logic'},
  {role: 'Logic', brief: 'Check the code logic is correct.', at: 'the logic, whether'},
  {role: 'User', brief: 'Check it makes sense for the user.', at: 'whether the app makes sense'},
  {role: 'Privacy', brief: 'Check nothing private leaks.', at: 'or private data leaking'},
];

const Council: React.FC<{frame: number}> = ({frame}) => {
  const briefAt = cue('each with a brief');
  return (
    <>
      <Heading eyebrow="A council" title="Reviewers who never wrote the code" frame={frame} start={0} />
      {ROLES.map((r, i) => {
        const at = cue(r.at);
        const next = i < ROLES.length - 1 ? cue(ROLES[i + 1].at) : Infinity;
        const active = frame >= at && frame < next;
        return (
          <Card
            key={r.role}
            accent={active}
            style={{left: 120 + i * 425, top: 380, width: 400, height: 300, ...fadeUp(frame, 10 + i * 5, 24)}}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <span style={{fontSize: type.body, fontWeight: 600, color: active ? colors.accent : colors.text}}>{r.role}</span>
              <Eyebrow>R{i + 1}</Eyebrow>
            </div>
            <div style={{height: 2, backgroundColor: colors.line, margin: '18px 0'}} />
            <div style={{opacity: prog(frame, Math.min(at, briefAt + 12), 16)}}>
              <div style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted}}>brief</div>
              <div style={{fontSize: 32, lineHeight: 1.3, marginTop: 6}}>“{r.brief}”</div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

/* ---------- The open questions ---------- */

const QUESTIONS = [
  {text: 'catch more?', at: 'catch more than one reviewer'},
  {text: 'behave differently?', at: 'behave differently'},
  {text: 'try to cheat?', at: 'or try to cheat'},
];

const OpenQuestions: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <>
    <Heading eyebrow="Open questions" title="One reviewer, or a council?" frame={frame} start={start} />
    <div style={{position: 'absolute', left: 120, top: 360, display: 'flex', alignItems: 'center', gap: 40, ...fadeUp(frame, start + 6, 24)}}>
      <Card style={{position: 'relative', width: 360, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>1 reviewer</div>
      </Card>
      <div style={{fontSize: type.body, color: colors.muted}}>vs</div>
      <Card accent style={{position: 'relative', width: 360, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>a council</div>
        <div style={{display: 'flex', gap: 10, marginTop: 12}}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{width: 34, height: 34, borderRadius: 17, border: `2px solid ${colors.accent}`}} />
          ))}
        </div>
      </Card>
    </div>
    <div style={{position: 'absolute', left: 120, top: 600, display: 'flex', gap: 24}}>
      {QUESTIONS.map((q) => (
        <div
          key={q.text}
          style={{
            height: 84,
            padding: '0 36px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 42,
            border: `2px solid ${colors.line}`,
            fontSize: type.body,
            ...fadeUp(frame, cue(q.at), 18, 8),
          }}
        >
          Does it {q.text}
        </div>
      ))}
    </div>
  </>
);

/* ---------- Why now: the 2026 study ---------- */

const Motivation: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const holdsAt = cue('We want to know if that holds');
  return (
    <>
      <Heading eyebrow="Open questions, and timely ones" title="A 2026 study" frame={frame} start={start} />
      <Card style={{left: 120, top: 330, width: 1680, ...fadeUp(frame, cue('a 2026 study suggests'), 24)}}>
        <Eyebrow>Small AI models debating</Eyebrow>
        <div style={{fontSize: 52, fontWeight: 600, marginTop: 12, lineHeight: 1.25}}>
          maybe just an expensive way of asking one AI several times
        </div>
      </Card>
      <div style={{position: 'absolute', left: 120, top: 640, ...fadeUp(frame, holdsAt, 24)}}>
        <div style={{fontSize: type.heading, fontWeight: 600}}>
          Does that hold for <span style={{color: colors.accent}}>independent code review?</span>
        </div>
        <div style={{fontSize: type.body, color: colors.muted, marginTop: 16, ...fadeUp(frame, cue('or if fresh eyes'), 20)}}>
          Or do fresh eyes and roles add something real?
        </div>
      </div>
      <Citation title="Beyond Symmetric Agents" who="Ferreira et al., 2026 (preprint)" opacity={prog(frame, cue('a 2026 study suggests'), 20)} />
    </>
  );
};

/* ---------- Roadmap: the two questions ---------- */

const ROADMAP = [
  {n: 1, q: 'Do councils beat one agent?', sub: 'And how big should they be?', at: 'Question one'},
  {n: 2, q: 'Can they evolve to get better?', sub: 'If they do beat one agent', at: 'Question two'},
];

const Roadmap: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <>
    <Heading eyebrow="The plan" title="Two questions" frame={frame} start={start} />
    {ROADMAP.map((r, i) => (
      <Card key={r.n} accent={i === 0} style={{left: 120 + i * 860, top: 360, width: 820, height: 340, ...fadeUp(frame, cue(r.at), 24)}}>
        <div style={{fontFamily: fonts.mono, fontSize: type.small, color: colors.accent, letterSpacing: 3}}>QUESTION {r.n}</div>
        <div style={{fontSize: 56, fontWeight: 600, marginTop: 24, lineHeight: 1.2}}>{r.q}</div>
        <div style={{fontSize: type.body, color: colors.muted, marginTop: 18}}>{r.sub}</div>
      </Card>
    ))}
  </>
);

export const Scene02BigQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const qAt = cue('Does a council catch more');
  const mAt = cue('These are open questions');
  const rAt = cue('These boil down to two questions');
  return (
    <SceneFrame sceneId="s02">
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, qAt)}}>
        <Council frame={frame} />
      </div>
      {frame >= qAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, qAt, mAt)}}>
          <OpenQuestions frame={frame} start={qAt} />
        </div>
      )}
      {frame >= mAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, mAt, rAt)}}>
          <Motivation frame={frame} start={mAt} />
        </div>
      )}
      {frame >= rAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, rAt)}}>
          <Roadmap frame={frame} start={rAt} />
        </div>
      )}
    </SceneFrame>
  );
};
