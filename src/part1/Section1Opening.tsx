// Part 1 ("Can AI agents check each other?"), Section 1: the opening.
// Cold open on the WinScope pilot, the hook question, what an agent is plus a
// one-line intro to Ablation Lab, then what AI reviewers can check and why this
// video tests code. Recorded lines come from takes.json (scripts/part-voiceover.mjs);
// any line not yet recorded plays as a timed caption (see beats.ts).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Check, CirclePlay, CodeXml, FilePen, FileText, Hammer, Search, ShieldAlert, Terminal, Timer, Workflow, Wrench} from 'lucide-react';
import {Eyebrow} from '../components/SceneFrame';
import {Card, Tag, phase} from '../components/Kit';
import {LineIcon} from '../components/LineIcon';
import {Flash, glowBorder, glowColor} from '../components/Accent';
import {fadeUp, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import voiceover from '../voiceover.json';
import {buildSection, type LineTake, type Take} from './beats';
import takes from './takes.json';
import {SectionFrame} from './SectionFrame';
import {assertHolds, BEAT_S, COUNT_UP, ENTER, ENTER_BIG, SLIDE_FADE, STAGGER, type KeyFact} from './pace';

/* ---------- Narration ---------- */

// Reused take: the first sentence of the v14b Scene 1 clip (public/audio/scene01.mp3).
// It's cut in the pause before "They now write more code…".
const s01 = (voiceover as Record<string, {file: string; words: {text: string; startMs: number; endMs: number}[]}>).s01;
const AGENTS_WORDS = 15;
const agentsTake: Take = {
  src: s01.file,
  fromS: 0,
  toS: (s01.words[AGENTS_WORDS - 1].endMs + s01.words[AGENTS_WORDS].startMs) / 2000,
  words: s01.words.slice(0, AGENTS_WORDS).map((w) => ({text: w.text, startS: w.startMs / 1000, endS: w.endMs / 1000})),
};

// Long lines are split at their natural pauses so a beat (BEAT_S) can follow
// each key point. A split line is still one recording; the take is cut at that pause.
export const SECTION = buildSection(
  [
    {
      id: 'built',
      line: 'p1-01-built',
      text: 'After a coordinator agent laid the groundwork, four AI builders wrote most of a Windows app, WinScope, in about 33 minutes.',
    },
    // Long enough for "33 minutes" to hold KEY_HOLD_S before the slide changes.
    {id: 'reported', line: 'p1-01-reported', text: 'Then, over four review rounds, other AI reviewers reported 97 problems,', gapBeforeS: 2.5},
    {id: 'hole', line: 'p1-01-reported', text: 'including a security hole in code the coordinator had already checked itself.', gapBeforeS: BEAT_S},
    {id: 'hook', line: 'p1-02-hook', text: 'So is one AI agent enough to check its own work?', gapBeforeS: 1.6 + BEAT_S},
    {
      id: 'agents',
      text: 'AI agents are AIs that write files, run code and use tools on their own.',
      take: agentsTake,
      gapBeforeS: 1.8 + BEAT_S,
    },
    {
      id: 'lab',
      line: 'p1-03-lab',
      text: 'This is Ablation Lab, where we test AI agents with controlled experiments.',
      gapBeforeS: 1.5 + BEAT_S,
    },
    {
      id: 'video',
      line: 'p1-03-lab',
      text: "This video asks whether AI agents can check each other's work, and how we plan to find out.",
      gapBeforeS: BEAT_S,
    },
    {
      id: 'kinds',
      line: 'p1-04-kinds',
      text: 'AI reviewers can check documents: a separate AI caught structural problems in this research plan.',
      gapBeforeS: 1.4 + BEAT_S,
    },
    {
      id: 'videos',
      line: 'p1-04-kinds',
      text: 'Videos: our video review tool caught a blank frame in an earlier cut of this video.',
      gapBeforeS: BEAT_S,
    },
    {id: 'code', line: 'p1-04-code', text: "And code, which is what we're testing,", gapBeforeS: 0.3 + BEAT_S},
    {
      id: 'why',
      line: 'p1-04-code',
      text: 'because you can plant bugs on purpose and count exactly how many get caught.',
      gapBeforeS: BEAT_S,
    },
  ],
  {holdS: 3.0, takes: takes as Record<string, LineTake>},
);

const {cue, beat} = SECTION;

/* ---------- 1. Cold open: the build ---------- */

const BUILDERS = ['Performance', 'Network', 'Events', 'Storage'];

const Build: React.FC<{frame: number}> = ({frame}) => {
  const coordAt = cue('built', 'After a coordinator agent');
  const buildersAt = cue('built', 'four AI builders');
  const timeAt = cue('built', 'in about 33 minutes');
  return (
    <>
      <Card style={{left: 120, top: 340, width: 380, height: 170, border: glowBorder(frame, coordAt), ...fadeUp(frame, coordAt, ENTER)}}>
        <LineIcon icon={Workflow} glowAt={coordAt} />
        <div style={{fontSize: type.small, fontWeight: 600, marginTop: 14}}>
          <Flash at={coordAt}>Coordinator</Flash>
        </div>
        <div style={{fontSize: type.caption, color: colors.muted, marginTop: 4}}>lays the groundwork</div>
      </Card>
      <svg width={80} height={20} style={{position: 'absolute', left: 510, top: 415, opacity: prog(frame, buildersAt - 6, ENTER)}}>
        <line x1={0} x2={64} y1={10} y2={10} stroke={colors.line} strokeWidth={2} />
        <path d="M60 4l10 6-10 6" fill="none" stroke={colors.line} strokeWidth={2} />
      </svg>
      {BUILDERS.map((name, i) => (
        <Card
          key={name}
          style={{
            left: 600 + i * 300,
            top: 340,
            width: 280,
            height: 170,
            border: glowBorder(frame, buildersAt + i * STAGGER),
            ...fadeUp(frame, buildersAt + i * STAGGER, ENTER, 10),
          }}
        >
          <LineIcon icon={Hammer} glowAt={buildersAt + i * STAGGER} />
          <div style={{fontSize: type.small, fontWeight: 600, marginTop: 14}}>
            <Flash at={buildersAt + i * STAGGER}>Builder {i + 1}</Flash>
          </div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 4}}>{name}</div>
        </Card>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 560,
          width: 1180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          height: 96,
          borderRadius: 14,
          border: glowBorder(frame, timeAt),
          ...fadeUp(frame, timeAt, ENTER),
        }}
      >
        <LineIcon icon={Timer} glowAt={timeAt} />
        {/* The slide's main point: stays amber. */}
        <span style={{fontSize: type.body, fontWeight: 600, color: colors.accent}}>about 33 minutes</span>
        <span style={{fontSize: type.small, color: colors.muted}}>· working in parallel · most of the app</span>
      </div>
    </>
  );
};

