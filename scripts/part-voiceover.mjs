// Builds the line takes for the two-part film. Every <prefix>-*.mp3 in the
// project root (an ElevenLabs take, gitignored) is loudness-normalised to
// TARGET_LUFS with edge fades and its metadata stripped, then written to
// public/audio/<dir>/. Word timings (faster-whisper) and the quietest cut
// point between each pair of words go to src/<dir>/takes.json, which
// the section's buildSection() uses to play each recorded line and cut a
// line shared by two beats in its pause. The originals are never modified.
//
// Usage: WHISPER_PYTHON=<python with faster-whisper> node scripts/part-voiceover.mjs p1 part1
//        (needs a full ffmpeg on PATH)
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [prefix = 'p1', dir = 'part1'] = process.argv.slice(2);
const TARGET_LUFS = -14;
const TRUE_PEAK = -1.5;
const LIMIT_DB = TRUE_PEAK - 1;
const EDGE_FADE_S = 0.03;

const ffmpeg = (args) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], {encoding: 'utf8'});
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
  return r.stderr;
};
const duration = (file) =>
  Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'}).stdout);
const loudness = (file) => {
  const summary = ffmpeg(['-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-']).split('Summary:').pop();
  return {lufs: Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)[1]), peak: Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)[1])};
};
// Level of each 20 ms window (dB RMS), for finding the quietest cut point in a pause.
const WINDOW_S = 0.02;
const envelope = (file) =>
  [...ffmpeg(['-i', file, '-af', 'asetnsamples=n=882,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level', '-f', 'null', '-'])
    .matchAll(/RMS_level=(-?[\d.]+|-inf)/g)].map((m) => (m[1] === '-inf' ? -120 : Number(m[1])));

// Where to cut between each pair of words: the quietest window in the pause.
// Whisper's word edges can be ~0.1 s out, so the search reaches a little past them.
const cuts = (file, words) => {
  const env = envelope(file);
  return words.slice(0, -1).map((w, i) => {
    const from = Math.max(0, Math.floor((w.endS - 0.1) / WINDOW_S));
    const to = Math.min(env.length - 1, Math.ceil((words[i + 1].startS + 0.15) / WINDOW_S));
    let min = from;
    for (let k = from; k <= to; k++) if (env[k] < env[min]) min = k;
    // In a long quiet stretch, cut in its middle rather than at its first window.
    let a = min;
    let b = min;
    while (a > from && env[a - 1] <= env[min] + 3) a--;
    while (b < to && env[b + 1] <= env[min] + 3) b++;
    const best = Math.round((a + b) / 2);
    return {afterWord: i, cutS: +((best + 0.5) * WINDOW_S).toFixed(3), levelDb: Math.round(env[best])};
  });
};

// Same chain as normalize-voiceover.mjs: static gain, a light limiter under the
// true-peak ceiling, short fades at both ends. -map_metadata -1 drops the tags.
const render = (src, out, gainDb) => {
  const fadeOutAt = (duration(src) - EDGE_FADE_S).toFixed(3);
  ffmpeg([
    '-y', '-i', src, '-map', '0:a', '-map_metadata', '-1',
    '-af',
    [
      `volume=${gainDb.toFixed(2)}dB`,
      `alimiter=limit=${Math.pow(10, LIMIT_DB / 20).toFixed(4)}:attack=2:release=60:level=disabled`,
      `afade=t=in:d=${EDGE_FADE_S}`,
      `afade=t=out:st=${fadeOutAt}:d=${EDGE_FADE_S}`,
    ].join(','),
    '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '192k', '-id3v2_version', '0', '-write_xing', '1',
    out,
  ]);
};

const python = process.env.WHISPER_PYTHON;
if (!python) throw new Error('Set WHISPER_PYTHON to a Python that has faster-whisper installed.');

const sources = fs.readdirSync('.').filter((f) => f.startsWith(`${prefix}-`) && f.endsWith('.mp3')).sort();
if (!sources.length) throw new Error(`No ${prefix}-*.mp3 takes in the project root.`);
const outDir = path.join('public', 'audio', dir);
fs.mkdirSync(outDir, {recursive: true});

console.log('take                 before LUFS  after LUFS  after peak  length');
const outs = [];
for (const src of sources) {
  const out = path.join(outDir, src);
  const before = loudness(src).lufs;
  let gain = TARGET_LUFS - before;
  render(src, out, gain);
  let after = loudness(out);
  for (let pass = 0; pass < 5 && Math.abs(after.lufs - TARGET_LUFS) > 0.2; pass++) {
    gain += TARGET_LUFS - after.lufs;
    render(src, out, gain);
    after = loudness(out);
  }
  outs.push(out);
  console.log(
    `${src.padEnd(20)} ${before.toFixed(1).padStart(11)}  ${after.lufs.toFixed(1).padStart(10)}  ${after.peak.toFixed(1).padStart(5)} dBFS  ${duration(out).toFixed(2)} s`,
  );
}

const r = spawnSync(python, ['scripts/take-words.py', ...outs], {encoding: 'utf8', maxBuffer: 1 << 26});
if (r.status !== 0) throw new Error(`take-words.py failed: ${r.stderr}`);
const words = JSON.parse(r.stdout);

const takes = {};
for (const out of outs) {
  const name = path.basename(out);
  takes[name.replace(/\.mp3$/, '')] = {
    src: `audio/${dir}/${name}`,
    durationS: +duration(out).toFixed(3),
    words: words[name],
    cuts: cuts(out, words[name]),
  };
}
const json = path.join('src', dir, 'takes.json');
fs.writeFileSync(json, JSON.stringify(takes, null, 1) + '\n');
console.log(`\nWrote ${json} (${Object.keys(takes).length} takes).`);
