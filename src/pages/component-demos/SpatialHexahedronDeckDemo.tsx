import React, { useState, useRef } from 'react';
import {
  SpatialHexahedronDeck,
  type SpatialHexahedronVariant,
  type SpatialHexahedronSize,
  type CubeFaceId,
  type CubeFaceData,
  type SpatialHexahedronDeckHandle,
} from '../../components/ui/spatial-hexahedron-deck';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function SpatialHexahedronDeckDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<SpatialHexahedronVariant>(() =>
    isDark ? 'cyber-obsidian' : 'clean-porcelain'
  );
  const [size, setSize] = useState<SpatialHexahedronSize>('md');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [activeFaceId, setActiveFaceId] = useState<CubeFaceId>('front');
  const [activeFaceInfo, setActiveFaceInfo] = useState<CubeFaceData | null>(null);

  const cubeRef = useRef<SpatialHexahedronDeckHandle>(null);

  const handleSnap = (faceId: CubeFaceId) => {
    setActiveFaceId(faceId);
    cubeRef.current?.snapToFace(faceId);
  };

  const handleToggleExplode = (checked: boolean) => {
    setIsExploded(checked);
    cubeRef.current?.setExploded(checked);
  };

  const handleReset = () => {
    setActiveFaceId('front');
    cubeRef.current?.resetRotation();
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
            minHeight: '380px',
          }}
        >
          <SpatialHexahedronDeck
            ref={cubeRef}
            variant={variant}
            size={size}
            autoRotate={autoRotate}
            soundEnabled={soundEnabled}
            exploded={isExploded}
            showFaceNav={false}
            onFaceChange={(face) => {
              setActiveFaceId(face.id);
              setActiveFaceInfo(face);
            }}
          />

          <div className="modui-stage-caption" style={{ marginTop: '1.75rem' }}>
            <div className="modui-stage-caption-hint">
              Drag anywhere to rotate in 3D with inertia &bull; Click faces or snap buttons below &bull; Toggle exploded inspection
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Material Variant</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as SpatialHexahedronVariant)}
          >
            <option value="cyber-obsidian">Cyber Obsidian (Neon Blue & Slate Glass)</option>
            <option value="clean-porcelain">Clean Porcelain (Architectural Frost White)</option>
            <option value="titanium-steel">Titanium Steel (Machined Metallic Graphite)</option>
            <option value="aurora-violet">Aurora Violet (Cosmic Deep Indigo)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Cube Scale</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as SpatialHexahedronSize)}
          >
            <option value="sm">Small (150px — Compact / Embed)</option>
            <option value="md">Medium (220px — Standard Hero)</option>
            <option value="lg">Large (280px — Expanded Keynote)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Face Directional Snap</label>
          <div className="modui-control-buttons">
            {(
              [
                { id: 'front', label: '01 Front' },
                { id: 'right', label: '02 Right' },
                { id: 'back', label: '03 Back' },
                { id: 'left', label: '04 Left' },
                { id: 'top', label: '05 Top' },
                { id: 'bottom', label: '06 Bottom' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                className={`modui-control-btn ${activeFaceId === f.id ? 'modui-control-btn--active' : ''}`}
                onClick={() => handleSnap(f.id)}
              >
                {f.label}
              </button>
            ))}
            <button
              type="button"
              className="modui-control-btn"
              onClick={handleReset}
              style={{ fontWeight: 600 }}
            >
              Isometric Rest
            </button>
          </div>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Interactive Modes & Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={isExploded}
                onChange={(e) => handleToggleExplode(e.target.checked)}
              />
              <span>💥 Explode / Unfold Faces</span>
            </label>

            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
              <span>Idle Auto-Rotation (Continuous Spin)</span>
            </label>

            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Spatial Acoustic Haptics (Web Audio API)</span>
            </label>
          </div>
        </div>

        {activeFaceInfo && (
          <div
            className="modui-control-group"
            style={{
              gridColumn: '1 / -1',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Active Capability: {activeFaceInfo.title}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'var(--accent-subtle, rgba(59, 130, 246, 0.15))',
                  color: 'var(--accent-primary, #3b82f6)',
                }}
              >
                {activeFaceInfo.id.toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              {activeFaceInfo.description}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
