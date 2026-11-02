import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Check} from '../components/Icons';
import {Card, Citation, Heading, PartMarker, Tag, phase} from '../components/Kit';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s05');

/* ---------- The core hypothesis: different models ---------- */

const Dots: React.FC<{tints: string[]}> = ({tints}) => (
  <div style={{display: 'flex', gap: 12, marginTop: 20}}>
    {tints.map((t, i) => (
      <div key={i} style={{width: 44, height: 44, borderRadius: 22, border: `3px solid ${t}`, backgroundColor: colors.bg}} />
    ))}
  </div>
);

const Diverse: React.FC<{frame: number}> = ({frame}) => {
  const copiesAt = cue('Three copies of one strong model');
  const diffAt = cue('Different strong models might');
  const debateAt = cue('But debate studies');
  const notReviewAt = cue("debate isn't independent review");
  const aloneAt = cue('Is it the mix that helps');
  const cards = [
    {title: 'Three copies', sub: 'one model ×3 · same blind spots', tints: [colors.muted, colors.muted, colors.muted], at: copiesAt, accent: false},
    {title: 'Three different models', sub: "might cover each other's blind spots", tints: [colors.accent, colors.text, colors.muted], at: diffAt, accent: true},
    {title: 'Each model alone', sub: 'same budget · the mix, or raw strength?', tints: [colors.text], at: aloneAt, accent: false},
  ];
  return (
    <>
      <Heading eyebrow="Before the third objection" title="Our core hypothesis" frame={frame} start={0} />
      <Tag fill={prog(frame, cue("here's our core hypothesis"), 15) * (1 - prog(frame, cue("here's our core hypothesis", 1.5), 30))} style={{...fadeUp(frame, 6, 24)}}>
        HYPOTHESIS
      </Tag>
      {cards.map((c, i) => (
        <Card key={c.title} accent={c.accent} style={{left: 120 + i * 570, top: 320, width: 540, height: 280, ...fadeUp(frame, c.at, 24)}}>
          <div style={{fontSize: type.body, fontWeight: 600}}>{c.title}</div>
          <Dots tints={c.tints} />
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 22, lineHeight: 1.35}}>{c.sub}</div>
        </Card>
      ))}
      <div style={{position: 'absolute', left: 120, top: 660, width: 1680, ...fadeUp(frame, debateAt, 24), opacity: prog(frame, debateAt, 24) * (1 - prog(frame, aloneAt - 10, 16))}}>
        <div style={{fontSize: type.body}}>
          But debate studies found debate doesn't reliably beat <span style={{color: colors.accent}}>rerunning one model.</span>
        </div>
        <div style={{fontSize: type.small, color: colors.muted, marginTop: 16, ...fadeUp(frame, notReviewAt, 20)}}>
          Debate isn't independent review, so we test this rather than assume it.
        </div>
      </div>
      <Citation
        who="Ferreira et al., 2026 (preprint) · “Should We Be Going MAD?” · Smit et al., ICML 2024"
        opacity={prog(frame, debateAt, 20) * (1 - prog(frame, aloneAt - 10, 16))}
      />
      <Citation
        title="Understanding Agent Scaling … via Diversity"
        who="Yang et al., 2026 (preprint)"
        opacity={prog(frame, copiesAt, 20) * (1 - prog(frame, debateAt - 10, 16))}
      />
    </>
  );
};

const Cost: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <>
    <Heading eyebrow="If diverse councils win" title="They may cost more" frame={frame} start={start} />
    <div style={{position: 'absolute', left: 120, top: 380, display: 'flex', alignItems: 'center', gap: 36}}>
      <Card style={{position: 'relative', width: 520, ...fadeUp(frame, start + 6, 24)}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>Diverse council</div>
        <div style={{fontSize: type.caption, color: colors.muted, marginTop: 8}}>may cost more</div>
      </Card>
      <svg width={120} height={40} style={{opacity: prog(frame, cue('the calculator could weigh'), 20)}}>
        <line x1={0} x2={104} y1={20} y2={20} stroke={colors.accent} strokeWidth={3} />
        <polyline points="92,8 108,20 92,32" fill="none" stroke={colors.accent} strokeWidth={3} />
      </svg>
      <Card accent style={{position: 'relative', width: 760, ...fadeUp(frame, cue('the calculator could weigh'), 24)}}>
        <div style={{fontSize: type.body, fontWeight: 600}}>The calculator weighs it against risk</div>
        <div style={{fontSize: type.caption, color: colors.accent, marginTop: 8, ...fadeUp(frame, cue('keeping them for high-risk code'), 20)}}>
          kept for high-risk code
        </div>
      </Card>
    </div>
  </>
);

/* ---------- Objection 3: a smarter model, marking its own homework ---------- */

