// How each scene's narration clip is assembled. A scene listed here is rebuilt
// from pieces in order. Anything else is its recording sceneNN.mp3, used as is.
//
// Piece kinds:
//  {src, from, to}  a span of an original scene recording, in seconds. Cut
//                   points sit about 0.08 s inside the pauses either side.
//  {line, from, to} part of a line take (from/to optional, in seconds), for
//                   reusing some of its sentences; trimmed and matched as below.
//  {line}           a newly recorded line (same voice and settings). Its own
//                   leading and trailing silence is trimmed to LINE_LEAD_S /
//                   LINE_TAIL_S. Its loudness is matched to the scene's first
//                   original recording (or Scene 1's), and gaps either side
//                   make the pause about the same as a natural one.
// Optional on any piece:
//  gainDb           level change for the piece
//  gapBefore        pause inserted before the piece (overrides the default)
//
// `text` is what the piece says. Joined, a scene's texts must equal its
// narration in script.md; scripts/normalize-voiceover.mjs checks this.
//
// v14 structure (16 scenes). Cut points come from word timings (Whisper) and
// the energy envelope of each take, placed inside the pauses.
//
// r4-05-homework starts at "AI checking its own work" (no "An"); its opening
// is the separate take r4-05-third.

/** Pause either side of a new line, on top of the cut margins. */
export const GAP_S = 0.36;
/** Air kept before and after each new line, and the level counted as silence. */
export const LINE_LEAD_S = 0.06;
export const LINE_TAIL_S = 0.25;
export const LINE_TRIM_DB = -65;

