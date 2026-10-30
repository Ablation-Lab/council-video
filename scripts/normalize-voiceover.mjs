// Loudness-normalises the ElevenLabs clips (sceneNN.mp3 in the project root)
// to TARGET_LUFS, writing copies to public/audio/sceneNN.mp3. Clips listed in
// EDITS are re-spliced first (pauses tightened, a phrase re-paced). The
// originals are never modified.
//
// Usage: node scripts/normalize-voiceover.mjs   (needs a full ffmpeg on PATH)
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Per-clip splices, in seconds of the original recording. Each clip is rebuilt
 * from these pieces in order; cut points sit inside pauses.
 *  tempo   < 1 slows a piece (Rubber Band, pitch unchanged)
 *  gainDb  level change for the piece
 *  fadeInS softer onset for the piece
 */
const EDITS = {
  // "…clean on its first pass. The limits: one app, one run…"
  // "The limits:" came in rushed and at full level between two long gaps.
  // Shorten the gap before it (0.69 → ~0.48 s), slow and soften the phrase,
  // and shorten the gap after the colon (0.45 → ~0.27 s).
  'scene07.mp3': [
    {from: 0, to: 23.3},
    {from: 23.5, to: 24.2, tempo: 0.88, gainDb: -1.5, fadeInS: 0.05},
    {from: 24.38},
  ],
};

/** Applies a clip's EDITS into a temporary WAV and returns its path. */
const applyEdits = (src, pieces) => {
  const filters = pieces.map((p, i) => {
    const chain = [`atrim=start=${p.from}${p.to === undefined ? '' : `:end=${p.to}`}`, 'asetpts=PTS-STARTPTS'];
    if (p.tempo) chain.push(`rubberband=tempo=${p.tempo}`);
    if (p.gainDb) chain.push(`volume=${p.gainDb}dB`);
    // Tiny fades at every splice so cuts never click.
    chain.push(`afade=t=in:d=${p.fadeInS ?? 0.01}`, 'areverse', 'afade=t=in:d=0.01', 'areverse');
    return `[0:a]${chain.join(',')}[p${i}]`;
  });
  const concat = `${pieces.map((_, i) => `[p${i}]`).join('')}concat=n=${pieces.length}:v=0:a=1[out]`;
  const out = path.join(os.tmpdir(), `edited-${path.basename(src, '.mp3')}.wav`);
  ffmpeg(['-y', '-i', src, '-filter_complex', `${filters.join(';')};${concat}`, '-map', '[out]', '-c:a', 'pcm_s16le', out]);
  return out;
};

const TARGET_LUFS = -14;
const TRUE_PEAK = -1.5;

/** Runs ffmpeg and returns stderr, where it prints filter reports. */
const ffmpeg = (args) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], {encoding: 'utf8'});
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
  return r.stderr;
};

const verify = (file) => {
  const summary = ffmpeg(['-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-']).split('Summary:').pop();
  return {
    lufs: Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)[1]),
    peak: Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)[1]),
  };
};

const outDir = path.resolve('public/audio');
fs.mkdirSync(outDir, {recursive: true});

const sources = fs
  .readdirSync('.')
  .filter((f) => /^scene\d{2}\.mp3$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
if (sources.length === 0) throw new Error('No sceneNN.mp3 files in the project root.');

// Speech peaks sit ~14 dB above its loudness, so reaching TARGET_LUFS under a
// TRUE_PEAK ceiling needs a light limiter. Apply static gain, then a fast
// limiter set a little under the ceiling to leave room for MP3 overshoot.
const LIMIT_DB = TRUE_PEAK - 1;
const render = (src, out, gainDb) =>
  ffmpeg([
    '-y', '-i', src,
    '-af', `volume=${gainDb.toFixed(2)}dB,alimiter=limit=${Math.pow(10, LIMIT_DB / 20).toFixed(4)}:attack=2:release=60:level=disabled`,
    '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '192k',
    out,
  ]);

console.log('clip          before LUFS  after LUFS  after peak');
for (const original of sources) {
  const out = path.join(outDir, original.toLowerCase());
  const edits = EDITS[original.toLowerCase()];
  const src = edits ? applyEdits(original, edits) : original;
  const before = verify(src).lufs;
  let gain = TARGET_LUFS - before;
  render(src, out, gain);
  // Limiting shaves some loudness, more as gain rises; converge in a few passes.
  let after = verify(out);
  for (let pass = 0; pass < 5 && Math.abs(after.lufs - TARGET_LUFS) > 0.2; pass++) {
    gain += TARGET_LUFS - after.lufs;
    render(src, out, gain);
    after = verify(out);
  }
  console.log(
    `${(original + (edits ? "*" : "")).padEnd(13)} ${before.toFixed(1).padStart(9)}  ${after.lufs.toFixed(1).padStart(9)}  ${after.peak.toFixed(1).padStart(6)} dBFS`,
  );
}
