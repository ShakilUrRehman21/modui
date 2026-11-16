import React, { useState } from 'react';
import { TactileStepWizard } from '../../components/ui/tactile-step-wizard';
import type {
  WizardStep,
  WizardVariant,
  WizardOrientation,
} from '../../components/ui/tactile-step-wizard';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function TactileStepWizardDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<WizardVariant>(() =>
    isDark ? 'editorial' : 'studio'
  );
  const [orientation, setOrientation] = useState<WizardOrientation>('horizontal');
  const [linear, setLinear] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Form states inside the wizard steps
  const [adminName, setAdminName] = useState('Alex Rivera');
  const [adminEmail, setAdminEmail] = useState('alex@modui.dev');
  const [workspaceSlug, setWorkspaceSlug] = useState('quantum-studio');
  const [primaryRegion, setPrimaryRegion] = useState('us-east (Virginia)');
  const [webhookSecret, setWebhookSecret] = useState('whsec_99a8df13b52e');
  const [completed, setCompleted] = useState(false);

  // Define realistic SaaS onboarding steps
  const demoSteps: WizardStep[] = [
    {
      id: 'profile',
      title: 'Admin Profile',
      description: 'Account credentials & workspace owner',
      badge: 'Required',
      validate: () => {
        return adminName.trim().length > 0 && adminEmail.includes('@');
      },
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '6px',
                color: 'var(--text-secondary)',
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-card-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '6px',
                color: 'var(--text-secondary)',
              }}
            >
              Work Email Address
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="alex@company.com"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-card-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      description: 'Global compute and edge region',
      badge: 'Edge CD',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '6px',
                color: 'var(--text-secondary)',
              }}
            >
              Workspace Subdomain
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={workspaceSlug}
                onChange={(e) => setWorkspaceSlug(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px 0 0 8px',
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  padding: '9px 12px',
                  background: 'var(--border-default)',
                  border: '1px solid var(--border-default)',
                  borderLeft: 'none',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                .modui.design
              </span>
            </div>
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '6px',
                color: 'var(--text-secondary)',
              }}
            >
              Primary Edge Cluster
            </label>
            <select
              value={primaryRegion}
              onChange={(e) => setPrimaryRegion(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-card-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="us-east (Virginia)">us-east (Virginia, N. America - 12ms)</option>
              <option value="eu-central (Frankfurt)">eu-central (Frankfurt, Europe - 18ms)</option>
              <option value="ap-southeast (Tokyo)">ap-southeast (Tokyo, Asia Pacific - 24ms)</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Automated telemetry webhooks',
      badge: 'v1.4',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '6px',
                color: 'var(--text-secondary)',
              }}
            >
              Production Webhook Secret
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={webhookSecret}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                className="modui-pill-toggle"
                style={{ fontSize: '11px', padding: '0 12px' }}
                onClick={() =>
                  setWebhookSecret(`whsec_${Math.random().toString(36).slice(2, 14)}`)
                }
              >
                Regenerate
              </button>
            </div>
          </div>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'var(--bg-card-subtle)',
              border: '1px dashed var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px',
            }}
          >
            <span>Live Telemetry Ingestion</span>
            <span
              style={{
                color: 'var(--success, #10B981)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              ● Connected
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'launch',
      title: 'Review & Launch',
      description: 'Confirm workspace deployment',
      badge: 'Ready',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-default)',
              fontSize: '12.5px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>
                OWNER
              </span>
              <strong>{adminName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>
                ENDPOINT
              </span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{workspaceSlug}.modui.design</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>
                PRIMARY REGION
              </span>
              <strong>{primaryRegion.split(' ')[0]}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>
                STATUS
              </span>
              <strong style={{ color: 'var(--success, #10B981)' }}>Pre-flight Verified ✓</strong>
            </div>
          </div>
          {completed && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--success, #10B981)',
                fontSize: '12.5px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              🎉 Workspace deployed! Pipeline initialized successfully.
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: orientation === 'vertical' ? '820px' : '700px',
            margin: '0 auto',
            padding: '2.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '380px',
          }}
        >
          <TactileStepWizard
            key={`${variant}-${orientation}-${linear}`}
            steps={demoSteps}
            variant={variant}
            orientation={orientation}
            theme={theme}
            linear={linear}
            soundEnabled={soundEnabled}
            onComplete={() => setCompleted(true)}
            onStepChange={() => setCompleted(false)}
          />

          <div className="modui-stage-caption" style={{ marginTop: '2rem' }}>
            <div className="modui-stage-caption-hint">
              Press Enter to advance, Cmd/Ctrl+Backspace to return. Click nodes to jump.
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Visual Finish</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as WizardVariant)}
          >
            <option value="studio">Studio (Porcelain & Royal Cobalt)</option>
            <option value="editorial">Editorial (Obsidian Titanium & Electric)</option>
            <option value="emerald">Emerald (High-Trust Fintech)</option>
            <option value="minimal">Minimal (Monochrome Precision)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Track Orientation</label>
          <select
            className="modui-control-select"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as WizardOrientation)}
          >
            <option value="horizontal">Horizontal (Top Stepper Track)</option>
            <option value="vertical">Vertical (Sidebar Stepper Layout)</option>
            <option value="minimal">Minimal (Progress Bar Segment)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Navigation & Sound</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="modui-control-toggle" style={{ paddingTop: 0 }}>
              <input
                type="checkbox"
                checked={linear}
                onChange={(e) => setLinear(e.target.checked)}
              />
              <span>Linear Progression</span>
            </label>

            <label className="modui-control-toggle" style={{ paddingTop: 0 }}>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Acoustic Haptics</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