/* ---------- 1. Cold open: the review (the 97, tightened) ---------- */

// The four review rounds of "How the agents built and reviewed WinScope", with fixes between them.
const ROUNDS = [48, 10, 25, 14];
const TOTAL = ROUNDS.reduce((s, n) => s + n, 0);
const BAR_W = 960;

const Review: React.FC<{frame: number}> = ({frame}) => {
  const roundsAt = cue('reported', 'over four review rounds');
  const reviewersAt = cue('reported', 'other AI reviewers');
  const numberAt = cue('reported', 'reported 97 problems');
  const holeAt = cue('hole', 'including a security hole');
  const selfAt = cue('hole', 'had already checked itself');
  // The self-review tag arrives with "the coordinator", so it's fully in by the time the line ends.
  const tagAt = cue('hole', 'in code the coordinator');
  const count = Math.round(interpolate(frame, [numberAt, numberAt + COUNT_UP], [0, TOTAL], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  let x = 0;
  return (
    <>
      <Card
        style={{
          left: 120,
          top: 300,
          width: 720,
          height: 104,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          whiteSpace: 'nowrap',
          border: glowBorder(frame, reviewersAt),
          ...fadeUp(frame, reviewersAt, ENTER),
        }}
      >
        <LineIcon icon={Search} glowAt={reviewersAt} />
        <span style={{fontSize: type.small, fontWeight: 600}}>
          <Flash at={reviewersAt}>AI reviewers</Flash>
        </span>
        <span style={{fontSize: type.caption, color: colors.muted}}>didn't write the code</span>
      </Card>
      <div style={{position: 'absolute', left: 120, top: 440, display: 'flex', alignItems: 'center', gap: 32, ...fadeUp(frame, numberAt, ENTER)}}>
        <span style={{fontSize: 200, fontWeight: 700, lineHeight: 1, letterSpacing: -6, color: colors.accent, fontVariantNumeric: 'tabular-nums'}}>
          {count}
        </span>
        <span style={{fontSize: type.body, fontWeight: 600, lineHeight: 1.2}}>
          problems
          <br />
          <Flash at={numberAt + 6}>reported</Flash>
        </span>
      </div>
      {/* The 97 built up over four rounds with fixes between them: never one pass. */}
      <svg width={BAR_W} height={60} style={{position: 'absolute', left: 120, top: 712, overflow: 'visible'}}>
        {ROUNDS.map((n, i) => {
          const w = (n / TOTAL) * BAR_W;
          const x0 = x;
          x += w;
          return (
            <g key={i} opacity={prog(frame, roundsAt + i * STAGGER, ENTER)}>
              {i > 0 && <line x1={x0} x2={x0} y1={-14} y2={74} stroke={colors.muted} strokeWidth={2} strokeDasharray="4 5" />}
              <rect
                x={x0 + 4}
                y={0}
                width={Math.max(0, w - 8)}
                height={60}
                rx={6}
                fill={colors.line}
                stroke={glowColor(frame, roundsAt + i * STAGGER, colors.line)}
                strokeWidth={2}
              />
              <text
                x={x0 + w / 2}
                y={40}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize={type.caption}
                fill={glowColor(frame, roundsAt + i * STAGGER, colors.text)}
              >
                {n}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 120, top: 790, fontFamily: fonts.mono, fontSize: type.caption, color: colors.muted, ...fadeUp(frame, roundsAt + 12, ENTER)}}>
        <Flash at={roundsAt + 12} base={colors.muted}>
          4 review rounds
        </Flash>{' '}
        · fixes in between
      </div>

      <Card accent style={{left: 1180, top: 300, width: 620, padding: '28px 32px 32px', ...fadeUp(frame, holeAt, ENTER, 12)}}>
        <LineIcon icon={ShieldAlert} accent size={48} />
        <Eyebrow style={{color: colors.accent, marginTop: 18}}>Security hole</Eyebrow>
        <div style={{fontSize: 40, fontWeight: 600, lineHeight: 1.2, marginTop: 12}}>
          in code the coordinator had{' '}
          <span style={{color: frame >= selfAt ? colors.accent : colors.text}}>already checked itself</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 28,
            fontFamily: fonts.mono,
            fontSize: type.caption,
            color: colors.muted,
            opacity: prog(frame, tagAt, ENTER),
          }}
        >
          <Check size={28} strokeWidth={1.5} color={glowColor(frame, tagAt, colors.muted)} />
          coordinator: self-reviewed
        </div>
      </Card>
    </>
  );
};

const ColdOpen: React.FC<{frame: number}> = ({frame}) => {
  // The build slide stays up through "Then," and hands over as the review rounds are named.
  const reviewAt = cue('reported', 'over four review rounds') - 10;
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 4, ENTER_BIG)}}>
        <Eyebrow>Pilot run</Eyebrow>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 6}}>
          <span style={{fontSize: type.heading, fontWeight: 600}}>
            <Flash at={4}>WinScope</Flash>
          </span>
          <span style={{fontSize: type.small, color: colors.muted}}>a Windows app built by AI agents</span>
        </div>
      </div>
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, reviewAt + 4, SLIDE_FADE, SLIDE_FADE)}}>
        <Build frame={frame} />
      </div>
      {frame >= reviewAt - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, reviewAt + 4, Infinity, SLIDE_FADE, SLIDE_FADE)}}>
          <Review frame={frame} />
        </div>
      )}
    </>
  );
};

