// Renders stills at evenly spaced frames of each composition for visual review.
// Usage: node scripts/review-stills.mjs Scene01 Scene02 ...  [--count=8] [--sheet]
// --sheet also tiles each composition's stills into out/stills/<id>-sheet.png
// (4 across, in time order; the frame numbers are in the still filenames) using ffmpeg.
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('--'));
const count = Number((args.find((a) => a.startsWith('--count=')) ?? '--count=8').split('=')[1]);
const sheet = args.includes('--sheet');
const outDir = path.resolve('out/stills');

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});

for (const id of ids) {
  const composition = await selectComposition({serveUrl, id});
  const last = composition.durationInFrames - 1;
  const files = [];
  for (let i = 0; i < count; i++) {
    // Skip the very last frames, which are mid fade-out.
    const frame = Math.round(((i + 0.5) / count) * last);
    const output = path.join(outDir, `${id}-${String(frame).padStart(4, '0')}.png`);
    await renderStill({serveUrl, composition, frame, output});
    files.push({output, frame});
  }
  if (sheet) {
    const inputs = files.flatMap((f) => ['-i', f.output]);
    const labelled = files
      .map(
        (f, i) =>
          `[${i}:v]scale=640:-1[v${i}]`,
      )
      .join(';');
    const cols = 4;
    const layout = files.map((_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|');
    const out = path.join(outDir, `${id}-sheet.png`);
    spawnSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', `${labelled};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${layout}`, out], {stdio: 'inherit'});
    console.log(out);
  } else {
    files.forEach((f) => console.log(f.output));
  }
}
