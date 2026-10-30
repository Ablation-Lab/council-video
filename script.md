# Evolving Review Councils — Explainer Script (v2, approved)

Narration: ElevenLabs recordings (5:56 of speech), normalised to -14 LUFS. Scene lengths and cues come from the recordings (src/voiceover.json). Total runtime 6:25. 1920×1080, 30 fps.

## Global design

- **Palette:** background `#0B0D10`, primary text `#E6E8EB`, secondary text `#8A9099`, rules/lines `#2A2F36`. **One accent: amber `#F2A541`**, used only for whatever matters most in the shot (the finding, the kept node, the winner). Discarded things go dashed grey and drop to 30% opacity.
- **Type:** Inter for headings (72–96 px) and body (minimum 40 px). JetBrains Mono for code, logs and terminals (minimum 32 px). Nothing on screen smaller than 28 px.
- **Motion:** slow, eased (cubic in-out, or heavily damped springs, no bounce). Most moves take 20–30 frames. Text holds on screen at least 2 s after it lands. Typing effects run at ~30 characters/s.
- **Recurring diagram, the Generation Tree:** nodes are rounded rectangles showing `G2 · 71`. Edges draw left to right. Kept = solid accent outline. Discarded = dashed grey and faded. It starts as a single node in Scene 1 and grows or changes in every scene after that.
- **Example app:** `rename-cli`, a small command-line file renamer (small app #1 in the plan). Its scores are **illustrative**, and a small caption says so every time they appear. The only real numbers in the video come from the WinScope pilot.
- **Chapter tag:** bottom-left, small caps, e.g. `03 / EVOLUTION`.
- **Audio:** one ElevenLabs narration track per scene. No music cues. Room for a quiet, flat bed later if wanted.

---

## Scene 1 — The finding (47 s)

**Narration**
> This is WinScope, a Windows app built by AI agents during a pilot run. A coordinator wrote the shared code first and reviewed it itself. Then four builders worked in parallel, one folder each. Their tests passed.
> Then a fresh reviewer ran an integration audit. It found that when WinScope ran as admin, it wrote settings and logs into the user's own AppData folder. An admin process that trusts a folder the user can write to is a flaw that could hand an attacker admin rights. It sat in shared code that no builder owned.
> A reviewer that had never seen the code caught it. This project builds on that: reviewers that improve over generations.

**On screen**
1. A thin timeline draws across the top: `coordinator writes shared code → self-review ✓ → 4 builders in parallel → builder tests`.
2. An ownership map below it shows five folder tiles: `builder-1` … `builder-4`, each tagged with its owner, and `shared/` tagged `owner: none`.
3. A terminal panel types out the builder test runs, each ending in `PASS`.
4. A reviewer card slides in from the right: `Reviewer · fresh session · integration audit`.
5. Audit log lines type in. The last one is highlighted in accent:
   ```
   [integration-audit] process elevated: yes
   [integration-audit] writes: settings, logs
   [integration-audit] target: %APPDATA%  (writable by: standard user)
   ```
6. A finding card lands beside it: `FINDING · SERIOUS`, titled `Admin process trusts a user-writable folder`, then `Could hand an attacker admin rights` and `location: shared code (no owner)`. At the same moment, the `shared/` tile in the ownership map takes the accent outline.
7. Everything scales down and settles into one small node on the left. That node is the first node of the Generation Tree. Title fades in: **Evolving Review Councils**.

**Animation:** the timeline draws at a steady pace. Log lines type at ~30 characters/s. The highlight bar sweeps across the last line over 15 frames. The finding card rises 12 px as it fades in. Final collapse takes about 1.5 s with ease-in-out.

---

## Scene 2 — More isn't free (27 s)

**Narration**
> The obvious fix is more reviewers. But every reviewer costs tokens, and studies of multi-agent systems find that adding agents often hits a ceiling. Identical reviewers mostly repeat each other. So this experiment asks how many reviewers a given kind of task is worth. We'll follow one small app throughout: a command-line file renamer.

**On screen**
1. A chart. The x-axis is reviewers (1–20). A quality curve rises and then flattens. A cost line (grey) climbs steadily. The gap between them after the knee is shaded.
2. Caption: *"shape reported in published research, not this experiment's data"*. Source tag: *Google Research, "Towards a science of scaling agent systems" (180 setups)*.
3. The chart slides out. The root node becomes `G0 · rename-cli`, with three reviewer chips under it: `bugs`, `security`, `risky changes`.

**Animation:** the curve draws over 1.5 s, then the cost line follows. The shading fades in last.

---

## Scene 3 — How the council evolves (37 s)

**Narration**
> Each generation starts from the best version so far and tries to improve it. A judge runs fixed tests. If the score rises, the change is kept. If not, it's discarded.
> A second set of tests is never shown to the agents.
> The run stops when two generations in a row improve by less than about two percent, or a cap is hit. The winner scores best on those held-out tests, which isn't always the last version.
> Across council sizes, the optimum is where one more reviewer costs more than it adds.

**On screen (tree grows, illustrative scores)**
1. `G0 · 62` branches into `G1a · 68` (kept, accent) and `G1b · 60` (discarded, dashed, fades). A small `judge: 60 < 62 → discard` label flashes beside G1b.
2. `G2 · 71` grows from G1a.
3. A locked panel appears at the right, `HELD-OUT TESTS` with a lock icon and `never shown to agents`.
4. `G3 · 72.1 (+1.5%)` and then `G4 · 72.9 (+1.1%)` grow. A bracket spans them: `2 generations < 2% → stop`.
5. Held-out scores fade in under each kept node: G2 `70`, G3 `71`, G4 `68`. A crown ring moves to **G3**, and G4 dims slightly. Label: `winner = best held-out score`.
6. The tree slides up and shrinks. Below it, a size sweep shows council sizes 2, 4, 6, 8, 10, each with a quality bar and a token bar. A vertical accent marker reads `optimum: next reviewer costs more than it adds`.

**Animation:** each node fades in and rises with its edge drawing first. Discarded nodes desaturate over 20 frames. The crown ring travels along the tree.

---

## Scene 4 — Size depends on the task (27 s)

**Narration**
> The optimum probably isn't one number, so the same sweep runs on tasks of different complexity. A basic app like the renamer might need around six reviewers, a scientific app around twenty, frontier research far more. These are guesses to test, not results. The aim is a rough scale of review effort per tier, to set the starting council size for a new task.

**On screen**
1. The rename-cli tree shrinks into the first of three columns: `BASIC APP`, `SCIENTIFIC APP`, `FRONTIER RESEARCH`.
2. Each column draws a quality-vs-size curve. The knee sits at ~6, at ~20, and off the right edge (shown with an arrow).
3. Reviewer chips count up under each knee: 6, then 20, then a `far more` overflow.
4. A tag `HYPOTHESIS` stays pinned top-right for the whole scene.

---

## Scene 5 — Keeping it fair (30 s)

**Narration**
> Only the council is allowed to change. Every run starts in a fresh chat, with no memory of earlier runs and no hint of the hoped-for result. The judge scores outputs blind, without knowing which size or model produced them. Every setup gets the same app, the same starting code and the same tests. And everything runs in a sandbox. The sandbox stops agents touching anything real. Fresh chats stop earlier context biasing the results.

**On screen:** four rules attach to the tree one at a time, each with a visible effect.
1. **Fresh chat:** a context panel beside a node empties down to `context: empty`.
2. **Blind judging:** a node label `6 reviewers · Opus` flips to `run #A7`.
3. **Same inputs:** three parallel runs are fed from one input block with the same hash `inputs: 3f9c…` on each.
4. **Sandbox:** a border draws around the whole tree. Outside it, a greyed label reads `real system, drivers, boot settings: unreachable`.

---

## Scene 6 — Cheating, collusion and other failure modes (58 s)

**Narration**
> Agents rewarded for winning may try to game the score. Here's one way it can look. A branch jumps from seventy-one to ninety-four. The diff shows why: it didn't fix the bug, it skipped the test. On the held-out tests, which it never saw, it scores sixty-five. The judge also flags any change that weakens, skips or edits tests, so the branch is thrown out.
> Collusion is harder to see, so the design removes the channels. Agents never message each other directly. Everything goes through the orchestrator and is logged. Messages are paraphrased, which breaks signals hidden in exact wording. The judge sees code and test results, never the arguments. And the logs are audited for odd patterns.
> Some failures are quieter. Each one gets a specific check.

**On screen**
1. A new branch `G3′ · 94` grows from G2, in accent.
2. A diff panel opens with the changed lines highlighted:
   ```
   - def test_rename_collision():
   + @skip("flaky")
   + def test_rename_collision():
   ```
3. Its held-out score `65` drops in. A flag reads `test modified`. A `DISQUALIFIED` outline stamp lands, and the branch fades.
4. Collusion diagram: three reviewer nodes connect only to a central `ORCHESTRATOR`, which has a scrolling log. A `PARAPHRASE` box shows `"LGTM 3-3-1, ship it"` rewritten as `"Reviewer approves the change."`. The judge node's input is labelled `code + test results only`.
5. A 2×3 grid fills in, one cell at a time:
   | Failure | Check |
   |---|---|
   | Rubber-stamping | count real issues raised per reviewer |
   | Sandbagging | realistic prompts, compared with normal runs |
   | Pushing past caps | caps enforced by the orchestrator, not the agents |
   | Prompt injection | reviewed files treated as data, never instructions |
   | Noisy results | repeat key runs; count only gains that hold |
   | Getting stuck | stop a generation that repeats without progress |

**Animation:** the grid cells reveal at about 1 per 1.2 s while the narration holds still. The six failure names are not read aloud. They're on screen long enough to read.

---

## Scene 7 — What the WinScope pilot showed (34 s)

**Narration**
> The WinScope pilot was informal, but its numbers are real. About half its 3.7 million subagent tokens went on review and verification. Those rounds found 97 problems the builders' tests had passed, and most of the serious bugs came from agents that hadn't written the code. Verification after fixes never came back clean on its first pass.
> The limits: one app, one run, Linux only, reviewers with saved memory, and a fixed council size. The formal experiment varies that.

**On screen**
Source: "How the agents built and reviewed WinScope", revision 20 (all 11 rounds).

1. A quiet context strip under the title (not narrated): `~13,000 lines in a 33-min parallel build · 1,051 tests passing`.
2. A token bar for 3.7M, labelled `subagent tokens, 10 subagent rounds`, splits into `review + verification ≈ 1.9M` in accent and `building + fixing ≈ 1.8M` in grey.
3. A large `97` appears, then breaks into a stacked bar: `48 first council` / `10 first verification` / `25 privacy audit` / `14 second verification`. When the narration reaches the verification line, the two verification segments are outlined: `every verification round found more`.
4. A findings log headed `Top findings` shows the two named findings, each tagged `found by a fresh reviewer`: `privilege escalation: admin writes to user AppData` and `Recycle Bin: wrong file affected`, followed by `+ 95 more`.
5. A limits panel lists: one app, one run · Linux only, not yet run on Windows · reviewers inherited saved memory · council size never varied. The last item turns accent: `council size → varied in the experiment`.
6. Caption: *"Token counts are self-reported by agents."*

---

## Scene 8 — Side experiments (45 s)

**Narration**
> Two side experiments use the same setup. In a knockout tournament, reviewers are eliminated round by round until one remains. The hard tests decide each round, not votes, because AI judges tend to favour their own style. The single winner is then compared with a varied team, since earlier research suggests diversity can beat one top reviewer.
> The two finalists then play Split or Steal. They talk, then each secretly chooses. If both split, they share. If one steals, it takes everything. If both steal, neither gets anything. It doesn't affect the review result. It measures cooperation and trust.

**On screen**
1. An 8-reviewer bracket resolves round by round down to 1. Each round is labelled `decided by: hard tests`.
2. A split screen: `1 tournament winner` vs `varied team` (four chips with different model/prompt labels).
3. A 2×2 payoff matrix. Each cell lights as it's narrated: `share / share`, `0 / all`, `all / 0`, `0 / 0`.
4. A footnote: `varied: models · whether agents know the game repeats`.

---

## Scene 9 — Beyond code: accents (38 s)

**Narration**
> The same method could reach beyond code. Take speech recognition and a Welsh accent. The benchmark is real recordings with transcripts checked by a person, scored by word error rate: the share of words the system gets wrong. The council can't retrain the speech model, so it evolves the step after it, the part that corrects and interprets what was heard. Some speakers are held back as unseen tests, so the system learns the accent rather than individual voices. If AI hears some accents worse than others, whole regions can quietly get worse answers.

**On screen**
1. A waveform draws, and its transcript types underneath with the wrong words underlined in accent. Label `WER 18%` (illustrative).
2. A pipeline appears: `speech model (fixed)` → `correction step (evolves)`. The second box takes the accent outline.
3. The Generation Tree returns with WER in place of score, and the label `lower is better`: `18% → 15% → 13%`.
4. A grid of speaker tiles. A few lock and become `held-out speakers`.

---

## Scene 10 — The calculator, and what gets published (42 s)

**Narration**
> Once the runs are finished, their results feed a small calculator. You pick a task template, such as a basic app or a system-level tool. It estimates the token cost, council size and model mix, then writes a prompt you can paste into any AI: how many reviewers, which models and effort levels, and what hard caps to apply. Each new run improves the estimates. Everything is public: the GitHub repo, a write-up, and the raw run logs. WinScope showed a council catches what builders miss. The open question is how many reviewers you actually need. That's the next experiment.

**On screen**
1. A selector reads `Task template: Basic app ▾`.
2. A prompt block types out with accent-highlighted slots:
   ```
   Spawn {N} reviewers: bugs, security, risky changes.
   Reviewers: {model}, {effort}. Judge: {model}, high.
   Hard caps: {agents} agents · {generations} generations · {tokens} tokens.
   ```
   Caption: *"slots filled from real run results"*.
3. A small loop arrow runs from `run logs` back into the calculator.
4. End card: three items, `GitHub repo` · `write-up` · `raw logs`, plus the repo URL `github.com/ablation-lab/evolving-review-councils`. The tree from Scene 3 sits faintly behind.
5. Closing: the faint tree fades out and the deliverables dim slightly. Three lines build above the title, one per sentence. The last line, `That's the next experiment.`, is in accent. Its tree node is `G0`, the same single node that closed Scene 1. The film ends 2.5 s after the last word: 1.5 s on the end card, then a 1 s fade.