/* ---------- 2. The hook question ---------- */

const Hook: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <div style={{position: 'absolute', left: 120, top: 380, width: 1680, ...fadeUp(frame, start, ENTER_BIG)}}>
    <div style={{fontSize: type.title, fontWeight: 600, letterSpacing: -1, lineHeight: 1.15}}>
      So is <Flash at={cue('hook', 'one AI agent')}>one AI agent</Flash> enough
      <br />
      to <span style={{color: colors.accent}}>check its own work?</span>
    </div>
  </div>
);

/* ---------- 3. What an agent is, and who we are ---------- */

const ABILITIES = [
  {label: 'write files', icon: FilePen},
  {label: 'run code', icon: Terminal},
  {label: 'use tools', icon: Wrench},
];

const Agents: React.FC<{frame: number; start: number}> = ({frame, start}) => (
  <div style={{position: 'absolute', left: 120, top: 300, width: 1680}}>
    <Eyebrow style={{...fadeUp(frame, start, ENTER)}}>AI agents</Eyebrow>
    <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 10, ...fadeUp(frame, start + 4, ENTER)}}>
      AIs that <span style={{color: colors.accent}}>act on their own</span>
    </div>
    <div style={{display: 'flex', gap: 20, marginTop: 40}}>
      {ABILITIES.map((a) => {
        const at = cue('agents', a.label);
        return (
          <div
            key={a.label}
            style={{
              height: 84,
              padding: '0 30px 0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              borderRadius: 42,
              border: glowBorder(frame, at),
              fontSize: type.small,
              ...fadeUp(frame, at, ENTER, 8),
            }}
          >
            <LineIcon icon={a.icon} size={34} glowAt={at} />
            <Flash at={at}>{a.label}</Flash>
          </div>
        );
      })}
    </div>
  </div>
);

