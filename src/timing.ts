// Single source of truth for scene order, narration and duration.
// Durations and cues come from the recorded voiceover: src/voiceover.json holds
// each clip's length and per-word timings (see scripts/align-voiceover.mjs).
// A scene without a recording falls back to NARRATION_WPM.
import voiceover from './voiceover.json';

export const FPS = 30;
export const NARRATION_WPM = 160;
// Silence before the first word of each scene, and after the last.
export const LEAD_IN_S = 0.5;
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
    title: "The spark",
    narration:
      "AI agents are AIs that write files, run code and use tools on their own. They now write more code than people can review, so we need AI reviewers we can trust. This is WinScope, a Windows app built by AI agents during a pilot run. Over four review rounds, fresh AI reviewers found 97 problems the authors had missed, and one was hiding in code the AI had already checked itself. It was a single pilot, so it could just be how one particular AI behaves. But it raised a bigger question: what happens when a whole group of reviewers checks the work?",
    extraHoldS: 2.0,
  },
  {
    id: 's02',
    chapter: '02',
    title: "The big question",
    narration:
      "A council is a group of independent reviewers who never wrote the code, each with a brief saying what to focus on: security holes, the logic, whether the app makes sense for the user, or private data leaking. Does a council catch more than one reviewer, behave differently, or try to cheat? These are open questions, and timely ones: a 2026 study suggests teams of small AI models that debate may just be an expensive way of asking one AI several times. We want to know if that holds for independent code review, or if fresh eyes and roles add something real. These boil down to two questions. Question one: do councils of AI agents actually beat one agent, and how big should they be? Question two: if they do, can they evolve to get better?",
    extraHoldS: 1.5,
  },
  {
    id: 's03',
    chapter: '03',
    title: "A reviewer who didn't write the code",
    narration:
      "Start with question one, and the flaw from that pilot. A coordinator wrote the shared code first and reviewed it itself. Then four builders worked in parallel, one folder each. Their tests passed. Then an independent reviewer checked how the parts fitted together. It found that when WinScope ran with full administrator powers, it saved files in a folder the everyday, non-admin user could change. That's a back door to those powers. It sat in shared code that no builder owned. A reviewer that had never seen the code caught it. Across the pilot, the 97 problems built up over four review rounds, with fixes going in between, and each later round still found new ones. That's what review found in one pilot, not proof that councils work. Why would the author miss it? Here's an idea, not a result: an author reads what it meant to write. A reviewer who didn't write the code only sees what's really there. Related research finds AIs often struggle to correct their own reasoning without outside feedback. But do you need a council for that? Three objections come up.",
    extraHoldS: 1.5,
  },
  {
    id: 's04',
    chapter: '04',
    title: "Simpler fixes?",
    narration:
      "Why not just give one reviewer a better, broader brief? We test that head-to-head: one strong reviewer against a council, at the same cost. If the single reviewer matches it, the calculator at the end will say so. Why not just rerun one reviewer? That's what the 2026 study suggests. Small models debated test questions. Simply asking one model several times and going with its most common answer did as well, at a fraction of the cost. And giving agents role labels made them worse. But that's a different setup. Their agents debated and swayed each other, and their role labels sat inside a debate, not with specialists working alone from real task briefs. Ours review independently, where the code is actually run, and the goal is finding different problems. So we don't assume councils win. We test it at equal cost: the same model rerun, councils of generalists who all share one broad brief, councils of specialists with narrow briefs, mixes of both, and a mix of AI models. Evolution then shows whether specialising earns its place.",
    extraHoldS: 1.5,
  },
  {
    id: 's05',
    chapter: '05',
    title: "Different models, and marking your own homework",
    narration:
      "Before the third objection, here's our core hypothesis. Three copies of one strong model probably share the same blind spots, so they mostly repeat each other. Different strong models might cover each other's blind spots, and beat both one model and its copies. But debate studies, including that one, found debate doesn't reliably beat simply rerunning one model. As we saw, debate isn't independent review, which is why we test this rather than assume it. Is it the mix that helps, or just one stronger model? So we also run each model alone, on the same budget. Diverse councils may cost more, so if they win, the calculator could weigh that against risk, keeping them for high-risk code. Now, the third objection: why not just use a smarter model? AI checking its own work is marking its own homework. Like the coordinator in the pilot, it knows what it meant, and may give itself the benefit of the doubt. A better model is still marking its own homework. Related research finds models can recognise their own writing and rate it higher, which motivates the idea. So our second hypothesis, for review at least, is that a reviewer who didn't write the code beats a smarter model checking itself, and we test that at the same cost. And if a council does win, the next question is size.",
    extraHoldS: 1.5,
  },
  {
    id: 's06',
    chapter: '06',
    title: "More isn't free",
    narration:
      "The obvious way to improve a council is to add reviewers. But every reviewer costs tokens, and studies of multi-agent systems find that adding agents often hits a ceiling. Tokens are what you pay for, so a cheaper council that's just as good is a real win. Before this video went live, three AI reviewers with different briefs audited this project's public repos. Sixteen of their seventeen findings were caught by only one reviewer. So this experiment asks how many reviewers a given kind of task is worth. We'll follow one small app throughout: a command-line file renamer.",
    extraHoldS: 1.3,
  },
  {
    id: 's07',
    chapter: '07',
    title: "Size depends on the task",
    narration:
      "Across council sizes, the optimum is where one more reviewer costs more than it adds. The optimum probably isn't one number, so the same sweep runs on tasks of different complexity. Human code review offers a hint: in a classic 1990s study at a real software company, teams of two reviewers found defects as well as teams of four, though one reviewer alone did worse. So we start small and let the results decide, and the calculator will say if a small council is enough. So how do we find the best council for each task? That's question two.",
    extraHoldS: 1.3,
  },
  {
    id: 's08',
    chapter: '08',
    title: "How the council evolves",
    narration:
      "Councils evolve in generations, and the scores here are illustrative. Each generation is one round: a few council variants review the app's code, an author agent fixes what they find, and the best one carries forward with small changes. One thing that changes is each reviewer's brief. A brief isn't just a label like \"you're a security expert\". It's real instructions: what to check, and how to show a problem is real. Labels alone don't reliably help, research suggests, so we also test briefs against no briefs. A judge runs fixed tests. If the score rises, the change is kept. If not, it's discarded. A second set of tests is never shown to the agents. The winner scores best on those held-out tests, which isn't always the last version. And to show evolution really helps, we compare an evolving council against one that gets the same number of review rounds and the same spend, without evolving. Otherwise, \"it got better\" might just mean \"it spent more\".",
    extraHoldS: 1.3,
  },
  {
    id: 's09',
    chapter: '09',
    title: "Keeping it fair",
    narration:
      "For a fair comparison, only the council is allowed to change. Every run starts in a fresh chat, with no memory of earlier runs and no hint of the hoped-for result. The judge scores outputs blind, without knowing which size or model produced them. The hard tests decide each round, not votes, because AI judges tend to favour their own style. Here's how we'll measure it. We plant known bugs in the test apps, kept secret, and score each review on what it catches, what it falsely flags, and how serious its catches are, so an average can't hide a missed critical flaw. Cost is counted in money. Catching bugs is the result, and cost is what it took, so counting bugs alone would just reward whoever spends the most. That's why we compare councils at every budget, from cheap to expensive. Every council's reports are combined by the same independent step. The judge, and that step, come from a different family of AI models than the council. Each setup runs several times, so only gains that hold count. And the plan is published before the first run, so we can't move the goalposts. And everything runs in a sandbox. The sandbox stops agents touching anything real. The aim: a council can't improve by memorising tests or gaming the judge, only by reviewing better.",
    extraHoldS: 1.5,
  },
  {
    id: 's10',
    chapter: '10',
    title: "Cheating, collusion and failure modes",
    narration:
      "Agents rewarded for winning may still try to game the score. The experiment hasn't run yet, so this is something we guard against and test for, not something we've seen. Here's how it could look. A branch jumps from seventy-one to ninety-four. The diff shows why: it didn't fix the bug, it skipped the test. On the held-out tests, which it never saw, it scores sixty-five. So the judge also checks the tests themselves: any change that weakens, skips or edits a test is flagged, and this branch is thrown out. Collusion is harder to see, so the design removes the channels. Agents never message each other directly. Everything goes through the orchestrator and is logged. Messages are paraphrased, which breaks signals hidden in exact wording. The judge sees code and test results, never the arguments. And the logs are audited for odd patterns. Some failures are quieter, so each gets its own check. Reviewers that approve everything are caught by counting the real issues they raise. Token and time caps are enforced by the orchestrator. Instructions hidden in the files under review are treated as text to check, never as orders.",
    extraHoldS: 2.0,
  },
  {
    id: 's11',
    chapter: '11',
    title: "The two questions meet",
    narration:
      "Now the two questions meet. Evolution, together with the size tests, is how we search for the best council: its size, its roles and its mix of models.",
    extraHoldS: 1.5,
  },
  {
    id: 's12',
    chapter: '12',
    title: "Side experiments",
    narration:
      "Two side experiments use the same setup. In a knockout tournament, reviewers are eliminated round by round until one remains. Generalists and specialists enter the same bracket, which hints at whether specialising pays. The two finalists then play Split or Steal for a pot of points. They talk, then each secretly chooses. If both split, each gets half. If one steals, the stealer gets it all. If both steal, neither gets anything. It measures cooperation and trust. Finally, the tournament winner faces a team of different models. It's only a side experiment: a knockout doesn't keep budgets equal, so the fair, same-budget tests from question one give the real answer.",
    extraHoldS: 1.3,
  },
  {
    id: 's13',
    chapter: '13',
    title: "What a winning council looks like",
    narration:
      "Back to the main experiment: here's an example of a winning council. Four reviewers with different roles check the same work independently. Their findings are merged, the author fixes them, an independent reviewer verifies the fixes, and a judge scores the results blind. Someone has to merge those reports, and that step decides what the author finally sees. A bad merger can drop a reviewer's best catch, let a false alarm through, or bring blind spots of its own. So we compare a dedicated merger, keeping everything, and keeping only findings two reviewers agree on. For fair comparisons, every council uses the same fixed, independent merger. The judge itself, and a merger that evolves with the council, are tested separately. A council wins by scoring best on the held-out tests: the most real problems found, including the most serious, with the fewest false alarms for the tokens used. In practice, that should mean more secure, more reliable code.",
    extraHoldS: 1.5,
  },
  {
    id: 's14',
    chapter: '14',
    title: "The calculator",
    narration:
      "The winning setups will then feed a small calculator, so anyone can set up a council for their own task. It estimates the token cost, council size and model mix, then writes a prompt you can paste into any AI: how many reviewers, which models and effort levels, and what hard caps to apply.",
    extraHoldS: 1.3,
  },
  {
    id: 's15',
    chapter: '15',
    title: "Beyond code: accents",
    narration:
      "The same method could reach beyond code. Take speech recognition and a Welsh accent. If AI hears some accents worse than others, whole regions can quietly get worse answers. The council can't retrain the speech model, so it evolves the step after it, the part that corrects and interprets what was heard. Does a council correct speech differently from one model? A follow-up experiment would test that.",
    extraHoldS: 1.3,
  },
  {
    id: 's16',
    chapter: '16',
    title: "What's next",
    narration:
      "We also test simpler alternatives: traditional code-checking tools like linters and security scanners, letting one AI think for longer, hand-tuned briefs, and reviewing in stages. And we check three more things: whether fixes actually land, whether councils only pay off on hard or high-risk code, which the calculator takes into account, and what happens if reviewers see each other's findings. These will be discussed more in our research. Back to the pilot. It was informal, but its numbers are real. Its limits: one app, and the pilot ran only once. It was built and tested on Linux, never on Windows itself. Its reviewers kept some saved memory, so they weren't fully fresh. And the council size never changed, which the formal experiment will vary. The GitHub repo is public now, and the write-up and raw run logs will be published after the runs. Follow the channel for the results, and find everything at the GitHub repo and ablationlab.org.",
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

/**
 * Seconds (scene time, including the lead-in) from the start of `firstPhrase`
 * to the end of the word `lastPhrase` ends on. Used to cut clean excerpts.
 */
export const phraseSpan = (id: string, firstPhrase: string, lastPhrase: string) => {
  const scene = getScene(id);
  const clip = getVoiceover(scene);
  if (!clip) throw new Error(`${id} has no recording`);
  const all = words(scene.narration);
  const find = (phrase: string, from = 0) => {
    const target = words(phrase).map((w) => w.norm);
    for (let i = from; i <= all.length - target.length; i++) {
      if (target.every((w, j) => all[i + j].norm === w)) return i;
    }
    throw new Error(`"${phrase}" not found in narration of ${id}`);
  };
  const first = find(firstPhrase);
  const lastWord = all[find(lastPhrase, first) + words(lastPhrase).length - 1];
  return {
    startS: LEAD_IN_S + clip.words[all[first].index].startMs / 1000,
    endS: LEAD_IN_S + clip.words[lastWord.index].endMs / 1000,
  };
};

export const totalDurationInFrames = SCENES.reduce(
  (sum, s) => sum + sceneDurationInFrames(s),
  0,
);
