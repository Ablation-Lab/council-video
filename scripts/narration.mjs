// Generates temporary narration: one WAV per scene from script.md, using
// Windows' built-in text-to-speech (scripts/tts.ps1). Writes public/audio/sNN.wav
// plus public/audio/manifest.json, then reports scenes where the narration
// runs longer than the visuals.
//
// Usage: node scripts/narration.mjs [--rate=0] [--voice="Microsoft Hazel Desktop"]
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {FPS, LEAD_IN_S, SCENES, sceneDurationInFrames} from '../src/timing.ts';

const arg = (name, fallback) =>
  (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `--${name}=${fallback}`).split('=').slice(1).join('=');
const rate = Number(arg('rate', '0'));
const voice = arg('voice', 'Microsoft Hazel Desktop');

const outDir = path.resolve('public/audio');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'narration-'));
fs.mkdirSync(outDir, {recursive: true});

// Narration = the "> " lines under each "## Scene N" heading in script.md.
const script = fs.readFileSync('script.md', 'utf8');
const fromScript = {};
let current = null;
for (const line of script.split(/\r?\n/)) {
  const heading = line.match(/^## Scene (\d+)\b/);
  if (heading) current = `s${heading[1].padStart(2, '0')}`;
  else if (current && line.startsWith('> ')) fromScript[current] = [fromScript[current], line.slice(2).trim()].filter(Boolean).join(' ');
}

// WAV duration from the header (PCM): data bytes / byte rate.
const wavSeconds = (file) => {
  const buf = fs.readFileSync(file);
  const byteRate = buf.readUInt32LE(28);
  let offset = 12;
  while (offset < buf.length - 8) {
    const id = buf.toString('ascii', offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === 'data') return size / byteRate;
    offset += 8 + size;
  }
  throw new Error(`No data chunk in ${file}`);
};

const manifest = {voice, rate, scenes: {}};
const rows = [];
for (const scene of SCENES) {
  const text = fromScript[scene.id];
  if (!text) throw new Error(`No narration for ${scene.id} in script.md`);
  if (text !== scene.narration) {
    console.warn(`! ${scene.id}: script.md narration differs from src/timing.ts. Using script.md.`);
  }
  const txt = path.join(tmpDir, `${scene.id}.txt`);
  const wav = path.join(outDir, `${scene.id}.wav`);
  fs.writeFileSync(txt, text, 'utf8');
  execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.resolve('scripts/tts.ps1'), '-TextFile', txt, '-OutFile', wav, '-Voice', voice, '-Rate', String(rate)], {stdio: 'inherit'});
  const seconds = wavSeconds(wav);
  const visualS = sceneDurationInFrames(scene) / FPS;
  const endsAt = LEAD_IN_S + seconds;
  const words = text.split(/\s+/).length;
  manifest.scenes[scene.id] = {file: `audio/${scene.id}.wav`, seconds: Number(seconds.toFixed(3))};
  rows.push({scene: scene.id, words, wpm: Math.round(words / (seconds / 60)), audioS: seconds, endsAt, visualS, spare: visualS - endsAt});
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.rmSync(tmpDir, {recursive: true, force: true});

console.log(`\nvoice: ${voice}, rate: ${rate}`);
console.log('scene  words  wpm   audio   ends at  visuals  spare');
for (const r of rows) {
  const flag = r.spare < 0 ? '  <-- narration runs past the visuals' : '';
  console.log(
    `${r.scene}    ${String(r.words).padStart(4)}  ${String(r.wpm).padStart(4)}  ${r.audioS.toFixed(1).padStart(5)}s  ${r.endsAt.toFixed(1).padStart(6)}s  ${r.visualS.toFixed(1).padStart(6)}s  ${r.spare.toFixed(1).padStart(5)}s${flag}`,
  );
}
const totalWords = rows.reduce((s, r) => s + r.words, 0);
const totalAudio = rows.reduce((s, r) => s + r.audioS, 0);
console.log(`overall: ${Math.round(totalWords / (totalAudio / 60))} wpm (visual timing assumes 160)`);
