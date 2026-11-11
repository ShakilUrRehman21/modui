import React, { useState } from 'react';
import { NumberTicker } from '../../components/ui/counter';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function NumberTickerDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [tickerVal, setTickerVal] = useState(1420);
    const [tickerPrefix, setTickerPrefix] = useState('$');
    const [tickerSuffix, setTickerSuffix] = useState('/mo');
    const [tickerDecimals, setTickerDecimals] = useState(0);
    const [tickerDuration, setTickerDuration] = useState(1.2);

  return (
    <>
      <div className="modui-canvas-stage">
        <div className="modui-detail-ticker-stage">
                        <div className="modui-kpi-card">
                          <div className="modui-kpi-card__head">
                            <span className="modui-kpi-card__label">Monthly recurring revenue</span>
                            <span className={`modui-kpi-card__delta ${tickerVal >= 1420 ? 'is-up' : 'is-down'}`}>
                              {tickerVal >= 1420 ? '▲' : '▼'} {Math.abs(((tickerVal - 1420) / 1420) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="modui-detail-ticker-value">
                            <NumberTicker
                              value={tickerVal}
                              prefix={tickerPrefix}
                              suffix={tickerSuffix}
                              decimalPlaces={tickerDecimals}
                              duration={tickerDuration}
                            />
                          </div>
                          <svg className="modui-kpi-card__spark" viewBox="0 0 240 48" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                              <linearGradient id="kpi-fill" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M0 38 L24 34 L48 36 L72 28 L96 30 L120 22 L144 25 L168 16 L192 19 L216 10 L240 8 L240 48 L0 48 Z" fill="url(#kpi-fill)" />
                            <path d="M0 38 L24 34 L48 36 L72 28 L96 30 L120 22 L144 25 L168 16 L192 19 L216 10 L240 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                          </svg>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="modui-pill-toggle"
                            onClick={() => setTickerVal((v) => v + 100)}
                          >
                            +100
                          </button>
                          <button
                            type="button"
                            className="modui-pill-toggle"
                            onClick={() => setTickerVal((v) => Math.max(0, v - 50))}
                          >
                            -50
                          </button>
                          <button
                            type="button"
                            className="modui-pill-toggle"
                            onClick={() => setTickerVal(Math.floor(Math.random() * 95000) + 1000)}
                          >
                            Random
                          </button>
                          <button
                            type="button"
                            className="modui-pill-toggle"
                            onClick={() => {
                              setTickerPrefix('$');
                              setTickerSuffix('/mo');
                              setTickerDecimals(0);
                              setTickerVal(1420);
                            }}
                          >
                            $1,420/mo
                          </button>
                          <button
                            type="button"
                            className="modui-pill-toggle"
                            onClick={() => {
                              setTickerPrefix('');
                              setTickerSuffix('%');
                              setTickerDecimals(2);
                              setTickerVal(99.98);
                            }}
                          >
                            99.98%
                          </button>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Target Value</label>
                      <input
                        type="number"
                        className="modui-control-input"
                        value={tickerVal}
                        onChange={(e) => setTickerVal(parseFloat(e.target.value) || 0)}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Prefix</label>
                      <input
                        type="text"
                        className="modui-control-input"
                        value={tickerPrefix}
                        onChange={(e) => setTickerPrefix(e.target.value)}
                        placeholder="e.g. $"
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Suffix</label>
                      <input
                        type="text"
                        className="modui-control-input"
                        value={tickerSuffix}
                        onChange={(e) => setTickerSuffix(e.target.value)}
                        placeholder="e.g. % or /mo"
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Decimals</label>
                      <select
                        className="modui-control-select"
                        value={tickerDecimals}
                        onChange={(e) => setTickerDecimals(parseInt(e.target.value, 10))}
                      >
                        <option value={0}>0 (Whole numbers)</option>
                        <option value={1}>1 (e.g. 4.5)</option>
                        <option value={2}>2 (e.g. 99.98)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Duration ({tickerDuration}s)</label>
                      <input
                        type="range"
                        min="0.4"
                        max="3.0"
                        step="0.2"
                        value={tickerDuration}
                        onChange={(e) => setTickerDuration(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
                  </div>
    </>
  );
}
