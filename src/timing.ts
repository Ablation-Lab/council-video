// Single source of truth for scene order, narration and duration.
// Durations and cues come from the recorded voiceover: src/voiceover.json holds
// each clip's length and per-word timings (see scripts/align-voiceover.mjs).
// A scene without a recording falls back to NARRATION_WPM.
import voiceover from './voiceover.json';

export const FPS = 30;
export const NARRATION_WPM = 160;
// Silence before the first word of each scene, and after the last.
export const LEAD_IN_S = 0.4;
export const TAIL_S = 1.0;

export type SceneMeta = {
  id: string;
  chapter: string;
  title: string;
  narration: string;
  // Extra seconds for visuals that hold without narration.
  extraHoldS?: number;
};

export const SCENES: SceneMeta[] = [
  {
    id: 's01',
    chapter: '01',
    title: 'The finding',
    narration:
      "This is WinScope, a Windows app built by AI agents during a pilot run. A coordinator wrote the shared code first and reviewed it itself. Then four builders worked in parallel, one folder each. Their tests passed. Then a fresh reviewer ran an integration audit. It found that when WinScope ran as admin, it wrote settings and logs into the user's own AppData folder. An admin process that trusts a folder the user can write to is a flaw that could hand an attacker admin rights. It sat in shared code that no builder owned. A reviewer that had never seen the code caught it. This project builds on that: reviewers that improve over generations.",
    extraHoldS: 2,
  },
  {
    id: 's02',
    chapter: '02',
    title: "More isn't free",
    narration:
      "The obvious fix is more reviewers. But every reviewer costs tokens, and studies of multi-agent systems find that adding agents often hits a ceiling. Identical reviewers mostly repeat each other. So this experiment asks how many reviewers a given kind of task is worth. We'll follow one small app throughout: a command-line file renamer.",
    extraHoldS: 2,
  },
  {
    id: 's03',
    chapter: '03',
    title: 'How the council evolves',
    narration:
      "Each generation starts from the best version so far and tries to improve it. A judge runs fixed tests. If the score rises, the change is kept. If not, it's discarded. A second set of tests is never shown to the agents. The run stops when two generations in a row improve by less than about two percent, or a cap is hit. The winner scores best on those held-out tests, which isn't always the last version. Across council sizes, the optimum is where one more reviewer costs more than it adds.",
    extraHoldS: 2,
  },
  {
    id: 's04',
    chapter: '04',
    title: 'Size depends on the task',
    narration:
      "The optimum probably isn't one number, so the same sweep runs on tasks of different complexity. A basic app like the renamer might need around six reviewers, a scientific app around twenty, frontier research far more. These are guesses to test, not results. The aim is a rough scale of review effort per tier, to set the starting council size for a new task.",
    extraHoldS: 1,
  },
  {
    id: 's05',
    chapter: '05',
    title: 'Keeping it fair',
    narration:
      'Only the council is allowed to change. Every run starts in a fresh chat, with no memory of earlier runs and no hint of the hoped-for result. The judge scores outputs blind, without knowing which size or model produced them. Every setup gets the same app, the same starting code and the same tests. And everything runs in a sandbox. The sandbox stops agents touching anything real. Fresh chats stop earlier context biasing the results.',
  },
  {
    id: 's06',
    chapter: '06',
    title: 'Cheating, collusion and failure modes',
    narration:
      "Agents rewarded for winning may try to game the score. Here's one way it can look. A branch jumps from seventy-one to ninety-four. The diff shows why: it didn't fix the bug, it skipped the test. On the held-out tests, which it never saw, it scores sixty-five. The judge also flags any change that weakens, skips or edits tests, so the branch is thrown out. Collusion is harder to see, so the design removes the channels. Agents never message each other directly. Everything goes through the orchestrator and is logged. Messages are paraphrased, which breaks signals hidden in exact wording. The judge sees code and test results, never the arguments. And the logs are audited for odd patterns. Some failures are quieter. Each one gets a specific check.",
    extraHoldS: 5,
  },
  {
    id: 's07',
    chapter: '07',
    title: 'What the WinScope pilot showed',
    narration:
      "The WinScope pilot was informal, but its numbers are real. About half its 3.7 million subagent tokens went on review and verification. Those rounds found 97 problems the builders' tests had passed, and every serious bug came from an agent that hadn't written the code. Verification after fixes never came back clean on its first pass. The limits: one app, one run, Linux only, reviewers with saved memory, and a fixed council size. The formal experiment varies that.",
  },
  {
    id: 's08',
    chapter: '08',
    title: 'Side experiments',
    narration:
      "Two side experiments use the same setup. In a knockout tournament, reviewers are eliminated round by round until one remains. The hard tests decide each round, not votes, because AI judges tend to favour their own style. The single winner is then compared with a varied team, since earlier research suggests diversity can beat one top reviewer. The two finalists then play Split or Steal. They talk, then each secretly chooses. If both split, they share. If one steals, it takes everything. If both steal, neither gets anything. It doesn't affect the review result. It measures cooperation and trust.",
    extraHoldS: 1.5,
  },
  {
    id: 's09',
    chapter: '09',
    title: 'Beyond code: accents',
    narration:
      "The same method could reach beyond code. Take speech recognition and a Welsh accent. The benchmark is real recordings with transcripts checked by a person, scored by word error rate: the share of words the system gets wrong. The council can't retrain the speech model, so it evolves the step after it, the part that corrects and interprets what was heard. Some speakers are held back as unseen tests, so the system learns the accent rather than individual voices. If AI hears some accents worse than others, whole regions can quietly get worse answers.",
  },
  {
    id: 's10',
    chapter: '10',
    title: 'The calculator, and what gets published',
    narration:
      "Once the runs are finished, their results feed a small calculator. You pick a task template, such as a basic app or a system-level tool. It estimates the token cost, council size and model mix, then writes a prompt you can paste into any AI: how many reviewers, which models and effort levels, and what hard caps to apply. Each new run improves the estimates. Everything is public: the GitHub repo, a write-up, and the raw run logs. WinScope showed a council catches what builders miss. The open question is how many reviewers you actually need. That's the next experiment.",
    // Ends 2.5 s after the last word: 1.5 s of end card, then a 1 s fade.
    extraHoldS: 1.25,
  },
];

