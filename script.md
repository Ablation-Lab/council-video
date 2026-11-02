# Evolving Review Councils — Explainer Script (v14)

Narration: ElevenLabs recordings, normalised to -14 LUFS. v14 restructures the film into 16 scenes in two parts (Question 1: do councils beat one agent, and how big should they be? Question 2: can they evolve?). `scripts/voiceover-edits.mjs` lists every piece: spans of the original scene recordings and the line takes (`scene*-*.mp3`, `r4-*.mp3`). Pauses after full stops are lengthened to at least 0.5 s (after colons, 0.35 s) by inserting silence (`scripts/plan-pauses.mjs`); the voice is never time-stretched. Scene lengths and cues come from the recordings (src/voiceover.json). Total runtime 15:09. 1920×1080, 30 fps.

Ground rule: the formal experiment hasn't run. Results come only from the WinScope pilot and the pre-launch audit; everything else is "we expect", "we test" or illustrative. Published research is cited on screen (short title, author, year), with full links in the README.

The narration lines below (the `> ` lines) are the source for `scripts/normalize-voiceover.mjs` and `scripts/align-voiceover.mjs`. Keep them identical to `src/timing.ts`.

## YouTube chapters

Generated from the scene lengths in `src/timing.ts`. Recompute after any change to the narration.

```
0:00 The spark
0:42 The big question
1:37 A reviewer who didn't write the code
2:53 Simpler fixes?
4:08 Different models, and marking your own homework
5:38 More isn't free
6:19 Size depends on the task
7:01 How the council evolves
8:10 Keeping it fair
9:38 Cheating, collusion and failure modes
10:58 The two questions meet
11:13 Side experiments
12:04 What a winning council looks like
13:10 The calculator
13:32 Beyond code: accents
14:01 What's next
```

## Global design

- **Palette:** background `#0B0D10`, primary text `#E6E8EB`, secondary text `#8A9099`, rules/lines `#2A2F36`. **One accent: amber `#F2A541`**, used only for whatever matters most in the shot (the finding, the kept node, the winner). Discarded things go dashed grey and drop to 30% opacity.
- **Type:** Inter for headings (64–96 px) and body (minimum 40 px). JetBrains Mono for code, logs and terminals. Nothing on screen smaller than 28 px.
- **Motion:** slow, eased (cubic in-out, no bounce). Most moves take 20–30 frames. Typing effects run at ~30–45 characters/s. Changes of pace: a hard break before each "Question" marker and before Objection 3.
- **Recurring diagram, the Generation Tree:** nodes are rounded rectangles showing `G2 · 71`. Edges draw left to right. Kept = solid accent outline. Discarded = dashed grey and faded. It appears in Scene 8.
- **Example app:** `rename-cli`, a small command-line file renamer. Its scores are **illustrative**, and a caption says so every time they appear. The only real numbers in the video come from the WinScope pilot and the pre-launch audit.
- **Examples are labelled:** illustrative numbers carry a caption; the Scene 13 council carries an `EXAMPLE` tag and the caption *"Example council, not a measured result."*
- **Chapter tag:** bottom-left, small caps, e.g. `03 / HOW THE COUNCIL EVOLVES`.
- **Audio:** one narration clip per scene, with 30 ms fades at both ends and 15 ms fades at every splice, so nothing clicks. Each scene starts 0.5 s before its first word and holds 1 s plus a short visual hold after its last; the gap between scenes is about 3 s, longer on the title card (Scene 1) and the end card (Scene 16).

---

## Scene 1 — The spark

> AI agents are AIs that write files, run code and use tools on their own. They now write more code than people can review, so we need AI reviewers we can trust. This is WinScope, a Windows app built by AI agents during a pilot run. Over four review rounds, fresh AI reviewers found 97 problems the authors had missed, and one was hiding in code the AI had already checked itself. It was a single pilot, so it could just be how one particular AI behaves. But it raised a bigger question: what happens when a whole group of reviewers checks the work?

*On screen:* WinScope title and the 97 badge ("problems the authors missed", caption "over 4 review rounds") → tag "a single run · could be one AI's behaviour" → title card "Evolving Review Councils".

## Scene 2 — The big question

> A council is a group of independent reviewers who never wrote the code, each with a brief saying what to focus on: security holes, the logic, whether the app makes sense for the user, or private data leaking. Does a council catch more than one reviewer, behave differently, or try to cheat? These are open questions, and timely ones: a 2026 study suggests teams of small AI models that debate may just be an expensive way of asking one AI several times. We want to know if that holds for independent code review, or if fresh eyes and roles add something real. These boil down to two questions. Question one: do councils of AI agents actually beat one agent, and how big should they be? Question two: if they do, can they evolve to get better?

