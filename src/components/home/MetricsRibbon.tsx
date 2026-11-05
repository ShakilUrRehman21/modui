import React from 'react';
import './MetricsRibbon.css';

interface MetricItem {
  value: string;
  label: string;
  isAccent?: boolean;
}

const METRICS: MetricItem[] = [
  { value: '25', label: 'Handcrafted Primitives', isAccent: true },
  { value: '0 KB', label: 'Runtime Bloat / Pure Code' },
  { value: '60 FPS', label: 'Hardware-Composited Motion' },
  { value: '100%', label: 'Direct Codebase Ownership', isAccent: true },
];

export const MetricsRibbon: React.FC = () => {
  return (
    <section className="modui-metrics-ribbon" aria-label="Platform architectural metrics">
      <div className="modui-container">
        <div className="modui-metrics-grid">
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              className={`modui-metric-card modui-reveal modui-delay-${i + 1}`}
            >
              <div
                className={`modui-metric-val ${metric.isAccent ? 'modui-metric-val--accent' : ''}`}
              >
                {metric.value}
              </div>
              <div className="modui-metric-label">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsRibbon;