const Lab: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const videoAt = cue('video', 'This video asks');
  const howAt = cue('video', 'and how we plan');
  return (
    <div style={{position: 'absolute', left: 120, top: 300, width: 1680}}>
      <div style={{fontFamily: fonts.mono, fontSize: type.body, letterSpacing: 8, color: colors.accent, ...fadeUp(frame, start, ENTER_BIG)}}>ABLATION LAB</div>
      <div style={{fontSize: type.small, color: colors.muted, marginTop: 14, ...fadeUp(frame, start + 6, ENTER_BIG)}}>
        testing AI agents with controlled experiments
      </div>
      <div style={{marginTop: 90, ...fadeUp(frame, videoAt, ENTER_BIG)}}>
        <Eyebrow>Part 1</Eyebrow>
        <div style={{fontSize: type.title, fontWeight: 600, letterSpacing: -1, marginTop: 10}}>
          Can AI agents <span style={{color: colors.accent}}>check each other?</span>
        </div>
      </div>
      <div style={{fontSize: type.body, color: colors.muted, marginTop: 22, ...fadeUp(frame, howAt, ENTER)}}>
        <Flash at={howAt} base={colors.muted}>
          …and how we plan to find out
        </Flash>
      </div>
    </div>
  );
};

/* ---------- 4. What AI reviewers can check ---------- */

const KINDS = [
  {
    label: 'Documents',
    icon: FileText,
    example: 'A separate AI caught structural problems in this research plan',
    at: () => cue('kinds', 'documents'),
  },
  {
    label: 'Videos',
    icon: CirclePlay,
    example: 'Our video review tool caught a blank frame in an earlier cut of this video',
    at: () => cue('videos', 'Videos'),
  },
  {
    label: 'Code',
    icon: CodeXml,
    example: 'Plant bugs on purpose, then count exactly how many get caught',
    at: () => cue('code', 'And code'),
  },
];

const Kinds: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const testingAt = cue('code', "which is what we're testing");
  const whyAt = cue('why', 'because you can plant');
  const focus = prog(frame, testingAt, ENTER);
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, start, ENTER_BIG)}}>
        <Eyebrow>AI reviewers</Eyebrow>
        <div style={{fontSize: type.heading, fontWeight: 600, marginTop: 6}}>What they can check</div>
      </div>
      {KINDS.map((k, i) => {
        const isCode = k.label === 'Code';
        const highlight = isCode && focus > 0.5;
        const at = k.at();
        return (
          <Card
            key={k.label}
            accent={highlight}
            style={{
              left: 120 + i * 580,
              top: 330,
              width: 520,
              height: 400,
              ...(highlight ? {} : {border: glowBorder(frame, at)}),
              ...fadeUp(frame, at, ENTER),
              ...(isCode ? {} : {opacity: prog(frame, at, ENTER) * (1 - 0.55 * focus)}),
            }}
          >
            <LineIcon icon={k.icon} size={48} accent={highlight} glowAt={at} />
            <div style={{fontSize: 48, fontWeight: 600, marginTop: 20}}>
              {highlight ? <span style={{color: colors.accent}}>{k.label}</span> : <Flash at={at}>{k.label}</Flash>}
            </div>
            <div
              style={{
                fontSize: type.small,
                color: colors.muted,
                lineHeight: 1.35,
                marginTop: 18,
                opacity: isCode ? prog(frame, whyAt, ENTER) : prog(frame, at + 10, ENTER),
              }}
            >
              {k.example}
            </div>
          </Card>
        );
      })}
      <Tag fill={1} style={{left: 120 + 2 * 580, right: 'auto', top: 260, opacity: focus}}>
        WHAT WE'RE TESTING
      </Tag>
    </>
  );
};

