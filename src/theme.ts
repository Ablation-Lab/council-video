import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});
const mono = loadMono('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});

export const colors = {
  bg: '#0B0D10',
  panel: '#12151A',
  text: '#E6E8EB',
  muted: '#8A9099',
  line: '#2A2F36',
  faint: '#1B1F25',
  accent: '#F2A541',
  accentSoft: 'rgba(242, 165, 65, 0.14)',
} as const;

export const fonts = {
  sans: inter.fontFamily,
  mono: mono.fontFamily,
} as const;

// Minimum sizes chosen to survive heavy compression at 1080p.
export const type = {
  title: 96,
  heading: 64,
  body: 40,
  small: 32,
  caption: 28,
} as const;

export const layout = {
  width: 1920,
  height: 1080,
  margin: 120,
} as const;
