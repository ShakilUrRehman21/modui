import React, { useState, useCallback, useId } from 'react';
import './TerminalCodeDiff.css';

export interface CodeToken {
  text: string;
  type?: 'keyword' | 'func' | 'string' | 'comment' | 'punctuation' | 'variable' | 'plain';
}

export interface CodeLine {
  number?: number | string;
  type?: 'neutral' | 'added' | 'removed';
  tokens: CodeToken[];
}

export interface TerminalTab {
  id: string;
  filename: string;
  badge?: string;
  isDiff?: boolean;
  lines: CodeLine[];
  /** Raw plain-text string representation for instant clipboard copying */
  rawCode?: string;
}

export type TerminalVariant = 'studio-dark' | 'cyber-terminal' | 'clean-light' | 'midnight-pro';

export interface TerminalCodeDiffProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onCopy'> {
  /** Array of file tabs to display */
  tabs?: TerminalTab[];
  /** Default active tab id */
  defaultTabId?: string;
  /** Visual finish variant (default: 'studio-dark') */
  variant?: TerminalVariant;
  /** Synthesize acoustic micro-ticks on tab change and copy (default: true) */
  soundEnabled?: boolean;
  /** Compact sizing for catalog card previews (default: false) */
  compact?: boolean;
  /** Callback fired when a tab is selected */
  onTabChange?: (tabId: string, tab: TerminalTab) => void;
  /** Callback fired when code is copied */
  onCopy?: (code: string, tabId: string) => void;
}