/* ---------- The section ---------- */

export const Part1Section1: React.FC = () => {
  const frame = useCurrentFrame();
  const hookAt = beat('hook').startF;
  const agentsAt = beat('agents').startF;
  const labAt = beat('lab').startF;
  const kindsAt = beat('kinds').startF;
  // Slides change in the pause before their first line.
  const lead = 12;
  const onBigText = (frame >= hookAt - lead && frame < agentsAt - lead) || (frame >= labAt - lead && frame < kindsAt - lead);
  return (
    <SectionFrame section={SECTION} number="1.1" title="The opening" hideLabel={onBigText}>
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, hookAt - lead, SLIDE_FADE, SLIDE_FADE)}}>
        <ColdOpen frame={frame} />
      </div>
      {frame >= hookAt - lead - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, hookAt - lead, agentsAt - lead, SLIDE_FADE, SLIDE_FADE)}}>
          <Hook frame={frame} start={hookAt - lead / 2} />
        </div>
      )}
      {frame >= agentsAt - lead - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, agentsAt - lead, labAt - lead, SLIDE_FADE, SLIDE_FADE)}}>
          <Agents frame={frame} start={agentsAt - lead / 2} />
        </div>
      )}
      {frame >= labAt - lead - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, labAt - lead, kindsAt - lead, SLIDE_FADE, SLIDE_FADE)}}>
          <Lab frame={frame} start={labAt - lead / 2} />
        </div>
      )}
      {frame >= kindsAt - lead - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, kindsAt - lead, Infinity, SLIDE_FADE, SLIDE_FADE)}}>
          <Kinds frame={frame} start={kindsAt - lead / 2} />
        </div>
      )}
    </SectionFrame>
  );
};

export const part1Section1DurationInFrames = SECTION.durationInFrames;

/* ---------- Key facts: each holds at least KEY_HOLD_S after it fully appears ---------- */

// A slide starts fading out SLIDE_FADE frames before the next slide's change point (12 frames before its first line).
const slideOut = (nextBeat: string) => beat(nextBeat).startF - 12 - SLIDE_FADE;

export const KEY_FACTS: KeyFact[] = [
  {label: '33 minutes', fullAt: cue('built', 'in about 33 minutes') + ENTER, leavesAt: cue('reported', 'over four review rounds') - 10 + 4 - SLIDE_FADE},
  {label: '97 problems', fullAt: cue('reported', 'reported 97 problems') + COUNT_UP, leavesAt: slideOut('hook')},
  {label: 'security hole', fullAt: cue('hole', 'including a security hole') + ENTER, leavesAt: slideOut('hook')},
  {label: 'coordinator self-reviewed', fullAt: cue('hole', 'in code the coordinator') + ENTER, leavesAt: slideOut('hook')},
  {label: 'hook question', fullAt: beat('hook').startF - 6 + ENTER_BIG, leavesAt: slideOut('agents')},
  {label: 'act on their own', fullAt: beat('agents').startF - 6 + 4 + ENTER, leavesAt: slideOut('lab')},
  {label: 'Part 1 title', fullAt: cue('video', 'This video asks') + ENTER_BIG, leavesAt: slideOut('kinds')},
  {label: 'Code, what we test', fullAt: cue('code', "which is what we're testing") + ENTER, leavesAt: SECTION.durationInFrames - 12},
];
assertHolds('Part1-Section1', KEY_FACTS);
