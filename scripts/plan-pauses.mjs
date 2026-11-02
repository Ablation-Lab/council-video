// Plans where to lengthen pauses, for natural pacing between sentences.
// Reads the word timings of an unpadded build (src/voiceover.json) and writes
// src/pauses.json: for each scene, points in the assembled clip where
// scripts/normalize-voiceover.mjs inserts silence. Only pauses after a full
// stop (or ? !) and after a colon are lengthened; commas stay as recorded.
// A point is only planned where the aligner matched the boundary to a real
// pause, so the inserted silence always lands inside silence.
//
// Usage: node scripts/plan-pauses.mjs   (run by `npm run voiceover`)
import fs from 'node:fs';

const SENTENCE = {min: 0.5, extra: 0.08};
const COLON = {min: 0.35, extra: 0.05};
// A boundary shorter than this wasn't matched to a detected pause.
const MATCHED_S = 0.12;

const voiceover = JSON.parse(fs.readFileSync('src/voiceover.json', 'utf8'));
const plan = {};
let count = 0;
for (const [id, clip] of Object.entries(voiceover)) {
  const w = clip.words;
  plan[id] = [];
  for (let i = 0; i < w.length - 1; i++) {
    const rule = /[.!?]$/.test(w[i].text) ? SENTENCE : /:$/.test(w[i].text) ? COLON : null;
    const gap = (w[i + 1].startMs - w[i].endMs) / 1000;
    if (!rule || gap < MATCHED_S) continue;
    const add = Math.max(rule.min, gap + rule.extra) - gap;
    plan[id].push({at: Number(((w[i].endMs + w[i + 1].startMs) / 2000).toFixed(3)), add: Number(add.toFixed(3))});
    count++;
  }
}
fs.writeFileSync('src/pauses.json', JSON.stringify(plan) + '\n');
console.log(`planned ${count} lengthened pauses; wrote src/pauses.json`);