// ---------------------------------------------------------------------------
// Native Web Audio Synthesizer (Strictly zero external sound assets)
// ---------------------------------------------------------------------------
let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function playTick(freq = 680, duration = 0.025, type: OscillatorType = 'sine') {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

// ---------------------------------------------------------------------------
// Default Showcase Tabs (Developer landing page centerpiece)
// ---------------------------------------------------------------------------
export const DEFAULT_TERMINAL_TABS: TerminalTab[] = [
  {
    id: 'pipeline',
    filename: 'pipeline.ts',
    rawCode: `import { createPipeline } from '@modui/core';

// Instant edge verification with zero dependencies
export const edge = createPipeline({
  region: 'us-east-1',
  latency: 'sub-1ms',
  haptics: false
});`,
    lines: [
      {
        number: 1,
        tokens: [
          { text: 'import', type: 'keyword' },
          { text: ' { ', type: 'plain' },
          { text: 'createPipeline', type: 'func' },
          { text: ' } ', type: 'plain' },
          { text: 'from', type: 'keyword' },
          { text: " '@modui/core'", type: 'string' },
          { text: ';', type: 'punctuation' },
        ],
      },
      {
        number: 2,
        tokens: [
          { text: '// Instant edge verification with zero dependencies', type: 'comment' },
        ],
      },
      {
        number: 3,
        tokens: [
          { text: 'export const', type: 'keyword' },
          { text: ' edge = ', type: 'plain' },
          { text: 'createPipeline', type: 'func' },
          { text: '({', type: 'punctuation' },
        ],
      },
      {
        number: 4,
        tokens: [
          { text: '  region: ', type: 'plain' },
          { text: "'us-east-1'", type: 'string' },
          { text: ',', type: 'punctuation' },
        ],
      },
      {
        number: 5,
        tokens: [
          { text: '  latency: ', type: 'plain' },
          { text: "'sub-1ms'", type: 'string' },
          { text: ',', type: 'punctuation' },
        ],
      },
      {
        number: 6,
        tokens: [
          { text: '  haptics: ', type: 'plain' },
          { text: 'false', type: 'keyword' },
        ],
      },
      {
        number: 7,
        tokens: [{ text: '});', type: 'punctuation' }],
      },
    ],
  },
  {
    id: 'legacy',
    filename: 'legacy-setup.js',
    rawCode: `// Legacy complex configuration (35 lines)
const fs = require('fs');
const https = require('https');
const cluster = require('cluster');

function initCluster() {
  /* 30 lines boilerplate */
}`,
    lines: [
      {
        number: 1,
        tokens: [
          { text: '// Legacy complex configuration (35 lines)', type: 'comment' },
        ],
      },
      {
        number: 2,
        tokens: [
          { text: 'const', type: 'keyword' },
          { text: ' fs = ', type: 'plain' },
          { text: 'require', type: 'func' },
          { text: "('fs')", type: 'string' },
          { text: ';', type: 'punctuation' },
        ],
      },
      {
        number: 3,
        tokens: [
          { text: 'const', type: 'keyword' },
          { text: ' https = ', type: 'plain' },
          { text: 'require', type: 'func' },
          { text: "('https')", type: 'string' },
          { text: ';', type: 'punctuation' },
        ],
      },
      {
        number: 4,
        tokens: [
          { text: 'const', type: 'keyword' },
          { text: ' cluster = ', type: 'plain' },
          { text: 'require', type: 'func' },
          { text: "('cluster')", type: 'string' },
          { text: ';', type: 'punctuation' },
        ],
      },
      {
        number: 5,
        tokens: [
          { text: 'function', type: 'keyword' },
          { text: ' ', type: 'plain' },
          { text: 'initCluster', type: 'func' },
          { text: '() { ', type: 'punctuation' },
          { text: '/* 30 lines boilerplate */', type: 'comment' },
          { text: ' }', type: 'punctuation' },
        ],
      },
    ],
  },
  {
    id: 'diff',
    filename: 'diff ±',
    isDiff: true,
    rawCode: `- const raw = connectManualCluster({ retries: 5 });
- await raw.bindSockets();
+ import { createPipeline } from '@modui/core';
+ export const edge = createPipeline();`,
    lines: [
      {
        number: '-',
        type: 'removed',
        tokens: [
          { text: 'const', type: 'keyword' },
          { text: ' raw = ', type: 'plain' },
          { text: 'connectManualCluster', type: 'func' },
          { text: '({ retries: 5 });', type: 'punctuation' },
        ],
      },
      {
        number: '-',
        type: 'removed',
        tokens: [
          { text: 'await', type: 'keyword' },
          { text: ' raw.', type: 'plain' },
          { text: 'bindSockets', type: 'func' },
          { text: '();', type: 'punctuation' },
        ],
      },
      {
        number: '+',
        type: 'added',
        tokens: [
          { text: 'import', type: 'keyword' },
          { text: ' { ', type: 'plain' },
          { text: 'createPipeline', type: 'func' },
          { text: ' } ', type: 'plain' },
          { text: 'from', type: 'keyword' },
          { text: " '@modui/core'", type: 'string' },
          { text: ';', type: 'punctuation' },
        ],
      },
      {
        number: '+',
        type: 'added',
        tokens: [
          { text: 'export const', type: 'keyword' },
          { text: ' edge = ', type: 'plain' },
          { text: 'createPipeline', type: 'func' },
          { text: '();', type: 'punctuation' },
        ],
      },
    ],
  },
];

export function TerminalCodeDiff({
  tabs = DEFAULT_TERMINAL_TABS,
  defaultTabId,
  variant = 'studio-dark',
  soundEnabled = true,
  compact = false,
  onTabChange,
  onCopy,
  className = '',
  ...rest
}: TerminalCodeDiffProps) {
  const terminalId = useId();
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs[0] ? tabs[0].id : '')
  );
  const [copied, setCopied] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleTabClick = useCallback(
    (tab: TerminalTab) => {
      if (tab.id === activeTabId) return;
      setActiveTabId(tab.id);
      if (soundEnabled) {
        playTick(720, 0.02, 'sine');
      }
      onTabChange?.(tab.id, tab);
    },
    [activeTabId, onTabChange, soundEnabled]
  );

  const handleCopy = useCallback(async () => {
    if (!activeTab) return;

    const codeToCopy =
      activeTab.rawCode ||
      activeTab.lines.map((l) => l.tokens.map((t) => t.text).join('')).join('\n');

    let success = false;

    // 1. Try modern navigator.clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(codeToCopy);
        success = true;
      } catch {
        success = false;
      }
    }

    // 2. Reliable fallback for non-secure contexts / sandbox permissions
    if (!success && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = codeToCopy;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (soundEnabled) {
      playTick(960, 0.045, 'triangle');
    }

    setCopied(true);
    onCopy?.(codeToCopy, activeTab.id);
    setTimeout(() => setCopied(false), 2000);
  }, [activeTab, onCopy, soundEnabled]);

  return (
    <div
      id={terminalId}
      className={`modui-terminal-chassis modui-terminal--${variant} ${
        compact ? 'modui-terminal--compact' : ''
      } ${className}`}
      role="region"
      aria-label="Interactive Terminal Code Diff Inspector"
      {...rest}
    >
      {/* Titlebar with Traffic Lights, Tabs, and Copy Action */}
      <div className="modui-terminal-titlebar">
        {/* macOS Traffic Lights */}
        <div className="modui-terminal-dots" aria-hidden="true">
          <span className="modui-terminal-dot modui-dot-red" />
          <span className="modui-terminal-dot modui-dot-yellow" />
          <span className="modui-terminal-dot modui-dot-green" />
        </div>

        {/* Tab Navigation */}
        <div className="modui-terminal-tabs" role="tablist" aria-label="Terminal file tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                className={`modui-terminal-tab-btn ${isActive ? 'is-active' : ''} ${
                  tab.isDiff ? 'is-diff-tab' : ''
                }`}
                onClick={() => handleTabClick(tab)}
              >
                <span>{tab.filename}</span>
                {tab.badge && <span className="modui-terminal-tab-badge">{tab.badge}</span>}
              </button>
            );
          })}
        </div>

        {/* Copy Button */}
        <div className="modui-terminal-actions">
          <button
            type="button"
            className={`modui-terminal-copy-btn ${copied ? 'is-copied' : ''}`}
            onClick={handleCopy}
            aria-label="Copy active code to clipboard"
            title="Copy code to clipboard"
          >
            <span className="modui-terminal-copy-icon" aria-hidden="true">
              {copied ? '✓' : '📋'}
            </span>
            <span className="modui-terminal-copy-text">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>
      </div>

      {/* Terminal Code Body */}
      <div className="modui-terminal-body" tabIndex={0} role="region" aria-label="Code content">
        {activeTab.lines.map((line, idx) => (
          <div
            key={idx}
            className={`modui-code-line ${
              line.type === 'added'
                ? 'modui-line--added'
                : line.type === 'removed'
                ? 'modui-line--removed'
                : ''
            }`}
          >
            {line.number !== undefined && (
              <span className="modui-line-num" aria-hidden="true">
                {line.number}
              </span>
            )}
            <span className="modui-line-tokens">
              {line.tokens.map((token, tIdx) => (
                <span
                  key={tIdx}
                  className={token.type ? `modui-tok-${token.type}` : 'modui-tok-plain'}
                >
                  {token.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TerminalCodeDiff;
