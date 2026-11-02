// Builds each scene's narration clip and loudness-normalises it to TARGET_LUFS,
// writing public/audio/sceneNN.mp3. Scenes listed in voiceover-edits.mjs are
// assembled from pieces of the original recordings and newly recorded lines;
// the rest use sceneNN.mp3 from the project root as is. The originals are
// never modified. Every clip gets short fades at both ends so scene changes
// never pop.
//
// Usage: node scripts/normalize-voiceover.mjs [--draft]   (needs a full ffmpeg on PATH)
//  --draft  stand in out/draft-lines/<name>.wav (temporary TTS) for any new
//           line not yet recorded. For checking timing only; never render a
//           final video from a draft build.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {EDITS, GAP_S, LINE_LEAD_S, LINE_TAIL_S, LINE_TRIM_DB} from './voiceover-edits.mjs';

const TARGET_LUFS = -14;
const TRUE_PEAK = -1.5;
// Fade at each end of a finished clip, and at every splice inside one.
const EDGE_FADE_S = 0.03;
const SPLICE_FADE_S = 0.015;
// Pacing: src/pauses.json (written by scripts/plan-pauses.mjs) lists points
// inside sentence pauses where silence is inserted. The speech itself is never
// stretched. --no-pauses builds without them (the planning pass).
const noPauses = process.argv.includes('--no-pauses');
const PAUSE_PLAN = noPauses || !fs.existsSync('src/pauses.json') ? {} : JSON.parse(fs.readFileSync('src/pauses.json', 'utf8'));
const DRAFT_DIR = 'out/draft-lines';
const draft = process.argv.includes('--draft');

/** Runs ffmpeg and returns stderr, where it prints filter reports. */
const ffmpeg = (args) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], {encoding: 'utf8'});
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
  return r.stderr;
};

const loudness = (file) => {
  const summary = ffmpeg(['-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-']).split('Summary:').pop();
  return {
    lufs: Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)[1]),
    peak: Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)[1]),
  };
};