const Homework: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const markingAt = cue('marking its own homework');
  const benefitAt = cue('may give itself the benefit');
  const betterAt = cue('A better model is still');
  const researchAt = cue('Related research finds models');
  const hypAt = cue('So our second hypothesis');
  const tick = prog(frame, benefitAt, 20);
  return (
    <>
      <Heading eyebrow="Objection 3" title="Why not just use a smarter model?" frame={frame} start={start} />
      <div style={{position: 'absolute', left: 120, top: 300, fontSize: 56, fontWeight: 600, color: colors.accent, ...fadeUp(frame, markingAt, 24)}}>
        Marking its own homework
      </div>
      {/* One AI as both writer and marker */}
      <div style={{position: 'absolute', left: 120, top: 420, display: 'flex', alignItems: 'center', gap: 28, ...fadeUp(frame, markingAt + 8, 24)}}>
        <Card style={{position: 'relative', width: 380, height: 180}}>
          <Eyebrow>Writes the code</Eyebrow>
          <div style={{fontSize: type.body, fontWeight: 600, marginTop: 14}}>AI</div>
        </Card>
        <div style={{fontSize: type.body, color: colors.muted}}>=</div>
        <Card accent={tick > 0.5} style={{position: 'relative', width: 380, height: 180}}>
          <Eyebrow>Marks the code</Eyebrow>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
            <span style={{fontSize: type.body, fontWeight: 600}}>same AI</span>
            <span style={{opacity: tick}}>
              <Check size={52} color={colors.accent} />
            </span>
          </div>
        </Card>
        <div style={{width: 520, fontSize: type.small, color: colors.muted, lineHeight: 1.35, ...fadeUp(frame, benefitAt, 20)}}>
          It knows what it meant, and may give itself the benefit of the doubt.
        </div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 680, fontSize: type.body, ...fadeUp(frame, betterAt, 24), opacity: prog(frame, betterAt, 24) * (1 - prog(frame, hypAt - 10, 16))}}>
        A better model is <span style={{color: colors.accent}}>still marking its own homework.</span>
      </div>
      <div style={{position: 'absolute', left: 120, top: 660, width: 1680, ...fadeUp(frame, hypAt, 24)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
          <Card accent style={{position: 'relative', width: 700, padding: '18px 26px'}}>
            <div style={{fontSize: 36, fontWeight: 600}}>A reviewer who didn't write the code</div>
          </Card>
          <div style={{fontSize: type.body, color: colors.muted}}>vs</div>
          <Card style={{position: 'relative', width: 700, padding: '18px 26px'}}>
            <div style={{fontSize: 36, fontWeight: 600}}>A smarter model checking itself</div>
          </Card>
        </div>
        <div style={{fontSize: type.small, color: colors.accent, marginTop: 18, ...fadeUp(frame, cue('at the same cost'), 20)}}>same cost</div>
      </div>
      <Tag style={{opacity: prog(frame, hypAt, 20)}}>HYPOTHESIS</Tag>
      <Citation
        prefix="Related research:"
        title="LLM Evaluators Recognize and Favor Their Own Generations"
        who="Panickssery et al., NeurIPS 2024"
        opacity={prog(frame, researchAt, 20) * (1 - prog(frame, hypAt + 30, 20))}
      />
    </>
  );
};

const Lead: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <div style={{position: 'absolute', left: 120, top: 440, ...fadeUp(frame, start, 24)}}>
    <div style={{fontSize: type.body, color: colors.muted}}>And if a council does win,</div>
    <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 12}}>
      the next question is <span style={{color: colors.accent}}>size.</span>
    </div>
    <div style={{display: 'flex', gap: 14, marginTop: 30, ...fadeUp(frame, start + 14, 20)}}>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} style={{width: 40, height: 40, borderRadius: 20, border: `2px solid ${n <= 3 ? colors.accent : colors.line}`}} />
      ))}
      <span style={{fontFamily: fonts.mono, fontSize: type.small, color: colors.muted, marginLeft: 10}}>?</span>
    </div>
  </div>
);

export const Scene05Homework: React.FC = () => {
  const frame = useCurrentFrame();
  const costAt = cue('Diverse councils may cost more');
  const objAt = cue('Why not just use a smarter model');
  const leadAt = cue('And if a council does win');
  return (
    <SceneFrame sceneId="s05">
      <PartMarker part={1} frame={frame} />
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, costAt)}}>
        <Diverse frame={frame} />
      </div>
      {frame >= costAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, costAt, objAt)}}>
          <Cost frame={frame} start={costAt} />
        </div>
      )}
      {/* Hard break into the third objection */}
      {frame >= objAt - 2 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, objAt + 6, leadAt, 4)}}>
          <Homework frame={frame} start={objAt + 6} />
        </div>
      )}
      {frame >= leadAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, leadAt)}}>
          <Lead frame={frame} start={leadAt} />
        </div>
      )}
    </SceneFrame>
  );
};
