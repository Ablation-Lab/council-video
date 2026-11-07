// Timing for the Part 1 / Part 2 sections. A section is a list of beats, one
// per narration line. A beat either plays a recorded take (a span of an audio
// file in public/, with per-word timings) or is a placeholder: no audio, an
// estimated length at the narrator's measured pace, and an on-screen caption.
// Animations cue on words with `cue(beatId, phrase)`, exactly like makeCue in
// src/timing.ts, so swapping a placeholder for its recording keeps every cue.
import {FPS} from '../timing';

export type Word = {text: string; startS: number; endS: number};

/**
 * A span of a recording. `words` are in seconds from the start of the file.
 * `cutOut` is false when the span runs to the end of the file (which has its own fade).
 */
export type Take = {src: string; fromS: number; toS: number; words: Word[]; cutOut?: boolean};

/** A recorded line take, as scripts/part-voiceover.mjs writes it to takes.json. */
export type LineTake = {
  src: string;
  durationS: number;
  words: Word[];
  /** The quietest point between word `afterWord` and the next one. */
  cuts: {afterWord: number; cutS: number; levelDb: number}[];
};

export type Beat = {
  id: string;
  text: string;
  /** Recording-table ID. Once that line is in takes.json the beat plays its recording; until then it's a placeholder. */
  line?: string;
  take?: Take;
  /** Silence before this beat starts (seconds). */
  gapBeforeS?: number;
  /**
   * Words cut from a recorded line: the beat takes its share of the take (so the
   * take still lines up with the script) but is never played or timed.
   */
  skip?: boolean;
};

export type TimedBeat = Beat & {
  startF: number;
  endF: number;
  /** Word timings in seconds from the section start. */
  words: Word[];
  placeholder: boolean;
  /** What the recognizer heard, when it differs from the script (for checking a take). */
  heard?: string[];
};

// Measured across the v14b recordings (src/voiceover.json): 152 words a minute.
export const PLACEHOLDER_WPM = 152;
// Extra time a placeholder allows after a full stop, question mark or colon.
const PLACEHOLDER_PAUSE_S = 0.4;

// Silence kept before the first word that follows cut words.
const SKIP_LEAD_S = 0.15;

const norm = (raw: string) => raw.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');

/** Estimated word timings for a line that hasn't been recorded. */
const placeholderWords = (text: string): Word[] => {
  const per = 60 / PLACEHOLDER_WPM;
  let t = 0;
  return text.split(/\s+/).map((w) => {
    const word = {text: w, startS: t, endS: t + per - 0.05};
    t += per + (/[.?!:]$/.test(w) ? PLACEHOLDER_PAUSE_S : 0);
    return word;
  });
};

/**
 * Gives every beat whose `line` has a recording its span of that take. Beats
 * that share a line split it in order, each cut at the quietest point of the
 * pause between them. Word timings come from the take; the words themselves
 * come from the script, so cues and checks read the script's spelling.
 */
const attachTakes = (beats: Beat[], takes: Record<string, LineTake>) => {
  const heard: Record<string, string[]> = {};
  const used: Record<string, number> = {};
  const out = beats.map((b) => {
    const take = b.line && !b.take ? takes[b.line] : undefined;
    if (!take) return b;
    const group = beats.filter((x) => x.line === b.line && !x.take);
    const total = group.reduce((n, x) => n + x.text.split(/\s+/).length, 0);
    if (total !== take.words.length) {
      throw new Error(
        `${b.line}: the take has ${take.words.length} words but the script has ${total}.
  heard: ${take.words.map((w) => w.text).join(' ')}
  script: ${group.map((x) => x.text).join(' ')}`,
      );
    }
    const first = used[b.line!] ?? 0;
    const written = b.text.split(/\s+/);
    const last = first + written.length - 1;
    used[b.line!] = last + 1;
    const span = take.words.slice(first, last + 1);
    // After cut (skipped) words, start just before this beat's first word rather
    // than mid-pause, so the cut words' pause doesn't stay in as extra silence.
    const afterSkip = group[group.indexOf(b) - 1]?.skip;
    const cutS = first === 0 ? 0 : take.cuts[first - 1].cutS;
    const fromS = afterSkip ? Math.max(cutS, take.words[first].startS - SKIP_LEAD_S) : cutS;
    const toS = last === take.words.length - 1 ? take.durationS : take.cuts[last].cutS;
    const off = span.filter((w, i) => norm(w.text) !== norm(written[i])).map((w) => w.text);
    if (off.length) heard[b.id] = off;
    return {
      ...b,
      take: {src: take.src, fromS, toS, cutOut: toS < take.durationS, words: span.map((w, i) => ({...w, text: written[i]}))},
    };
  });
  return {beats: out, heard};
};

export const buildSection = (
  rawBeats: Beat[],
  {leadS = 0.5, tailS = 1.0, holdS = 0, takes = {}}: {leadS?: number; tailS?: number; holdS?: number; takes?: Record<string, LineTake>} = {},
) => {
  const attached = attachTakes(rawBeats, takes);
  const beats = attached.beats.filter((b) => !b.skip);
  const {heard} = attached;
  let t = leadS;
  const timed: TimedBeat[] = beats.map((b, i) => {
    if (i > 0) t += b.gapBeforeS ?? 0.45;
    let words: Word[];
    let lengthS: number;
    if (b.take) {
      const {fromS, toS} = b.take;
      words = b.take.words.map((w) => ({text: w.text, startS: w.startS - fromS, endS: w.endS - fromS}));
      lengthS = toS - fromS;
      const spoken = words.map((w) => norm(w.text)).join(' ');
      const written = b.text.split(/\s+/).map(norm).join(' ');
      if (spoken !== written) throw new Error(`Beat ${b.id}: take says "${spoken}" but text says "${written}"`);
    } else {
      words = placeholderWords(b.text);
      lengthS = words[words.length - 1].endS + 0.05;
    }
    const start = t;
    t += lengthS;
    return {
      ...b,
      startF: Math.round(start * FPS),
      endF: Math.round(t * FPS),
      words: words.map((w) => ({...w, startS: w.startS + start, endS: w.endS + start})),
      placeholder: !b.take,
      heard: heard[b.id],
    };
  });
  const durationInFrames = Math.ceil((t + tailS + holdS) * FPS);

  const beat = (id: string) => {
    const b = timed.find((x) => x.id === id);
    if (!b) throw new Error(`Unknown beat ${id}`);
    return b;
  };

  /** Frame (section time) where `phrase` starts in beat `id`'s line. Throws if it isn't there. */
  const cue = (id: string, phrase: string, offsetS = 0): number => {
    const b = beat(id);
    const target = phrase.split(/\s+/).map(norm).filter(Boolean);
    const all = b.words.map((w) => norm(w.text));
    for (let i = 0; i <= all.length - target.length; i++) {
      if (target.every((w, j) => all[i + j] === w)) return Math.round((b.words[i].startS + offsetS) * FPS);
    }
    throw new Error(`Cue "${phrase}" not found in beat ${id}`);
  };

  return {beats: timed, beat, cue, durationInFrames};
};

export type Section = ReturnType<typeof buildSection>;
