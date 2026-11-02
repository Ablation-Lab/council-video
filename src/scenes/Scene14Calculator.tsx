import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {fadeUp, prog, typed} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s14');

const TEMPLATES = ['Basic app', 'Scientific app', 'System-level tool'];

const Selector: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('so anyone can set up a council');
  const open = prog(frame, at + 10, 16) * (1 - prog(frame, at + 60, 16));
  return (
    <div style={{position: 'absolute', left: 120, top: 270, width: 600, ...fadeUp(frame, at, 24)}}>
      <Eyebrow>Task template</Eyebrow>
      <div
        style={{
          marginTop: 12,
          height: 76,
          boxSizing: 'border-box',
          padding: '0 24px',
          borderRadius: 12,
          border: `2px solid ${colors.accent}`,
          backgroundColor: colors.panel,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: type.small,
        }}
      >
        Basic app
        <svg width={24} height={24} viewBox="0 0 24 24">
          <path d="M5 9l7 7 7-7" fill="none" stroke={colors.muted} strokeWidth={2.4} />
        </svg>
      </div>
      {/* Brief dropdown showing the other templates */}
      <div
        style={{
          marginTop: 6,
          borderRadius: 12,
          border: `2px solid ${colors.line}`,
          backgroundColor: colors.panel,
          overflow: 'hidden',
          height: 3 * 58 * open,
          opacity: open,
        }}
      >
        {TEMPLATES.map((t, i) => (
          <div
            key={t}
            style={{
              height: 58,
              lineHeight: '58px',
              padding: '0 24px',
              fontSize: type.caption,
              color: i === 0 ? colors.accent : colors.text,
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

const ESTIMATES = [
  {label: 'token cost', slot: '{tokens}'},
  {label: 'council size and roles', slot: '{N}'},
  {label: 'model mix', slot: '{models}'},
];

const Estimates: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('It estimates the token cost');
  return (
    <div style={{position: 'absolute', left: 120, top: 470, width: 600}}>
      <Eyebrow style={{...fadeUp(frame, at, 20)}}>Estimates</Eyebrow>
      {ESTIMATES.map((e, i) => (
        <div
          key={e.label}
          style={{
            marginTop: 12,
            height: 68,
            boxSizing: 'border-box',
            padding: '0 24px',
            borderRadius: 12,
            border: `2px solid ${colors.line}`,
            backgroundColor: colors.panel,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...fadeUp(frame, at + 6 + i * 8, 20),
          }}
        >
          <span style={{fontSize: type.small}}>{e.label}</span>
          <span style={{fontFamily: fonts.mono, fontSize: type.caption, color: colors.accent}}>{e.slot}</span>
        </div>
      ))}
    </div>
  );
};

const PROMPT = [
  'Spawn {N} reviewers, one role each:',
  '  {roles}.',
  'Reviewers: {model}, {effort}.',
  'Judge: {model}, high effort.',
  'Hard caps: {agents} agents,',
  '  {generations} generations,',
  '  {tokens} tokens.',
];

/** Renders a line with {slots} in the accent colour. */
const Slotted: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split(/(\{[^}]*\}?)/).map((part, i) =>
      part.startsWith('{') ? (
        <span key={i} style={{color: colors.accent}}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    )}
  </>
);

const PromptBlock: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('then writes a prompt');
  // Lines type one after another.
  let offset = at + 12;
  return (
    <div
      style={{
        position: 'absolute',
        left: 840,
        top: 270,
        width: 960,
        boxSizing: 'border-box',
        padding: '22px 30px',
        borderRadius: 12,
        border: `2px solid ${colors.line}`,
        backgroundColor: colors.panel,
        ...fadeUp(frame, at, 24),
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Eyebrow>Ready-to-paste prompt</Eyebrow>
        <Eyebrow style={{color: colors.text}}>copy</Eyebrow>
      </div>
      <div style={{marginTop: 14, fontFamily: fonts.mono, fontSize: 32}}>
        {PROMPT.map((line) => {
          const start = offset;
          offset += Math.ceil((line.length / 45) * 30) + 4;
          return (
            <div key={line} style={{height: 48, lineHeight: '48px', whiteSpace: 'pre'}}>
              <Slotted text={typed(line, frame, start, 45)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FeedbackLoop: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('and what hard caps to apply', 0.6);
  const p = prog(frame, at, 30);
  return (
    <div style={{position: 'absolute', left: 840, top: 760, width: 960, ...fadeUp(frame, at, 20)}}>
      <svg width={960} height={110} style={{position: 'absolute', left: 0, top: 0}}>
        <path
          d="M 300 55 C 420 0, 540 0, 660 55"
          fill="none"
          stroke={colors.accent}
          strokeWidth={3}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - p}
        />
        <path d="M 648 38 L 662 56 L 640 60" fill="none" stroke={colors.accent} strokeWidth={3} opacity={p} />
      </svg>
      {[
        {label: 'real run logs', left: 0},
        {label: 'calculator', left: 660},
      ].map((b) => (
        <div
          key={b.label}
          style={{
            position: 'absolute',
            left: b.left,
            top: 30,
            width: 300,
            height: 70,
            boxSizing: 'border-box',
            borderRadius: 12,
            border: `2px solid ${colors.line}`,
            backgroundColor: colors.panel,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: type.small,
          }}
        >
          {b.label}
        </div>
      ))}
    </div>
  );
};

export const Scene14Calculator: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame sceneId="s14">
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
        <Eyebrow>Built from the winning setups</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Council calculator</div>
      </div>
      <Selector frame={frame} />
      <Estimates frame={frame} />
      <PromptBlock frame={frame} />
      <FeedbackLoop frame={frame} />
      <Caption style={{opacity: prog(frame, cue('then writes a prompt', 1), 20)}}>Slots filled from real run results.</Caption>
    </SceneFrame>
  );
};
