import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Eyebrow, SceneFrame} from '../components/SceneFrame';
import {Check, Folder} from '../components/Icons';
import {TREE_ROOT, TreeNode} from '../components/Tree';
import {fadeUp, prog, typed} from '../anim';
import {colors, fonts, type} from '../theme';
import {makeCue} from '../timing';

const cue = makeCue('s01');

const TIMELINE_Y = 262;
const STOPS = [
  {x: 120, title: 'Coordinator', sub: 'writes shared code', at: 'A coordinator wrote'},
  {x: 540, title: 'Coordinator', sub: 'reviews its own code', at: 'reviewed it itself'},
  {x: 960, title: '4 builders', sub: 'work in parallel', at: 'Then four builders'},
  {x: 1380, title: 'Builder tests', sub: 'all passing', at: 'Their tests passed'},
];

const ROWS = [
  {name: 'shared/', owner: 'none', shared: true},
  {name: 'builder-1/', owner: 'builder 1'},
  {name: 'builder-2/', owner: 'builder 2'},
  {name: 'builder-3/', owner: 'builder 3'},
  {name: 'builder-4/', owner: 'builder 4'},
];

const LOG = [
  {key: 'process elevated', value: 'yes', at: 'ran as admin'},
  {key: 'writes', value: 'settings, logs', at: 'it wrote settings'},
  {key: 'target', value: '%APPDATA%', at: "into the user's own AppData"},
  {key: 'writable by', value: 'standard user', at: 'folder the user can write to'},
];

const Timeline: React.FC<{frame: number}> = ({frame}) => {
  const cues = STOPS.map((s) => cue(s.at));
  const head = interpolate(
    frame,
    [cues[0], cues[1], cues[2], cues[3], cues[3] + 30],
    [STOPS[0].x, STOPS[1].x, STOPS[2].x, STOPS[3].x, 1800],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <>
      <svg width={1920} height={40} style={{position: 'absolute', left: 0, top: TIMELINE_Y - 20}}>
        <line x1={120} x2={1800} y1={20} y2={20} stroke={colors.faint} strokeWidth={2} />
        <line x1={120} x2={head} y1={20} y2={20} stroke={colors.muted} strokeWidth={2} />
        {STOPS.map((s, i) => (
          <circle
            key={s.x}
            cx={s.x + 7}
            cy={20}
            r={7}
            fill={colors.text}
            opacity={prog(frame, cues[i], 12)}
          />
        ))}
      </svg>
      {STOPS.map((s, i) => (
        <div
          key={s.x}
          style={{position: 'absolute', left: s.x, top: TIMELINE_Y + 26, ...fadeUp(frame, cues[i])}}
        >
          <div style={{fontSize: type.small, fontWeight: 600, display: 'flex', gap: 10, alignItems: 'center'}}>
            {s.title}
            {i === 1 && <Check size={30} color={colors.muted} />}
          </div>
          <div style={{fontSize: type.caption, color: colors.muted, marginTop: 4}}>{s.sub}</div>
        </div>
      ))}
    </>
  );
};