type VoiceoverClip = {file: string; seconds: number; words: {text: string; startMs: number; endMs: number}[]};
const VOICEOVER = voiceover as Record<string, VoiceoverClip>;

/** Narration as comparable words, each keeping its index in the raw text. */
const words = (text: string) =>
  text
    .split(/\s+/)
    .map((raw, index) => ({index, norm: raw.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '')}))
    .filter((w) => w.norm);

const wordsPerSecond = NARRATION_WPM / 60;

/** The recording for a scene, if its word count matches the narration. */
export const getVoiceover = (scene: SceneMeta): VoiceoverClip | null => {
  const clip = VOICEOVER[scene.id];
  if (!clip) return null;
  const rawCount = scene.narration.split(/\s+/).length;
  if (clip.words.length !== rawCount) {
    throw new Error(
      `${scene.id}: voiceover has ${clip.words.length} words but the narration has ${rawCount}. Re-run scripts/align-voiceover.mjs.`,
    );
  }
  return clip;
};

/** Seconds of narration audio for a scene. */
const narrationSeconds = (scene: SceneMeta) =>
  getVoiceover(scene)?.seconds ?? words(scene.narration).length / wordsPerSecond;

export const sceneDurationInFrames = (scene: SceneMeta): number => {
  const seconds = LEAD_IN_S + narrationSeconds(scene) + TAIL_S + (scene.extraHoldS ?? 0);
  return Math.ceil(seconds * FPS);
};

export const getScene = (id: string): SceneMeta => {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) throw new Error(`Unknown scene ${id}`);
  return scene;
};

/**
 * Returns the frame (relative to the scene start) at which `phrase` begins in
 * the scene's narration, so animations land on the words they illustrate.
 * Throws if the phrase isn't in the narration, so script edits that break a
 * cue fail loudly instead of drifting.
 */
export const makeCue = (id: string) => {
  const scene = getScene(id);
  const all = words(scene.narration);
  const clip = getVoiceover(scene);
  return (phrase: string, offsetS = 0): number => {
    const target = words(phrase).map((w) => w.norm);
    for (let i = 0; i <= all.length - target.length; i++) {
      if (target.every((w, j) => all[i + j].norm === w)) {
        const spokenAt = clip ? clip.words[all[i].index].startMs / 1000 : i / wordsPerSecond;
        return Math.round((LEAD_IN_S + spokenAt + offsetS) * FPS);
      }
    }
    throw new Error(`Cue "${phrase}" not found in narration of ${id}`);
  };
};

export const totalDurationInFrames = SCENES.reduce(
  (sum, s) => sum + sceneDurationInFrames(s),
  0,
);