// Narration per scene from script.md: the "> " lines under "## Scene N".
const narration = {};
let current = null;
for (const line of fs.readFileSync('script.md', 'utf8').split(/\r?\n/)) {
  const h = line.match(/^## Scene (\d+)\b/);
  if (h) current = `s${h[1].padStart(2, '0')}`;
  else if (current && line.startsWith('> ')) narration[current] = [narration[current], line.slice(2).trim()].filter(Boolean).join(' ');
}

/** The file a new line is read from, or null if it hasn't been recorded. */
const lineFile = (name) => {
  if (fs.existsSync(name)) return {file: name, isDraft: false};
  const stand = path.join(DRAFT_DIR, name.replace(/\.mp3$/, '.wav'));
  if (draft && fs.existsSync(stand)) return {file: stand, isDraft: true};
  return null;
};

/** Assembles a scene from its EDITS pieces into a temporary WAV. */
const assemble = (id, pieces) => {
  const joined = pieces.map((p) => p.text).join(' ');
  if (joined !== narration[id]) {
    throw new Error(`${id}: the pieces in voiceover-edits.mjs don't match script.md.\n  pieces: ${joined}\n  script: ${narration[id]}`);
  }
  const missing = pieces.filter((p) => p.line && !lineFile(p.line)).map((p) => p.line);
  if (missing.length) throw new Error(`${id}: not recorded yet: ${missing.join(', ')}${draft ? '' : ' (or run with --draft)'}`);

  // A new line is matched to the loudness of the scene's own recording, or of
  // Scene 1's when a scene is built only from line takes.
  const reference = pieces.find((p) => p.src)?.src ?? 'scene01.mp3';
  const refLufs = loudness(reference).lufs;

  const resolved = pieces.map((p) => (p.line ? {...p, ...lineFile(p.line)} : {...p, file: p.src}));
  const inputs = [...new Set(resolved.map((p) => p.file))];
  const filters = [];
  const labels = [];
  resolved.forEach((p, i) => {
    const prev = resolved[i - 1];
    // A new line brings its own lead and tail of air; the gap tops the pause up to ~GAP_S plus the cut margins.
    const gap = p.gapBefore ?? (i === 0 ? 0 : prev.line ? Math.max(0, GAP_S + 0.08 - LINE_TAIL_S) : p.line ? Math.max(0, GAP_S + 0.03 - LINE_LEAD_S) : 0);
    if (gap > 0) {
      filters.push(`anullsrc=r=44100:cl=mono,atrim=duration=${gap}[g${i}]`);
      labels.push(`[g${i}]`);
    }
    // Pieces from different recordings must share a format to be joined.
    const chain = ['aresample=44100', 'aformat=channel_layouts=mono'];
    if (p.line) {
      // {line, from, to}: one or more sentences cut from a line take.
      if (p.from !== undefined || p.to !== undefined) {
        chain.unshift(`atrim=start=${p.from ?? 0}${p.to === undefined ? '' : `:end=${p.to}`}`, 'asetpts=PTS-STARTPTS');
      }
      // Trim the take's own silence. The threshold is low and the tail generous
      // so quiet consonants and the decay of the last word survive.
      const trim = (keep) => `silenceremove=start_periods=1:start_threshold=${LINE_TRIM_DB}dB:start_silence=${keep}`;
      chain.push(trim(LINE_LEAD_S), 'areverse', trim(LINE_TAIL_S), 'areverse');
      const gain = (p.gainDb ?? 0) + refLufs - loudness(p.file).lufs;
      if (gain) chain.push(`volume=${gain.toFixed(2)}dB`);
    } else {
      chain.unshift(`atrim=start=${p.from}${p.to === undefined ? '' : `:end=${p.to}`}`, 'asetpts=PTS-STARTPTS');
      if (p.gainDb) chain.push(`volume=${p.gainDb}dB`);
    }
    // Tiny fades at every splice so cuts never click.
    chain.push(`afade=t=in:d=${SPLICE_FADE_S}`, 'areverse', `afade=t=in:d=${SPLICE_FADE_S}`, 'areverse');
    filters.push(`[${inputs.indexOf(p.file)}:a]${chain.join(',')}[p${i}]`);
    labels.push(`[p${i}]`);
  });
  filters.push(`${labels.join('')}concat=n=${labels.length}:v=0:a=1[out]`);
  const out = path.join(os.tmpdir(), `assembled-${id}.wav`);
  ffmpeg(['-y', ...inputs.flatMap((f) => ['-i', f]), '-filter_complex', filters.join(';'), '-map', '[out]', '-c:a', 'pcm_s16le', out]);
  return {file: out, drafts: resolved.filter((p) => p.isDraft).map((p) => p.line)};
};

/** Inserts the planned silence (src/pauses.json) into a clip, as a new WAV. */
const breathe = (id, src) => {
  const pauses = (PAUSE_PLAN[id] ?? []).map((p) => ({cut: p.at, add: p.add}));
  // Where silence went in, for tools that map assembled times to final times.
  fs.writeFileSync(path.join(os.tmpdir(), `breathe-${id}.json`), JSON.stringify(pauses));
  if (!pauses.length) return src;
  const fade = (from, to) => `atrim=start=${from}${to === undefined ? '' : `:end=${to}`},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,areverse,afade=t=in:d=0.005,areverse`;
  const filters = [];
  const labels = [];
  let from = 0;
  pauses.forEach((p, i) => {
    filters.push(`[0:a]${fade(from, p.cut)}[s${i}]`, `anullsrc=r=44100:cl=mono,atrim=duration=${p.add.toFixed(3)}[z${i}]`);
    labels.push(`[s${i}]`, `[z${i}]`);
    from = p.cut;
  });
  filters.push(`[0:a]${fade(from)}[s${pauses.length}]`);
  labels.push(`[s${pauses.length}]`);
  filters.push(`${labels.join('')}concat=n=${labels.length}:v=0:a=1[out]`);
  const out = path.join(os.tmpdir(), `breathe-${id}.wav`);
  ffmpeg(['-y', '-i', src, '-filter_complex', filters.join(';'), '-map', '[out]', '-ar', '44100', '-ac', '1', '-c:a', 'pcm_s16le', out]);
  return out;
};

const duration = (file) =>
  Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'}).stdout);

// Speech peaks sit ~14 dB above its loudness, so reaching TARGET_LUFS under a
// TRUE_PEAK ceiling needs a light limiter. Apply static gain, then a fast
// limiter set a little under the ceiling to leave room for MP3 overshoot.
const LIMIT_DB = TRUE_PEAK - 1;
const render = (src, out, gainDb) => {
  const fadeOutAt = (duration(src) - EDGE_FADE_S).toFixed(3);
  ffmpeg([
    '-y', '-i', src,
    '-af',
    [
      `volume=${gainDb.toFixed(2)}dB`,
      `alimiter=limit=${Math.pow(10, LIMIT_DB / 20).toFixed(4)}:attack=2:release=60:level=disabled`,
      `afade=t=in:d=${EDGE_FADE_S}`,
      `afade=t=out:st=${fadeOutAt}:d=${EDGE_FADE_S}`,
    ].join(','),
    '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '192k',
    out,
  ]);
};

const outDir = path.resolve('public/audio');
fs.mkdirSync(outDir, {recursive: true});

const ids = Object.keys(narration).sort();
if (ids.length === 0) throw new Error('No narration found in script.md.');

const allDrafts = [];
console.log('clip   before LUFS  after LUFS  after peak');
for (const id of ids) {
  const n = id.slice(1);
  const out = path.join(outDir, `scene${n}.mp3`);
  let src = `scene${n}.mp3`;
  let drafts = [];
  if (EDITS[id]) ({file: src, drafts} = assemble(id, EDITS[id]));
  else if (!fs.existsSync(src)) throw new Error(`${id}: ${src} not found and no EDITS entry.`);
  src = breathe(id, src);
  allDrafts.push(...drafts);

  const before = loudness(src).lufs;
  let gain = TARGET_LUFS - before;
  render(src, out, gain);
  // Limiting shaves some loudness, more as gain rises; converge in a few passes.
  let after = loudness(out);
  for (let pass = 0; pass < 5 && Math.abs(after.lufs - TARGET_LUFS) > 0.2; pass++) {
    gain += TARGET_LUFS - after.lufs;
    render(src, out, gain);
    after = loudness(out);
  }
  console.log(
    `${(id + (EDITS[id] ? '*' : '')).padEnd(6)} ${before.toFixed(1).padStart(10)}  ${after.lufs.toFixed(1).padStart(9)}  ${after.peak.toFixed(1).padStart(6)} dBFS${drafts.length ? '  DRAFT' : ''}`,
  );
}
// A marker the render step checks, so a draft build can't become the final video.
const marker = path.join(outDir, 'DRAFT.txt');
if (allDrafts.length) fs.writeFileSync(marker, allDrafts.join('\n') + '\n');
else fs.rmSync(marker, {force: true});
if (allDrafts.length) {
  console.warn(`\nDRAFT BUILD: temporary TTS stands in for ${allDrafts.length} unrecorded line(s):\n  ${allDrafts.join('\n  ')}\nDo not render a final video from this build.`);
}