*On screen:* four role cards with briefs → "1 reviewer vs a council" and the questions → citation card *"Beyond Symmetric Agents" · Ferreira et al., 2026 (preprint)*: "small AI models debating = asking one AI several times?" → roadmap "Question 1 · Do councils beat one agent? How big?" / "Question 2 · Can they evolve to get better?"

## Scene 3 — A reviewer who didn't write the code

> Start with question one, and the flaw from that pilot. A coordinator wrote the shared code first and reviewed it itself. Then four builders worked in parallel, one folder each. Their tests passed. Then an independent reviewer checked how the parts fitted together. It found that when WinScope ran with full administrator powers, it saved files in a folder the everyday, non-admin user could change. That's a back door to those powers. It sat in shared code that no builder owned. A reviewer that had never seen the code caught it. Across the pilot, the 97 problems built up over four review rounds, with fixes going in between, and each later round still found new ones. That's what review found in one pilot, not proof that councils work. Why would the author miss it? Here's an idea, not a result: an author reads what it meant to write. A reviewer who didn't write the code only sees what's really there. Related research finds AIs often struggle to correct their own reasoning without outside feedback. But do you need a council for that? Three objections come up.

*On screen:* "Question 1" marker. Build timeline → ownership table → finding card → 97 bar in four segments (48 · 10 · 25 · 14) with "fixes" markers between them and the caption "each round checked a newer version" → "IDEA, NOT A RESULT" card → citation *"Large Language Models Cannot Self-Correct Reasoning Yet" · Huang et al., 2023*.

## Scene 4 — Simpler fixes?

> Why not just give one reviewer a better, broader brief? We test that head-to-head: one strong reviewer against a council, at the same cost. If the single reviewer matches it, the calculator at the end will say so. Why not just rerun one reviewer? That's what the 2026 study suggests. Small models debated test questions. Simply asking one model several times and going with its most common answer did as well, at a fraction of the cost. And giving agents role labels made them worse. But that's a different setup. Their agents debated and swayed each other, and their role labels sat inside a debate, not with specialists working alone from real task briefs. Ours review independently, where the code is actually run, and the goal is finding different problems. So we don't assume councils win. We test it at equal cost: the same model rerun, councils of generalists who all share one broad brief, councils of specialists with narrow briefs, mixes of both, and a mix of AI models. Evolution then shows whether specialising earns its place.

*On screen:* one card per objection, each replacing the last: (1) broad brief vs narrow briefs, "same cost". (2) the study's finding with its citation → two columns, "Their study" (debate · test questions · small models · role labels) vs "Our test" (independent review · real code, actually run · find different problems · top models · real task briefs) → grid of what we test, "equal cost": same model rerun · generalists (one broad brief) · specialists (narrow briefs) · a mix · mixed AI models.

## Scene 5 — Different models, and marking your own homework

> Before the third objection, here's our core hypothesis. Three copies of one strong model probably share the same blind spots, so they mostly repeat each other. Different strong models might cover each other's blind spots, and beat both one model and its copies. But debate studies, including that one, found debate doesn't reliably beat simply rerunning one model. As we saw, debate isn't independent review, which is why we test this rather than assume it. Is it the mix that helps, or just one stronger model? So we also run each model alone, on the same budget. Diverse councils may cost more, so if they win, the calculator could weigh that against risk, keeping them for high-risk code. Now, the third objection: why not just use a smarter model? AI checking its own work is marking its own homework. Like the coordinator in the pilot, it knows what it meant, and may give itself the benefit of the doubt. A better model is still marking its own homework. Related research finds models can recognise their own writing and rate it higher, which motivates the idea. So our second hypothesis, for review at least, is that a reviewer who didn't write the code beats a smarter model checking itself, and we test that at the same cost. And if a council does win, the next question is size.

*On screen:* "Question 1" marker. Slide 1, HYPOTHESIS tag: three cards in narration order, "Three copies" (one model ×3 · same blind spots; *Yang et al., 2026*) → "Three different models" (accent; e.g. Opus 5.5 · an older Opus · Fable 5.1, or across companies) → "Each model alone, same cost" (perspective vs raw quality). Under the debate sentence: *Ferreira et al., 2026* and *"Should We Be Going MAD?" · Smit et al., ICML 2024*. Slide 2: "may cost more → if it wins, kept for high-risk code". Slide 3 (hard break), "Objection 3": **Marking its own homework**, one AI as both writer and marker giving itself a tick; "a better model is still marking its own homework"; *related research: Panickssery et al., NeurIPS 2024*. Then "a reviewer who didn't write the code vs a smarter model checking itself · same cost", HYPOTHESIS.

