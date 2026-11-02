// Aligns each voiceover clip (public/audio/sceneNN.mp3) to its narration in
// script.md and writes word-level timings to src/voiceover.json. Scene
// durations and animation cues are then taken from the real recording.
//
// How: ffmpeg's silencedetect finds the pauses; a monotonic alignment (DP)
// pairs pauses with punctuation in the script (full stops are expected to
// pause, commas often do); those pairs become anchors, and the words between
// anchors are spread by spoken length.
//
// Usage: node scripts/align-voiceover.mjs   (needs a full ffmpeg on PATH)
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';

const SILENCE_DB = -38;
const SILENCE_MIN_S = 0.18;

const ffmpegStderr = (args) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], {encoding: 'utf8'}).stderr;
const duration = (file) =>
  Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'}).stdout);

const silences = (file) => {
  const err = ffmpegStderr(['-i', file, '-af', `silencedetect=noise=${SILENCE_DB}dB:d=${SILENCE_MIN_S}`, '-f', 'null', '-']);
  const starts = [...err.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...err.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  return starts.map((s, i) => ({start: s, end: ends[i] ?? duration(file)}));
};

// Narration per scene from script.md: the "> " lines under "## Scene N".
const narration = {};
let current = null;
for (const line of fs.readFileSync('script.md', 'utf8').split(/\r?\n/)) {
  const h = line.match(/^## Scene (\d+)\b/);
  if (h) current = `s${h[1].padStart(2, '0')}`;
  else if (current && line.startsWith('> ')) narration[current] = [narration[current], line.slice(2).trim()].filter(Boolean).join(' ');
}

// Rough spoken length of a word: letters, with numbers read out in full.
const weight = (w) => {
  const core = w.replace(/[^A-Za-z0-9.]/g, '');
  const digits = (core.match(/\d/g) ?? []).length;
  return (core.length - digits) + digits * 4 + 2;
};

const align = (text, file) => {
  const words = text.split(/\s+/);
  const total = duration(file);
  const pauses = silences(file);
  // Speech bounds: drop a leading or trailing silence.
  let speechStart = 0;
  let speechEnd = total;
  if (pauses.length && pauses[0].start < 0.05) speechStart = pauses.shift().end;
  if (pauses.length && pauses[pauses.length - 1].end > total - 0.05) speechEnd = pauses.pop().start;

  // Candidate pause points: after any word ending in punctuation.
  const cum = [];
  let acc = 0;
  for (const w of words) cum.push((acc += weight(w)));
  const pauseTime = pauses.reduce((s, p) => s + (p.end - p.start), 0);
  const rate = (speechEnd - speechStart - pauseTime) / acc;
  const bounds = words
    .map((w, i) => ({i, strong: /[.!?:]$/.test(w), weak: /[,;)]$/.test(w)}))
    .filter((b) => (b.strong || b.weak) && b.i < words.length - 1);

  // DP over (boundary, pause): match, skip a boundary, or skip a pause.
  // Expected time of boundary b assuming every earlier matched pause is spent.
  const B = bounds.length;
  const P = pauses.length;
  const INF = 1e9;
  const cost = Array.from({length: B + 1}, () => new Array(P + 1).fill(INF));
  const prev = Array.from({length: B + 1}, () => new Array(P + 1).fill(null));
  cost[0][0] = 0;
  const pausedBefore = (p) => pauses.slice(0, p).reduce((s, x) => s + (x.end - x.start), 0);
  for (let b = 0; b <= B; b++) {
    for (let p = 0; p <= P; p++) {
      const c = cost[b][p];
      if (c >= INF) continue;
      if (b < B) {
        // Skip boundary: cheap for commas, dearer for full stops.
        const skip = c + (bounds[b].strong ? 1.2 : 0.15);
        if (skip < cost[b + 1][p]) (cost[b + 1][p] = skip), (prev[b + 1][p] = [b, p, 'skipB']);
      }
      if (p < P) {
        // Skip pause: penalise in proportion to its length.
        const skip = c + 3 * (pauses[p].end - pauses[p].start);
        if (skip < cost[b][p + 1]) (cost[b][p + 1] = skip), (prev[b][p + 1] = [b, p, 'skipP']);
      }
      if (b < B && p < P) {
        const expected = speechStart + cum[bounds[b].i] * rate + pausedBefore(p);
        const m = c + Math.abs(pauses[p].start - expected) * 1.5 - (bounds[b].strong ? 0.3 : 0);
        if (m < cost[b + 1][p + 1]) (cost[b + 1][p + 1] = m), (prev[b + 1][p + 1] = [b, p, 'match']);
      }
    }
  }
  // Backtrack to the matched (word index, pause) anchors.
  const anchors = [];
  for (let b = B, p = P; prev[b][p]; ) {
    const [pb, pp, kind] = prev[b][p];
    if (kind === 'match') anchors.unshift({i: bounds[pb].i, pause: pauses[pp]});
    [b, p] = [pb, pp];
  }

  // Spread words between anchors by weight.
  const out = [];
  let segStartWord = 0;
  let segStartTime = speechStart;
  for (const a of [...anchors, {i: words.length - 1, pause: {start: speechEnd, end: speechEnd}}]) {
    const seg = words.slice(segStartWord, a.i + 1);
    const segWeight = seg.reduce((s, w) => s + weight(w), 0);
    let t = segStartTime;
    for (const w of seg) {
      const d = ((a.pause.start - segStartTime) * weight(w)) / segWeight;
      out.push({text: w, startMs: Math.round(t * 1000), endMs: Math.round((t + d) * 1000)});
      t += d;
    }
    segStartWord = a.i + 1;
    segStartTime = a.pause.end;
  }
  return {seconds: Number(total.toFixed(3)), anchors: anchors.length, pauses: P, words: out};
};

const result = {};
for (const id of Object.keys(narration).sort()) {
  const file = `audio/scene${id.slice(1)}.mp3`;
  const a = align(narration[id], `public/${file}`);
  result[id] = {file, seconds: a.seconds, words: a.words};
  console.log(`${id}: ${a.seconds.toFixed(1)}s, ${a.words.length} words, ${a.anchors} of ${a.pauses} pauses anchored`);
}
fs.writeFileSync('src/voiceover.json', JSON.stringify(result) + '\n');
console.log('wrote src/voiceover.json');
