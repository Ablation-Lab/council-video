// Part 1 ("Can AI agents check each other?"), Section 1: the opening.
// Cold open on the WinScope pilot, the hook question, Ablation Lab (logo, what
// this video asks, a mini council review), then what AI reviewers can check and
// why this video tests code: the council's code file moves into the Code box. Recorded lines come from takes.json (scripts/part-voiceover.mjs);
// any line not yet recorded plays as a timed caption (see beats.ts).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Check, CirclePlay, FileCode, FileText, Hammer, ListChecks, Search, ShieldAlert, Timer} from 'lucide-react';
import {Eyebrow} from '../components/SceneFrame';
import {Card, Tag, phase} from '../components/Kit';
import {LineIcon} from '../components/LineIcon';
import {Flash, glowBorder, glowColor} from '../components/Accent';
import {AblationLogo} from '../components/AblationLogo';
import {fadeUp, mix, prog} from '../anim';
import {colors, fonts, type} from '../theme';
import {buildSection, type LineTake} from './beats';
import takes from './takes.json';
import {SectionFrame} from './SectionFrame';
import {assertHolds, BEAT_S, COUNT_UP, ENTER, ENTER_BIG, SLIDE_FADE, STAGGER, type KeyFact} from './pace';

/* ---------- Narration ---------- */