const OwnershipTable: React.FC<{frame: number}> = ({frame}) => {
  const sharedAccent = prog(frame, cue('It sat in shared code'), 20);
  return (
    <div style={{position: 'absolute', left: 120, top: 430, width: 760}}>
      <Eyebrow style={{display: 'flex', marginBottom: 14, ...fadeUp(frame, cue('A coordinator wrote'))}}>
        <span style={{width: 270, paddingLeft: 20}}>Folder</span>
        <span style={{width: 180}}>Owner</span>
        <span>Check</span>
      </Eyebrow>
      {ROWS.map((r, i) => {
        const appearAt = r.shared ? cue('A coordinator wrote', 0.6) : cue('Then four builders', 0.25 * i);
        const statusAt = r.shared ? cue('reviewed it itself') : cue('Their tests passed', 0.15 * i);
        const accent = r.shared ? sharedAccent : 0;
        return (
          <div
            key={r.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 80,
              marginBottom: 6,
              padding: '0 18px',
              borderRadius: 12,
              border: `2px solid ${accent > 0.5 ? colors.accent : colors.faint}`,
              backgroundColor: accent > 0 ? `rgba(242,165,65,${0.1 * accent})` : colors.panel,
              ...fadeUp(frame, appearAt),
            }}
          >
            <span style={{width: 270, display: 'flex', alignItems: 'center', gap: 14}}>
              <Folder size={30} color={accent > 0.5 ? colors.accent : colors.muted} />
              <span style={{fontFamily: fonts.mono, fontSize: type.small}}>{r.name}</span>
            </span>
            <span
              style={{
                width: 180,
                fontSize: type.caption,
                color: r.shared ? (accent > 0.5 ? colors.accent : colors.text) : colors.muted,
              }}
            >
              {r.owner}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                whiteSpace: 'nowrap',
                fontFamily: fonts.mono,
                fontSize: type.caption,
                opacity: prog(frame, statusAt, 14),
              }}
            >
              <Check size={28} color={colors.muted} />
              {r.shared ? 'self-reviewed' : 'PASS'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ReviewerAndLog: React.FC<{frame: number}> = ({frame}) => {
  const reviewerAt = cue('Then a fresh reviewer');
  const emphasis = prog(frame, cue('A reviewer that had never seen'), 20);
  const highlight = prog(frame, cue('An admin process'), 15);
  const findingAt = cue('privilege-escalation hole', -0.3);
  const locationAt = cue('It sat in shared code');
  return (
    <div style={{position: 'absolute', left: 960, top: 430, width: 840}}>
      {/* Reviewer card */}
      <div
        style={{
          height: 76,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 22px',
          borderRadius: 12,
          border: `2px solid ${emphasis > 0.5 ? colors.accent : colors.line}`,
          backgroundColor: colors.panel,
          opacity: prog(frame, reviewerAt, 24),
          transform: `translateX(${(1 - prog(frame, reviewerAt, 24)) * 60}px)`,
        }}
      >
        <Eyebrow style={{color: emphasis > 0.5 ? colors.accent : colors.muted}}>Reviewer</Eyebrow>
        <span style={{fontSize: type.small}}>fresh session · integration audit</span>
      </div>

      {/* Audit log */}
      <div
        style={{
          marginTop: 16,
          padding: '16px 22px',
          borderRadius: 12,
          backgroundColor: colors.panel,
          border: `2px solid ${colors.faint}`,
          fontFamily: fonts.mono,
          fontSize: 30,
          ...fadeUp(frame, reviewerAt + 12),
        }}
      >
        <div style={{fontSize: type.caption, color: colors.muted, marginBottom: 8}}>integration-audit.log</div>
        <div style={{position: 'relative'}}>
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: 2 * 42,
              height: 2 * 42,
              width: `calc(${highlight * 100}% + 20px)`,
              backgroundColor: colors.accentSoft,
              borderLeft: highlight > 0 ? `4px solid ${colors.accent}` : 'none',
              borderRadius: 4,
            }}
          />
          {LOG.map((l, i) => {
            const start = cue(l.at);
            const isHot = i >= 2 && highlight > 0.5;
            const line = `${l.key.padEnd(18, ' ')}${l.value}`;
            return (
              <div key={l.key} style={{position: 'relative', height: 42, lineHeight: '42px', whiteSpace: 'pre'}}>
                <span style={{color: isHot ? colors.accent : colors.text}}>
                  {typed(line, frame, start, 40)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Finding card */}
      <div
        style={{
          marginTop: 16,
          padding: '18px 22px',
          borderRadius: 12,
          border: `2px solid ${colors.accent}`,
          backgroundColor: colors.panel,
          ...fadeUp(frame, findingAt, 24, 12),
        }}
      >
        <Eyebrow style={{color: colors.accent}}>Finding · Serious · Privilege escalation</Eyebrow>
        <div style={{fontSize: 34, fontWeight: 600, marginTop: 8}}>
          Admin process trusts a user-writable folder
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: type.caption,
            color: colors.muted,
            marginTop: 8,
            opacity: prog(frame, locationAt, 18),
          }}
        >
          location: <span style={{color: colors.accent}}>shared code (no owner)</span>
        </div>
      </div>
    </div>
  );
};

export const Scene01Finding: React.FC = () => {
  const frame = useCurrentFrame();
  const collapseAt = cue('This project builds on that');
  const collapse = prog(frame, collapseAt, 45);
  const titleAt = collapseAt + 36;

  return (
    <SceneFrame sceneId="s01">
      {collapse < 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: `${TREE_ROOT[0]}px ${TREE_ROOT[1]}px`,
            transform: `scale(${1 - collapse * 0.94})`,
            opacity: 1 - collapse,
          }}
        >
          <div style={{position: 'absolute', left: 120, top: 84, ...fadeUp(frame, 0, 30)}}>
            <Eyebrow>Pilot run</Eyebrow>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 6}}>
              <span style={{fontSize: type.heading, fontWeight: 600}}>WinScope</span>
              <span style={{fontSize: type.small, color: colors.muted}}>a Windows app built by AI agents</span>
            </div>
          </div>
          <Timeline frame={frame} />
          <OwnershipTable frame={frame} />
          <ReviewerAndLog frame={frame} />
        </div>
      )}

      <TreeNode
        x={TREE_ROOT[0]}
        y={TREE_ROOT[1]}
        label="G0"
        appear={prog(frame, collapseAt + 30, 24)}
      />
      <div style={{position: 'absolute', left: 440, top: 452, ...fadeUp(frame, titleAt, 36)}}>
        <div style={{fontSize: type.title, fontWeight: 600, letterSpacing: -1}}>Evolving Review Councils</div>
        <div style={{fontSize: type.small, color: colors.muted, marginTop: 10}}>
          Reviewer agents that improve over generations: an experiment plan
        </div>
      </div>
    </SceneFrame>
  );
};