## Scene 6 — More isn't free

> The obvious way to improve a council is to add reviewers. But every reviewer costs tokens, and studies of multi-agent systems find that adding agents often hits a ceiling. Tokens are what you pay for, so a cheaper council that's just as good is a real win. Before this video went live, three AI reviewers with different briefs audited this project's public repos. Sixteen of their seventeen findings were caught by only one reviewer. So this experiment asks how many reviewers a given kind of task is worth. We'll follow one small app throughout: a command-line file renamer.

*On screen:* "Question 1" marker. Chart, caption *Kim et al., "Towards a science of scaling agent systems", Google Research, 2025, revised 2026 (260 setups)* → real audit grid, "16 of 17 caught by only one reviewer" → question → rename-cli.

## Scene 7 — Size depends on the task

> Across council sizes, the optimum is where one more reviewer costs more than it adds. The optimum probably isn't one number, so the same sweep runs on tasks of different complexity. Human code review offers a hint: in a classic 1990s study at a real software company, teams of two reviewers found defects as well as teams of four, though one reviewer alone did worse. So we start small and let the results decide, and the calculator will say if a small council is enough. So how do we find the best council for each task? That's question two.

*On screen:* "Question 1" marker. Size bars (illustrative, no numbers implied) with an optimum marker → three tiers (basic app · scientific app · system-level tool) with "?" in place of numbers → "2 reviewers found as many defects as 4 · 1 alone found fewer", citation *Porter et al., IEEE TSE 1997* → "start small · let results decide".

## Scene 8 — How the council evolves

> Councils evolve in generations, and the scores here are illustrative. Each generation is one round: a few council variants review the app's code, an author agent fixes what they find, and the best one carries forward with small changes. One thing that changes is each reviewer's brief. A brief isn't just a label like "you're a security expert". It's real instructions: what to check, and how to show a problem is real. Labels alone don't reliably help, research suggests, so we also test briefs against no briefs. A judge runs fixed tests. If the score rises, the change is kept. If not, it's discarded. A second set of tests is never shown to the agents. The winner scores best on those held-out tests, which isn't always the last version. And to show evolution really helps, we compare an evolving council against one that gets the same number of review rounds and the same spend, without evolving. Otherwise, "it got better" might just mean "it spent more".

*On screen:* control card after the held-out panel: "evolving council" vs "same rounds, same spend, no evolution". "Question 2" marker. Generation tree → brief card: crossed-out label "You're a security expert" beside real instructions, "kept only if the score rises", citation *Zheng et al., 2024* → held-out tests on their own slide ("a second, secret set of tests").

## Scene 9 — Keeping it fair

> For a fair comparison, only the council is allowed to change. Every run starts in a fresh chat, with no memory of earlier runs and no hint of the hoped-for result. The judge scores outputs blind, without knowing which size or model produced them. The hard tests decide each round, not votes, because AI judges tend to favour their own style. Here's how we'll measure it. We plant known bugs in the test apps, kept secret, and score each review on what it catches, what it falsely flags, and how serious its catches are, so an average can't hide a missed critical flaw. Cost is counted in money. Catching bugs is the result, and cost is what it took, so counting bugs alone would just reward whoever spends the most. That's why we compare councils at every budget, from cheap to expensive. Every council's reports are combined by the same independent step. The judge, and that step, come from a different family of AI models than the council. Each setup runs several times, so only gains that hold count. And the plan is published before the first run, so we can't move the goalposts. And everything runs in a sandbox. The sandbox stops agents touching anything real. The aim: a council can't improve by memorising tests or gaming the judge, only by reviewing better.

*On screen:* "Question 2" marker. Rule cards: Fresh chat, Blind judging, Hard tests not AI votes (citation *Panickssery et al., NeurIPS 2024*), then a measuring card on its own: "planted bugs → caught / missed / false alarm", with "serious" and "critical" scored separately; then a strip: "cost in money · same merger · outside judge family · several runs · plan published first"; then Sandbox, Fixed held-out tests → "Review better" statement.

## Scene 10 — Cheating, collusion and failure modes

> Agents rewarded for winning may still try to game the score. The experiment hasn't run yet, so this is something we guard against and test for, not something we've seen. Here's how it could look. A branch jumps from seventy-one to ninety-four. The diff shows why: it didn't fix the bug, it skipped the test. On the held-out tests, which it never saw, it scores sixty-five. So the judge also checks the tests themselves: any change that weakens, skips or edits a test is flagged, and this branch is thrown out. Collusion is harder to see, so the design removes the channels. Agents never message each other directly. Everything goes through the orchestrator and is logged. Messages are paraphrased, which breaks signals hidden in exact wording. The judge sees code and test results, never the arguments. And the logs are audited for odd patterns. Some failures are quieter, so each gets its own check. Reviewers that approve everything are caught by counting the real issues they raise. Token and time caps are enforced by the orchestrator. Instructions hidden in the files under review are treated as text to check, never as orders.