// Long lines are split at their natural pauses so a beat (BEAT_S) can follow
// each key point. A split line is still one recording; the take is cut at that pause.
// "reported" and "hole" are two separate takes, so neither is cut.
export const SECTION = buildSection(
  [
    {
      id: 'built',
      line: 'p1-01-built',
      text: 'A team of AI agents built a Windows app, WinScope, in about 33 minutes.',
    },
    // Long enough for "33 minutes" to hold KEY_HOLD_S before the slide changes.
    {id: 'reported', line: 'p1-01-reported-a', text: 'Then, over four review rounds, other AI reviewers reported 97 problems.', gapBeforeS: 2.5},
    {
      id: 'hole',
      line: 'p1-01-reported-b',
      text: 'Including a serious security flaw that the AI that wrote it had already checked and missed.',
      gapBeforeS: BEAT_S,
    },
    {id: 'hook', line: 'p1-02-hook', text: 'So is one AI agent enough to check its own work?', gapBeforeS: 1.6 + BEAT_S},
    {
      id: 'lab',
      line: 'p1-03-lab',
      text: 'This is Ablation Lab, where we test AI agents with controlled experiments.',
      gapBeforeS: 1.8 + BEAT_S,
    },
    {
      id: 'video',
      line: 'p1-03-lab',
      text: "This video asks whether AI agents, AIs that write files, run code and use tools on their own, can check each other's work, and how we plan to find out.",
      gapBeforeS: BEAT_S,
    },
    // Cut from p1-04-kinds: the take's opening sentence (it had no context in the video).
    {id: 'kinds-cut', line: 'p1-04-kinds', text: 'AI reviewers can check documents.', skip: true},
    {
      id: 'kinds',
      line: 'p1-04-kinds',
      text: 'A separate AI caught structural problems in this research plan.',
      // Room for the merged list to hold, then for the code file to move into the Code box.
      gapBeforeS: 2.5 + BEAT_S,
    },
    // Also cut: the "Videos." label, which no longer has a list to head.
    {id: 'videos-cut', line: 'p1-04-kinds', text: 'Videos.', skip: true},
    {
      id: 'videos',
      line: 'p1-04-kinds',
      text: 'Our video review tool caught a blank frame in an earlier cut of this video.',
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
  const buildersAt = cue('built', 'A team of AI agents');
  const timeAt = cue('built', 'in about 33 minutes');
  return (
    <>
      {BUILDERS.map((name, i) => (
        <Card
          key={name}
          style={{
            left: 120 + i * 425,
            top: 340,
            width: 405,
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
          left: 120,
          top: 560,
          width: 1680,
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
  const holeAt = cue('hole', 'Including a serious security flaw');
  const selfAt = cue('hole', 'had already checked and missed');
  // The self-review tag arrives with "the AI that wrote it", so it's fully in by the time the line ends.
  const tagAt = cue('hole', 'the AI that wrote it');
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
        <Eyebrow style={{color: colors.accent, marginTop: 18}}>Serious security flaw</Eyebrow>
        <div style={{fontSize: 40, fontWeight: 600, lineHeight: 1.2, marginTop: 12}}>
          that the AI that wrote it had{' '}
          <span style={{color: frame >= selfAt ? colors.accent : colors.text}}>already checked and missed</span>
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
          writer: self-reviewed
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

/* ---------- 3. Ablation Lab, and what this video asks ---------- */

// The mini council: a code file, three reviewers around it, each pinning a
// finding on the file, then the findings merging into one short list.
const FILE = {x: 775, y: 640, w: 150, h: 180};
const FILE_ICON = 56;
const FILE_PAD = 20;
const CODE_LINES = [96, 70, 104, 60];
const lineY = (i: number) => FILE.y - FILE.h / 2 + FILE_PAD + FILE_ICON + 22 + i * 22;
const LINE_X = FILE.x - FILE.w / 2 + FILE_PAD;
const R = 200;
const REVIEWER = 80;
// Each reviewer sits on the left half-circle round the file and flags one line.
const REVIEWERS = [
  {angle: -115, line: 0, cueAt: 'write files'},
  {angle: 180, line: 1, cueAt: 'run code'},
  {angle: 115, line: 3, cueAt: 'use tools'},
].map((r) => ({
  ...r,
  x: FILE.x + R * Math.cos((r.angle * Math.PI) / 180),
  y: FILE.y + R * Math.sin((r.angle * Math.PI) / 180),
}));
const pin = (line: number) => ({x: LINE_X + CODE_LINES[line] + 14, y: lineY(line)});
const LIST = {x: 1025, y: 545, w: 360, h: 190};
const listRow = (i: number) => ({x: LIST.x + 32, y: LIST.y + 86 + i * 36});

const SCAN_STAGGER = 12; // frames between the reviewers' scans

const Council: React.FC<{frame: number}> = ({frame}) => {
  const fileAt = cue('video', 'whether AI agents');
  const checkAt = cue('video', "can check each other's work");
  // The findings start to merge in the pause before "and how we plan to find out".
  const mergeAt = cue('video', 'and how we plan', -0.4);
  return (
    <>
      {/* The file's box and code lines; its icon is FileIcon, which carries on into the Code box. */}
      <div
        style={{
          position: 'absolute',
          left: FILE.x - FILE.w / 2,
          top: FILE.y - FILE.h / 2,
          width: FILE.w,
          height: FILE.h,
          boxSizing: 'border-box',
          borderRadius: 14,
          border: glowBorder(frame, fileAt),
          backgroundColor: colors.panel,
          opacity: prog(frame, fileAt, ENTER),
        }}
      />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g opacity={prog(frame, fileAt + 6, ENTER)}>
          {CODE_LINES.map((w, i) => (
            <rect key={i} x={LINE_X} y={lineY(i) - 4} width={w} height={8} rx={4} fill={colors.line} />
          ))}
        </g>
        {REVIEWERS.map((r, i) => {
          const scanAt = checkAt + i * SCAN_STAGGER;
          const p = pin(r.line);
          // Scan line from the reviewer's edge to the flagged line.
          const dx = p.x - r.x;
          const dy = p.y - r.y;
          const len = Math.hypot(dx, dy);
          const sx = r.x + (dx / len) * (REVIEWER / 2 + 6);
          const sy = r.y + (dy / len) * (REVIEWER / 2 + 6);
          const draw = prog(frame, scanAt, ENTER);
          const fade = 1 - prog(frame, mergeAt, ENTER);
          return (
            <g key={i}>
              <line
                x1={sx}
                y1={sy}
                x2={mix(sx, p.x - 10, draw)}
                y2={mix(sy, p.y, draw)}
                stroke={glowColor(frame, scanAt, colors.line)}
                strokeWidth={2}
                strokeDasharray="4 6"
                opacity={draw > 0 ? fade : 0}
              />
            </g>
          );
        })}
        {/* Findings: pinned on the file, then each flies to its row in the list. */}
        {REVIEWERS.map((r, i) => {
          const pinAt = checkAt + i * SCAN_STAGGER + ENTER - 6;
          const flyAt = mergeAt + i * STAGGER;
          const from = pin(r.line);
          const to = listRow(i);
          const t = prog(frame, flyAt, ENTER);
          return (
            <circle
              key={i}
              cx={mix(from.x, to.x, t)}
              cy={mix(from.y, to.y, t)}
              r={7}
              fill={colors.accent}
              opacity={prog(frame, pinAt, 10)}
            />
          );
        })}
      </svg>
      {REVIEWERS.map((r) => {
        const at = cue('video', r.cueAt);
        return (
          <div
            key={r.cueAt}
            style={{
              position: 'absolute',
              left: r.x - REVIEWER / 2,
              top: r.y - REVIEWER / 2,
              width: REVIEWER,
              height: REVIEWER,
              boxSizing: 'border-box',
              borderRadius: REVIEWER / 2,
              border: glowBorder(frame, at),
              backgroundColor: colors.panel,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: prog(frame, at, ENTER),
            }}
          >
            <LineIcon icon={Search} size={36} glowAt={at} />
          </div>
        );
      })}
      {/* One short list: the three findings merged. */}
      <div
        style={{
          position: 'absolute',
          left: LIST.x,
          top: LIST.y,
          width: LIST.w,
          height: LIST.h,
          boxSizing: 'border-box',
          padding: '18px 24px',
          borderRadius: 14,
          border: glowBorder(frame, mergeAt),
          backgroundColor: colors.panel,
          opacity: prog(frame, mergeAt - 6, ENTER),
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <LineIcon icon={ListChecks} size={32} glowAt={mergeAt} />
          <span style={{fontSize: type.caption, fontWeight: 600}}>
            <Flash at={mergeAt}>Findings</Flash>
          </span>
        </div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {[0, 1, 2].map((i) => {
          const row = listRow(i);
          // The row fills in as its finding lands.
          const landed = prog(frame, mergeAt + i * STAGGER + ENTER - 6, 12);
          return <rect key={i} x={row.x + 22} y={row.y - 5} width={[230, 190, 250][i]} height={10} rx={5} fill={colors.line} opacity={landed} />;
        })}
      </svg>
    </>
  );
};

const Lab: React.FC<{frame: number}> = ({frame}) => {
  const logoAt = cue('lab', 'Ablation Lab');
  const videoAt = cue('video', 'This video asks');
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...fadeUp(frame, logoAt, ENTER_BIG)}}>
          <AblationLogo size={118} at={logoAt} duration={ENTER_BIG} />
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 22, ...fadeUp(frame, logoAt + 6, ENTER_BIG)}}>
          {/* The slide's main word: stays amber. */}
          <span style={{fontFamily: fonts.mono, fontSize: type.body, letterSpacing: 8, color: colors.accent}}>ABLATION LAB</span>
          <span style={{fontSize: type.small, color: colors.muted}}>testing AI agents with controlled experiments</span>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 40, ...fadeUp(frame, videoAt, ENTER_BIG)}}>
          <Eyebrow>Part 1</Eyebrow>
          <span style={{fontSize: 56, fontWeight: 600, letterSpacing: -0.5}}>
            Can AI <Flash at={cue('video', "can check each other's work")}>mark its own homework?</Flash>
          </span>
        </div>
      </div>
      <Council frame={frame} />
    </>
  );
};

/* ---------- Bridge: the council's code file becomes the Code box's icon ---------- */

// Where the Code box's icon sits on the framing slide (Card padding 22/28 inside a 2px border).
const CODE_BOX = {left: 120 + 2 * 580, top: 330};
const CODE_ICON = {x: CODE_BOX.left + 2 + 28, y: CODE_BOX.top + 2 + 22, size: 48};

const FileIcon: React.FC<{frame: number}> = ({frame}) => {
  const fileAt = cue('video', 'whether AI agents');
  // It moves as the Ablation Lab slide fades, so it arrives as the framing slide comes up.
  const moveAt = beat('kinds').startF - 12 - SLIDE_FADE / 2;
  const codeAt = cue('code', 'And code');
  const highlight = prog(frame, cue('code', "which is what we're testing"), ENTER) > 0.5;
  const t = prog(frame, moveAt, ENTER_BIG + 6);
  const size = mix(FILE_ICON, CODE_ICON.size, t);
  const x = mix(FILE.x - FILE.w / 2 + FILE_PAD, CODE_ICON.x, t);
  const y = mix(FILE.y - FILE.h / 2 + FILE_PAD, CODE_ICON.y, t);
  const color = highlight ? colors.accent : glowColor(frame, frame < codeAt ? fileAt : codeAt, colors.muted);
  return (
    <FileCode
      size={size}
      strokeWidth={1.5}
      color={color}
      style={{position: 'absolute', left: x, top: y, opacity: prog(frame, fileAt, ENTER)}}
    />
  );
};

/* ---------- 4. What AI reviewers can check ---------- */

const KINDS = [
  {
    label: 'Research plan',
    icon: FileText,
    example: 'A separate AI caught structural problems in this research plan',
    at: () => cue('kinds', 'A separate AI'),
  },
  {
    label: 'Videos',
    icon: CirclePlay,
    example: 'Our video review tool caught a blank frame in an earlier cut of this video',
    at: () => cue('videos', 'Our video review tool'),
  },
  {
    label: 'Code',
    icon: FileCode,
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
              // The Code box fades in round the file icon already in place, so it doesn't rise.
              ...(isCode ? {opacity: prog(frame, at, ENTER)} : {...fadeUp(frame, at, ENTER), opacity: prog(frame, at, ENTER) * (1 - 0.55 * focus)}),
            }}
          >
            {/* The Code box's icon is FileIcon, drawn above the slides. */}
            {isCode ? <div style={{height: 48}} /> : <LineIcon icon={k.icon} size={48} glowAt={at} />}
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
  const labAt = beat('lab').startF;
  const kindsAt = beat('kinds').startF;
  // Slides change in the pause before their first line.
  const lead = 12;
  const onBigText = frame >= hookAt - lead && frame < labAt - lead;
  return (
    <SectionFrame section={SECTION} number="1.1" title="The opening" hideLabel={onBigText}>
      <div style={{position: 'absolute', inset: 0, opacity: phase(frame, 0, hookAt - lead, SLIDE_FADE, SLIDE_FADE)}}>
        <ColdOpen frame={frame} />
      </div>
      {frame >= hookAt - lead - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, hookAt - lead, labAt - lead, SLIDE_FADE, SLIDE_FADE)}}>
          <Hook frame={frame} start={hookAt - lead / 2} />
        </div>
      )}
      {frame >= labAt - lead - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, labAt - lead, kindsAt - lead, SLIDE_FADE, SLIDE_FADE)}}>
          <Lab frame={frame} />
        </div>
      )}
      {frame >= kindsAt - lead - 10 && (
        <div style={{position: 'absolute', inset: 0, opacity: phase(frame, kindsAt - lead, Infinity, SLIDE_FADE, SLIDE_FADE)}}>
          <Kinds frame={frame} start={kindsAt - lead / 2} />
        </div>
      )}
      <FileIcon frame={frame} />
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
  {label: 'serious security flaw', fullAt: cue('hole', 'Including a serious security flaw') + ENTER, leavesAt: slideOut('hook')},
  {label: 'writer self-reviewed', fullAt: cue('hole', 'the AI that wrote it') + ENTER, leavesAt: slideOut('hook')},
  {label: 'hook question', fullAt: beat('hook').startF - 6 + ENTER_BIG, leavesAt: slideOut('lab')},
  {label: 'Ablation Lab logo', fullAt: cue('lab', 'Ablation Lab') + 6 + ENTER_BIG, leavesAt: slideOut('kinds')},
  {label: 'Part 1 title', fullAt: cue('video', 'This video asks') + ENTER_BIG, leavesAt: slideOut('kinds')},
  {label: 'merged findings list', fullAt: cue('video', 'and how we plan', -0.4) + 2 * STAGGER + ENTER + 6, leavesAt: slideOut('kinds')},
  {label: 'Code, what we test', fullAt: cue('code', "which is what we're testing") + ENTER, leavesAt: SECTION.durationInFrames - 12},
];
assertHolds('Part1-Section1', KEY_FACTS);
