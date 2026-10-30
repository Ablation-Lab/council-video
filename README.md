# Evolving Review Councils — explainer video

An animated explainer, built with [Remotion](https://www.remotion.dev/), for the experiment described in `plan.md`. The full script is in `script.md`.

## Status

| Scene | Component | State |
|---|---|---|
| 01 The finding | `src/scenes/Scene01Finding.tsx` | built |
| 02 More isn't free | `src/scenes/Scene02MoreIsntFree.tsx` | built |
| 03 How the council evolves | `src/scenes/Scene03Evolution.tsx` | built |
| 04 Size depends on the task | `src/scenes/Scene04SizeByTask.tsx` | built |
| 05 Keeping it fair | `src/scenes/Scene05Fairness.tsx` | built |
| 06 Cheating, collusion and failure modes | `src/scenes/Scene06Gaming.tsx` | built |
| 07 What the WinScope pilot showed | `src/scenes/Scene07Pilot.tsx` | built |
| 08 Side experiments | `src/scenes/Scene08SideExperiments.tsx` | built |
| 09 Beyond code: accents | `src/scenes/Scene09Accents.tsx` | built |
| 10 The calculator, and what gets published | `src/scenes/Scene10Calculator.tsx` | built |

## Preview

```
npm install
npm run dev
```

This opens Remotion Studio in your browser. The `Explainer` composition is the full film. `Scene01` to `Scene10` let you preview one scene at a time.

## Project layout

- `src/timing.ts`: scene order, narration text and durations. Each scene's length is calculated from its word count (currently 160 words per minute). `makeCue('s03')('phrase')` returns the frame where a phrase is spoken, and the animations use it, so they stay in sync if the narration changes.
- `src/theme.ts`: colours, fonts and minimum type sizes.
- `src/anim.ts`: easing and fade helpers.
- `src/components/`: the shared scene frame, Generation Tree nodes and edges, and icons.
- `scripts/review-stills.mjs`: renders evenly spaced stills of a composition to `out/stills/` for visual review, e.g. `node scripts/review-stills.mjs Scene03 --count=8`.

## Temporary narration

`npm run narration` regenerates one WAV per scene in `public/audio/`, using Windows' built-in text-to-speech (voice: Microsoft Hazel, rate 2, which comes out at about 160 words per minute). It reads the narration from `script.md`, writes `public/audio/manifest.json`, and prints a table that flags any scene where the narration runs longer than the visuals. `src/components/Narration.tsx` plays each file after the scene's 0.4 s lead-in.

To use a real voiceover later, replace the WAVs in `public/audio/` (same names) and update the `seconds` values in `manifest.json`.
