import React, { useState, useRef } from 'react';
import {
  InteractivePopoutFolder,
  type PopoutFolderVariant,
  type PopoutFolderSize,
  type InteractivePopoutFolderHandle,
  type FolderImageItem,
} from '../../components/ui/popout-folder';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function InteractivePopoutFolderDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<PopoutFolderVariant>(() =>
    isDark ? 'obsidian-glass' : 'cobalt-studio'
  );
  const [size, setSize] = useState<PopoutFolderSize>('md');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastOpened, setLastOpened] = useState<string | null>(null);

  const folderRef = useRef<InteractivePopoutFolderHandle>(null);

  const handleImageOpen = (img: FolderImageItem, index: number) => {
    setLastOpened(`Opened #${index + 1}: ${img.title}`);
  };

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
          }}
        >
          <InteractivePopoutFolder
            ref={folderRef}
            title="Visual Captures"
            variant={variant}
            size={size}
            soundEnabled={soundEnabled}
            onImageOpen={handleImageOpen}
          />

          <div className="modui-stage-caption" style={{ marginTop: '1.75rem' }}>
            <div className="modui-stage-caption-hint">
              Hover or tap folder to fan out photos &bull; Click any popped-out image to open lightbox viewer
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Folder Material</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as PopoutFolderVariant)}
          >
            <option value="cobalt-studio">Cobalt Studio (Blue)</option>
            <option value="obsidian-glass">Obsidian Glass (Dark)</option>
            <option value="porcelain-frost">Porcelain Frost (Light)</option>
            <option value="amber-archive">Amber Archive (Warm)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Folder Scale</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as PopoutFolderSize)}
          >
            <option value="sm">Small (Compact Card)</option>
            <option value="md">Medium (Default)</option>
            <option value="lg">Large (Showcase)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Folder &amp; Lightbox Actions</label>
          <div className="modui-control-buttons">
            <button
              type="button"
              className="modui-control-btn"
              onClick={() => folderRef.current?.openFolder()}
            >
              Fan Open
            </button>
            <button
              type="button"
              className="modui-control-btn"
              onClick={() => folderRef.current?.closeFolder()}
            >
              Close Pocket
            </button>
            <button
              type="button"
              className="modui-control-btn"
              onClick={() => folderRef.current?.openImage(0)}
            >
              Open Image #1
            </button>
          </div>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Web Audio Pocket &amp; Shutter Ticks</span>
            </label>
          </div>
        </div>

        {lastOpened && (
          <div className="modui-control-group" style={{ gridColumn: '1 / -1' }}>
            <label className="modui-control-label">Latest Lightbox Event</label>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              {lastOpened}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
