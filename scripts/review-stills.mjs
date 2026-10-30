// Renders stills at evenly spaced frames of each composition for visual review.
// Usage: node scripts/review-stills.mjs Scene01 Scene02 ...  [--count=8]
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('--'));
const count = Number((args.find((a) => a.startsWith('--count=')) ?? '--count=8').split('=')[1]);
const outDir = path.resolve('out/stills');

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});

for (const id of ids) {
  const composition = await selectComposition({serveUrl, id});
  const last = composition.durationInFrames - 1;
  for (let i = 0; i < count; i++) {
    const frame = Math.round(((i + 1) / count) * last);
    const output = path.join(outDir, `${id}-${String(frame).padStart(4, '0')}.png`);
    await renderStill({serveUrl, composition, frame, output});
    console.log(output);
  }
}