export const EDITS = {
  s01: [
    {
      line: 'scene01-intro.mp3',
      text:
        'AI agents are AIs that write files, run code and use tools on their own. They now write more code than people can review, so we need AI reviewers we can trust.',
    },
    {src: 'scene01.mp3', from: 0, to: 5.12, text: 'This is WinScope, a Windows app built by AI agents during a pilot run.'},
    {
      line: 'r4-01-hook.mp3',
      text: 'Over four review rounds, fresh AI reviewers found 97 problems the authors had missed, and one was hiding in code the AI had already checked itself.',
    },
    {
      line: 'r4-01-caveat.mp3',
      text: 'It was a single pilot, so it could just be how one particular AI behaves. But it raised a bigger question: what happens when a whole group of reviewers checks the work?',
    },
  ],
  s02: [
    {
      line: 'scene01-council.mp3',
      from: 3.75,
      to: 16.15,
      text:
        'A council is a group of independent reviewers who never wrote the code, each with a brief saying what to focus on: security holes, the logic, whether the app makes sense for the user, or private data leaking.',
    },
    // The take goes on "…and can it get better over generations by evolving?",
    // which the roadmap line now asks; cut in the pause after "cheat".
    {line: 'r4-02-questions.mp3', to: 5.15, text: 'Does a council catch more than one reviewer, behave differently, or try to cheat?'},
    {
      line: 'r4-02-questions.mp3',
      from: 9.42,
      to: 27.75,
      text:
        'These are open questions, and timely ones: a 2026 study suggests teams of small AI models that debate may just be an expensive way of asking one AI several times. We want to know if that holds for independent code review, or if fresh eyes and roles add something real.',
    },
    {
      line: 'r4-02-split.mp3',
      text:
        'These boil down to two questions. Question one: do councils of AI agents actually beat one agent, and how big should they be? Question two: if they do, can they evolve to get better?',
    },
  ],
  s03: [
    {line: 'r4-03-open.mp3', text: 'Start with question one, and the flaw from that pilot.'},
    {
      src: 'scene01.mp3',
      from: 5.57,
      to: 14.97,
      text: 'A coordinator wrote the shared code first and reviewed it itself. Then four builders worked in parallel, one folder each. Their tests passed.',
    },
    {line: 'r4-03-flaw1.mp3', text: 'Then an independent reviewer checked how the parts fitted together.'},
    {
      line: 'r4-03-flaw.mp3',
      from: 3.73,
      text:
        "It found that when WinScope ran with full administrator powers, it saved files in a folder the everyday, non-admin user could change. That's a back door to those powers.",
    },
    {src: 'scene01.mp3', from: 32.1, to: 37.89, text: 'It sat in shared code that no builder owned. A reviewer that had never seen the code caught it.'},
    {
      line: 'r4-03-pattern.mp3',
      text:
        "Across the pilot, the 97 problems built up over four review rounds, with fixes going in between, and each later round still found new ones. That's what review found in one pilot, not proof that councils work.",
    },
    {
      line: 'r4-03-why.mp3',
      text:
        "Why would the author miss it? Here's an idea, not a result: an author reads what it meant to write. A reviewer who didn't write the code only sees what's really there. Related research finds AIs often struggle to correct their own reasoning without outside feedback.",
    },
    {line: 'r4-03-lead.mp3', text: 'But do you need a council for that? Three objections come up.'},
  ],
  s04: [
    {
      line: 'r4-04-brief.mp3',
      text:
        'Why not just give one reviewer a better, broader brief? We test that head-to-head: one strong reviewer against a council, at the same cost. If the single reviewer matches it, the calculator at the end will say so.',
    },
    {
      line: 'r4-04-rerun.mp3',
      text:
        "Why not just rerun one reviewer? That's what the 2026 study suggests. Small models debated test questions. Simply asking one model several times and going with its most common answer did as well, at a fraction of the cost. And giving agents role labels made them worse.",
    },
    // r4-04-test's second sentence ("…on questions that mostly had one right
    // answer…") is replaced by r4-04-setup.
    {line: 'r4-04-test.mp3', to: 1.56, text: "But that's a different setup."},
    {
      line: 'r4-04-setup.mp3',
      text: 'Their agents debated and swayed each other, and their role labels sat inside a debate, not with specialists working alone from real task briefs.',
    },
    {
      line: 'r4-04-test.mp3',
      from: 14.4,
      text:
        "Ours review independently, where the code is actually run, and the goal is finding different problems. So we don't assume councils win. We test it at equal cost: the same model rerun, councils of generalists who all share one broad brief, councils of specialists with narrow briefs, mixes of both, and a mix of AI models. Evolution then shows whether specialising earns its place.",
    },
  ],
  s05: [
    {
      line: 'r4-05-diverse.mp3',
      text:
        "Before the third objection, here's our core hypothesis. Three copies of one strong model probably share the same blind spots, so they mostly repeat each other. Different strong models might cover each other's blind spots, and beat both one model and its copies. But debate studies, including that one, found debate doesn't reliably beat simply rerunning one model. As we saw, debate isn't independent review, which is why we test this rather than assume it.",
    },
    {
      line: 'r4-05-compare.mp3',
      text:
        'Is it the mix that helps, or just one stronger model? So we also run each model alone, on the same budget. Diverse councils may cost more, so if they win, the calculator could weigh that against risk, keeping them for high-risk code.',
    },
    {line: 'r4-05-third.mp3', text: 'Now, the third objection: why not just use a smarter model?'},
    {
      line: 'r4-05-homework.mp3',
      text:
        'AI checking its own work is marking its own homework. Like the coordinator in the pilot, it knows what it meant, and may give itself the benefit of the doubt. A better model is still marking its own homework. Related research finds models can recognise their own writing and rate it higher, which motivates the idea. So our second hypothesis, for review at least, is that a reviewer who didn\'t write the code beats a smarter model checking itself, and we test that at the same cost.',
    },
    {line: 'r4-04-lead.mp3', text: 'And if a council does win, the next question is size.'},
  ],
  s06: [
    {line: 'scene02-open.mp3', text: 'The obvious way to improve a council is to add reviewers.'},
    {
      src: 'scene02.mp3',
      from: 2.99,
      to: 10.27,
      text: 'But every reviewer costs tokens, and studies of multi-agent systems find that adding agents often hits a ceiling.',
    },
    {line: 'scene02-tokens.mp3', text: "Tokens are what you pay for, so a cheaper council that's just as good is a real win."},
    {
      line: 'scene10b.mp3',
      to: 11.29,
      text:
        "Before this video went live, three AI reviewers with different briefs audited this project's public repos. Sixteen of their seventeen findings were caught by only one reviewer.",
    },
    {
      src: 'scene02.mp3',
      from: 13.75,
      // The take ends on a clipped breath (a click); stop in the pause before it.
      to: 22.96,
      text: "So this experiment asks how many reviewers a given kind of task is worth. We'll follow one small app throughout: a command-line file renamer.",
    },
  ],
  s07: [
    {src: 'scene03.mp3', from: 28.28, text: 'Across council sizes, the optimum is where one more reviewer costs more than it adds.'},
    {
      src: 'scene04.mp3',
      from: 0,
      to: 6.4,
      gapBefore: GAP_S,
      text: "The optimum probably isn't one number, so the same sweep runs on tasks of different complexity.",
    },
    {
      line: 'r4-07-small.mp3',
      text:
        'Human code review offers a hint: in a classic 1990s study at a real software company, teams of two reviewers found defects as well as teams of four, though one reviewer alone did worse. So we start small and let the results decide, and the calculator will say if a small council is enough.',
    },
    {line: 'r4-06-lead.mp3', text: "So how do we find the best council for each task? That's question two."},
  ],
  s08: [
    {
      line: 'scene03-open.mp3',
      text:
        "Councils evolve in generations, and the scores here are illustrative. Each generation is one round: a few council variants review the app's code, an author agent fixes what they find, and the best one carries forward with small changes.",
    },
    {
      line: 'r4-07-briefs.mp3',
      text:
        'One thing that changes is each reviewer\'s brief. A brief isn\'t just a label like "you\'re a security expert". It\'s real instructions: what to check, and how to show a problem is real. Labels alone don\'t reliably help, research suggests, so we also test briefs against no briefs.',
    },
    {
      src: 'scene03.mp3',
      from: 5.13,
      to: 15.7,
      text: "A judge runs fixed tests. If the score rises, the change is kept. If not, it's discarded. A second set of tests is never shown to the agents.",
    },
    {
      src: 'scene03.mp3',
      from: 22.97,
      to: 27.92,
      gapBefore: GAP_S,
      text: "The winner scores best on those held-out tests, which isn't always the last version.",
    },
    {
      line: 'r4-08-control.mp3',
      text:
        'And to show evolution really helps, we compare an evolving council against one that gets the same number of review rounds and the same spend, without evolving. Otherwise, "it got better" might just mean "it spent more".',
    },
  ],
  s09: [
    {line: 'scene05-open.mp3', text: 'For a fair comparison, only the council is allowed to change.'},
    {
      src: 'scene05.mp3',
      from: 2.64,
      to: 14.14,
      text:
        'Every run starts in a fresh chat, with no memory of earlier runs and no hint of the hoped-for result. The judge scores outputs blind, without knowing which size or model produced them.',
    },
    {
      src: 'scene08.mp3',
      from: 8.78,
      to: 15.07,
      gapBefore: GAP_S,
      text: 'The hard tests decide each round, not votes, because AI judges tend to favour their own style.',
    },
    {
      line: 'r4-09-measure.mp3',
      text:
        "Here's how we'll measure it. We plant known bugs in the test apps, kept secret, and score each review on what it catches, what it falsely flags, and how serious its catches are, so an average can't hide a missed critical flaw. Cost is counted in money. Catching bugs is the result, and cost is what it took, so counting bugs alone would just reward whoever spends the most. That's why we compare councils at every budget, from cheap to expensive. Every council's reports are combined by the same independent step. The judge, and that step, come from a different family of AI models than the council. Each setup runs several times, so only gains that hold count. And the plan is published before the first run, so we can't move the goalposts.",
    },
    {src: 'scene05.mp3', from: 19.53, to: 24.91, text: 'And everything runs in a sandbox. The sandbox stops agents touching anything real.'},
    {line: 'r4-08-aim.mp3', text: "The aim: a council can't improve by memorising tests or gaming the judge, only by reviewing better."},
  ],
  s10: [
    {line: 'scene06-open.mp3', text: 'Agents rewarded for winning may still try to game the score.'},
    {
      line: 'r4-09-guard.mp3',
      text: "The experiment hasn't run yet, so this is something we guard against and test for, not something we've seen. Here's how it could look.",
    },
    {
      src: 'scene06.mp3',
      from: 5.43,
      to: 18.04,
      text:
        "A branch jumps from seventy-one to ninety-four. The diff shows why: it didn't fix the bug, it skipped the test. On the held-out tests, which it never saw, it scores sixty-five.",
    },
    {
      line: 'scene06-judge.mp3',
      text:
        'So the judge also checks the tests themselves: any change that weakens, skips or edits a test is flagged, and this branch is thrown out.',
    },
    {
      src: 'scene06.mp3',
      from: 25.54,
      to: 46.67,
      text:
        'Collusion is harder to see, so the design removes the channels. Agents never message each other directly. Everything goes through the orchestrator and is logged. Messages are paraphrased, which breaks signals hidden in exact wording. The judge sees code and test results, never the arguments. And the logs are audited for odd patterns.',
    },
    {
      line: 'scene06-checks.mp3',
      to: 12.42,
      text:
        'Some failures are quieter, so each gets its own check. Reviewers that approve everything are caught by counting the real issues they raise. Token and time caps are enforced by the orchestrator.',
    },
    {line: 'r4-09-files.mp3', text: 'Instructions hidden in the files under review are treated as text to check, never as orders.'},
  ],
  s11: [
    {
      line: 'r4-10-meet.mp3',
      text: 'Now the two questions meet. Evolution, together with the size tests, is how we search for the best council: its size, its roles and its mix of models.',
    },
  ],
  s12: [
    {
      src: 'scene08.mp3',
      from: 0,
      to: 8.35,
      text: 'Two side experiments use the same setup. In a knockout tournament, reviewers are eliminated round by round until one remains.',
    },
    {line: 'r4-12-bracket.mp3', text: 'Generalists and specialists enter the same bracket, which hints at whether specialising pays.'},
    {line: 'scene08-pot.mp3', text: 'The two finalists then play Split or Steal for a pot of points.'},
    {src: 'scene08.mp3', from: 26.9, to: 29.59, text: 'They talk, then each secretly chooses.'},
    {line: 'scene08-split.mp3', text: 'If both split, each gets half. If one steals, the stealer gets it all. If both steal, neither gets anything.'},
    // New take: the original's "trust" was clipped at the end of the file.
    {line: 'scene08-trust.mp3', text: 'It measures cooperation and trust.'},
    {
      line: 'r4-12-mix.mp3',
      text:
        "Finally, the tournament winner faces a team of different models. It's only a side experiment: a knockout doesn't keep budgets equal, so the fair, same-budget tests from question one give the real answer.",
    },
  ],
  s13: [
    {
      line: 'scene10a.mp3',
      to: 8.45,
      text: "Back to the main experiment: here's an example of a winning council. Four reviewers with different roles check the same work independently.",
    },
    {
      line: 'r4-13-flow.mp3',
      text: 'Their findings are merged, the author fixes them, an independent reviewer verifies the fixes, and a judge scores the results blind.',
    },
    {
      line: 'r4-12-merge.mp3',
      text:
        "Someone has to merge those reports, and that step decides what the author finally sees. A bad merger can drop a reviewer's best catch, let a false alarm through, or bring blind spots of its own. So we compare a dedicated merger, keeping everything, and keeping only findings two reviewers agree on. For fair comparisons, every council uses the same fixed, independent merger. The judge itself, and a merger that evolves with the council, are tested separately.",
    },
    {
      line: 'scene10a.mp3',
      from: 16.85,
      to: 31.21,
      text:
        'A council wins by scoring best on the held-out tests: the most real problems found, including the most serious, with the fewest false alarms for the tokens used. In practice, that should mean more secure, more reliable code.',
    },
  ],
  // scene11.mp3 is the original Scene 10 recording (calculator and end card).
  s14: [
    {line: 'scene11-open.mp3', text: 'The winning setups will then feed a small calculator, so anyone can set up a council for their own task.'},
    {
      src: 'scene11.mp3',
      from: 9.13,
      to: 20.96,
      text:
        'It estimates the token cost, council size and model mix, then writes a prompt you can paste into any AI: how many reviewers, which models and effort levels, and what hard caps to apply.',
    },
  ],
  s15: [
    {src: 'scene09.mp3', from: 0, to: 5.49, text: 'The same method could reach beyond code. Take speech recognition and a Welsh accent.'},
    {
      src: 'scene09.mp3',
      from: 30.62,
      gapBefore: GAP_S,
      text: 'If AI hears some accents worse than others, whole regions can quietly get worse answers.',
    },
    {
      src: 'scene09.mp3',
      from: 15.08,
      to: 22.79,
      gapBefore: GAP_S,
      text: "The council can't retrain the speech model, so it evolves the step after it, the part that corrects and interprets what was heard.",
    },
    {line: 'r4-14-question.mp3', text: 'Does a council correct speech differently from one model? A follow-up experiment would test that.'},
  ],
  s16: [
    {
      line: 'r4-15-alternatives.mp3',
      text:
        'We also test simpler alternatives: traditional code-checking tools like linters and security scanners, letting one AI think for longer, hand-tuned briefs, and reviewing in stages. And we check three more things: whether fixes actually land, whether councils only pay off on hard or high-risk code, which the calculator takes into account, and what happens if reviewers see each other\'s findings. These will be discussed more in our research.',
    },
    {line: 'r4-15-limits.mp3', to: 4.19, text: "Back to the pilot. It was informal, but its numbers are real."},
    // Replaces "Its limits: one app and one run." in r4-15-limits.
    {line: 'r4-16-once.mp3', text: 'Its limits: one app, and the pilot ran only once.'},
    {
      line: 'r4-15-limits.mp3',
      from: 7.83,
      text:
        "It was built and tested on Linux, never on Windows itself. Its reviewers kept some saved memory, so they weren't fully fresh. And the council size never changed, which the formal experiment will vary.",
    },
    {line: 'scene11-public.mp3', text: 'The GitHub repo is public now, and the write-up and raw run logs will be published after the runs.'},
    {line: 'scene11-follow.mp3', text: 'Follow the channel for the results, and find everything at the GitHub repo and ablationlab.org.'},
  ],
};
