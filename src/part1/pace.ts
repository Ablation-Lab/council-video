// Pacing rules for every section of the two-part film. The narration is never
// stretched: calm comes from slower entrances, a short beat after each key
// point, and key facts held on screen after they fully appear.
import {FPS} from '../timing';

/** Frames for a box, chip or line of text to arrive. */
export const ENTER = 30;
/** Frames for headings, big numbers and whole slides to arrive. */
export const ENTER_BIG = 36;
/** Frames for a number to count up. */
export const COUNT_UP = 30;
/** Frames between items that arrive one after another. */
export const STAGGER = 8;
/** Crossfade between slides, in frames. */
export const SLIDE_FADE = 22;
/** Pause after each key point before the next thing appears (seconds). */
export const BEAT_S = 0.5;
/** A key number or fact stays at least this long after it fully appears (seconds). */
export const KEY_HOLD_S = 2.5;

export type KeyFact = {label: string; fullAt: number; leavesAt: number};

/** Throws if any key fact leaves the screen too soon, so a timing change can't quietly rush one. */
export const assertHolds = (section: string, facts: KeyFact[]) => {
  for (const f of facts) {
    const held = (f.leavesAt - f.fullAt) / FPS;
    if (held < KEY_HOLD_S) {
      throw new Error(`${section}: "${f.label}" is on screen for ${held.toFixed(2)} s after it fully appears; it needs ${KEY_HOLD_S} s.`);
    }
  }
};

/** Seconds each key fact is held, for reports. */
export const holds = (facts: KeyFact[]) => facts.map((f) => ({label: f.label, heldS: (f.leavesAt - f.fullAt) / FPS}));
