import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Lines, TreeEdge, TreeNode} from '../components/Tree';
import {fadeUp, mix, prog, typed} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s10');

const TEMPLATES = ['Basic app', 'Scientific app', 'System-level tool'];

const Selector: React.FC<{frame: number}> = ({frame}) => {
  const at = cue('You pick a task template');
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
  {label: 'council size', slot: '{N}'},
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
  'Spawn {N} reviewers:',
  '  bugs, security, risky changes.',
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
  const at = cue('Each new run improves the estimates');
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

const DELIVERABLES = [
  {title: 'GitHub repo', sub: 'calculator + this video’s source'},
  {title: 'Write-up', sub: 'results, and why each council size is set where it is'},
  {title: 'Raw run logs', sub: 'every run, so anyone can check'},
];

// A faint copy of the Scene 3 tree behind the end card.
const GhostTree: React.FC = () => {
  const n: Record<string, [number, number]> = {
    G0: [460, 300],
    G1a: [760, 220],
    G1b: [760, 400],
    G2: [1060, 220],
    G3: [1360, 220],
  };
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 0.14}}>
      <Lines>
        <TreeEdge from={n.G0} to={n.G1a} draw={1} kept={1} />
        <TreeEdge from={n.G0} to={n.G1b} draw={1} discard={1} />
        <TreeEdge from={n.G1a} to={n.G2} draw={1} kept={1} />
        <TreeEdge from={n.G2} to={n.G3} draw={1} kept={1} />
      </Lines>
      {Object.entries(n).map(([k, [x, y]]) => (
        <TreeNode key={k} x={x} y={y} label={k} appear={1} kept={k === 'G1b' ? 0 : 1} discard={k === 'G1b' ? 1 : 0} />
      ))}
    </div>
  );
};

const CLOSING = [
  {text: 'WinScope showed a council catches what builders miss.', at: 'WinScope showed'},
  {text: 'The open question is how many reviewers you actually need.', at: 'The open question'},
  {text: "That's the next experiment.", at: "That's the next experiment"},
];

// Ties back to the opening: the WinScope finding, then the question the experiment answers.
const Closing: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: 'absolute', left: 120, top: 150, width: 1680}}>
    {CLOSING.map((l, i) => {
      const last = i === CLOSING.length - 1;
      return (
        <div
          key={l.text}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            height: 80,
            fontSize: 48,
            fontWeight: last ? 600 : 500,
            color: last ? colors.accent : colors.text,
            ...fadeUp(frame, cue(l.at), 30),
          }}
        >
          {l.text}
          {last && (
            <div
              style={{
                width: 120,
                height: 64,
                boxSizing: 'border-box',
                borderRadius: 12,
                border: `2px solid ${colors.accent}`,
                backgroundColor: colors.accentSoft,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 18,
                fontFamily: fonts.mono,
                fontSize: type.caption,
                fontWeight: 400,
                color: colors.muted,
                ...fadeUp(frame, cue(l.at, 0.8), 24),
              }}
            >
              G0
            </div>
          )}
        </div>
      );
    })}
  </div>
);

const EndCard: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const closeAt = cue('WinScope showed');
  // The faint tree is gone before the first closing line appears in its place.
  const settle = prog(frame, closeAt - 20, 20);
  return (
    <>
      <div style={{opacity: prog(frame, start, 40) * (1 - settle)}}>
        <GhostTree />
      </div>
      <div style={{position: 'absolute', inset: 0, opacity: mix(1, 0.55, settle)}}>
        <div style={{position: 'absolute', left: 120, top: 470, ...fadeUp(frame, start + 6, 30)}}>
          <Eyebrow>Everything is public</Eyebrow>
          <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Evolving Review Councils</div>
        </div>
        <div style={{position: 'absolute', left: 120, top: 640, display: 'flex', gap: 30}}>
          {DELIVERABLES.map((d, i) => (
            <div
              key={d.title}
              style={{
                width: 540,
                boxSizing: 'border-box',
                padding: '22px 26px',
                borderRadius: 12,
                border: `2px solid ${i === 0 ? colors.accent : colors.line}`,
                backgroundColor: colors.panel,
                ...fadeUp(frame, cue(['the GitHub repo', 'a write-up', 'the raw run logs'][i]), 24),
              }}
            >
              <div style={{fontSize: type.body, fontWeight: 600}}>{d.title}</div>
              <div style={{fontSize: type.caption, color: colors.muted, marginTop: 8, lineHeight: 1.35}}>{d.sub}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 860,
            fontFamily: fonts.mono,
            fontSize: type.caption,
            color: colors.muted,
            ...fadeUp(frame, cue('the raw run logs', 1), 24),
          }}
        >
          github.com/geodnb/evolving-review-councils
        </div>
      </div>
      <Closing frame={frame} />
    </>
  );
};

export const Scene10Calculator: React.FC = () => {
  const frame = useCurrentFrame();
  const endAt = cue('Everything is public');
  const out = prog(frame, endAt - 10, 20);
  return (
    <SceneFrame sceneId="s10">
      {out < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
          <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
            <Eyebrow>Built after the runs, from real results</Eyebrow>
            <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>Council calculator</div>
          </div>
          <Selector frame={frame} />
          <Estimates frame={frame} />
          <PromptBlock frame={frame} />
          <FeedbackLoop frame={frame} />
          <Caption style={{opacity: prog(frame, cue('then writes a prompt', 1), 20)}}>
            Slots filled from real run results.
          </Caption>
        </div>
      )}
      {frame >= endAt - 10 && <EndCard frame={frame} start={endAt} />}
    </SceneFrame>
  );
};
