// Loudness-normalises the ElevenLabs clips (sceneNN.mp3 in the project root)
// to TARGET_LUFS with ffmpeg's two-pass loudnorm, writing copies to
// public/audio/sceneNN.mp3. The originals are never modified.
//
// Usage: node scripts/normalize-voiceover.mjs   (needs a full ffmpeg on PATH)
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

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
for (const src of sources) {
  const out = path.join(outDir, src.toLowerCase());
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
    `${src.padEnd(13)} ${before.toFixed(1).padStart(9)}  ${after.lufs.toFixed(1).padStart(9)}  ${after.peak.toFixed(1).padStart(6)} dBFS`,
  );
}