*On screen:* "Question 2" marker, "GUARDED AGAINST · NOT YET SEEN" tag. Three slides: gaming (on-screen labels "branch = one council version", "diff = the code change"), collusion ("orchestrator = the central controller"), quieter failures grid.

## Scene 11 — The two questions meet

> Now the two questions meet. Evolution, together with the size tests, is how we search for the best council: its size, its roles and its mix of models.

*On screen:* Question 1 and Question 2 cards slide together into "The best council: size · roles · model mix".

## Scene 12 — Side experiments

> Two side experiments use the same setup. In a knockout tournament, reviewers are eliminated round by round until one remains. Generalists and specialists enter the same bracket, which hints at whether specialising pays. The two finalists then play Split or Steal for a pot of points. They talk, then each secretly chooses. If both split, each gets half. If one steals, the stealer gets it all. If both steal, neither gets anything. It measures cooperation and trust. Finally, the tournament winner faces a team of different models. It's only a side experiment: a knockout doesn't keep budgets equal, so the fair, same-budget tests from question one give the real answer.

*On screen:* bracket with generalist and specialist chips → Split or Steal → "winner vs a team of different models" with a "SIDE EXPERIMENT · cost not matched" tag. The whole scene carries a "SIDE EXPERIMENTS" label.

## Scene 13 — What a winning council looks like

> Back to the main experiment: here's an example of a winning council. Four reviewers with different roles check the same work independently. Their findings are merged, the author fixes them, an independent reviewer verifies the fixes, and a judge scores the results blind. Someone has to merge those reports, and that step decides what the author finally sees. A bad merger can drop a reviewer's best catch, let a false alarm through, or bring blind spots of its own. So we compare a dedicated merger, keeping everything, and keeping only findings two reviewers agree on. For fair comparisons, every council uses the same fixed, independent merger. The judge itself, and a merger that evolves with the council, are tested separately. A council wins by scoring best on the held-out tests: the most real problems found, including the most serious, with the fewest false alarms for the tokens used. In practice, that should mean more secure, more reliable code.

*On screen:* EXAMPLE council flow → the flow clears to four reviewer cards feeding one "Merger" box with an arrow to "What the author sees"; options listed beside it: dedicated merger · keep everything · keep only agreed findings; set apart, "tested separately": the judge itself · an evolving merger; a tag "same fixed merger for every council" → "How a council wins" → "More secure, more reliable code".

## Scene 14 — The calculator

> The winning setups will then feed a small calculator, so anyone can set up a council for their own task. It estimates the token cost, council size and model mix, then writes a prompt you can paste into any AI: how many reviewers, which models and effort levels, and what hard caps to apply.

*On screen:* Template selector → token cost, council size and model mix → the prompt being written.

## Scene 15 — Beyond code: accents

> The same method could reach beyond code. Take speech recognition and a Welsh accent. If AI hears some accents worse than others, whole regions can quietly get worse answers. The council can't retrain the speech model, so it evolves the step after it, the part that corrects and interprets what was heard. Does a council correct speech differently from one model? A follow-up experiment would test that.

*On screen:* waveform and misheard transcript → pipeline (speech model fixed → correction step evolves → answer) → "one model vs a council?" The whole scene carries a "FUTURE WORK" label.

## Scene 16 — What's next

> We also test simpler alternatives: traditional code-checking tools like linters and security scanners, letting one AI think for longer, hand-tuned briefs, and reviewing in stages. And we check three more things: whether fixes actually land, whether councils only pay off on hard or high-risk code, which the calculator takes into account, and what happens if reviewers see each other's findings. These will be discussed more in our research. Back to the pilot. It was informal, but its numbers are real. Its limits: one app, and the pilot ran only once. It was built and tested on Linux, never on Windows itself. Its reviewers kept some saved memory, so they weren't fully fresh. And the council size never changed, which the formal experiment will vary. The GitHub repo is public now, and the write-up and raw run logs will be published after the runs. Follow the channel for the results, and find everything at the GitHub repo and ablationlab.org.

*On screen:* four alternatives as single labels → a second short row: "fixes actually land?" · "only worth it on hard code?" · "reviewers see each other's findings?" → "Pilot limits" list ("one app; the pilot ran only once" · Linux only · saved memory · fixed council size) → end card and call to action.
