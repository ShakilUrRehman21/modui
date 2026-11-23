import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './TactileColorPalettePicker.css';

export type PaletteHarmony =
  | 'triadic'
  | 'complementary'
  | 'analogous'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic';

export type PalettePickerVariant =
  | 'studio-obsidian'
  | 'clean-porcelain'
  | 'cyber-matrix'
  | 'warm-editorial';

export interface ColorSwatch {
  role: string;
  hue: number;
  saturation: number;
  lightness: number;
  hex: string;
  rgb: [number, number, number];
  contrastWithWhite: number;
  contrastWithBlack: number;
  isAccessibleAA: boolean;
}

export interface TactileColorPalettePickerProps {
  initialHue?: number;
  initialSaturation?: number;
  initialLightness?: number;
  harmony?: PaletteHarmony;
  variant?: PalettePickerVariant;
  soundEnabled?: boolean;
  compact?: boolean;
  className?: string;
  onChange?: (palette: {
    primary: ColorSwatch;
    harmonies: ColorSwatch[];
    cssToken: string;
  }) => void;
  onCopyToken?: (token: string) => void;
}

export interface TactileColorPalettePickerHandle {
  getPrimaryColor: () => ColorSwatch;
  getPalette: () => ColorSwatch[];
  setHue: (hue: number) => void;
  setHarmony: (harmony: PaletteHarmony) => void;
  copyCssTokens: () => string;
}

// --- COLOR MATH HELPERS ---

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(lum1: number, lum2: number): number {
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

function createSwatch(role: string, h: number, s: number, l: number): ColorSwatch {
  const normalizedH = ((h % 360) + 360) % 360;
  const clampedS = Math.max(0, Math.min(1, s));
  const clampedL = Math.max(0, Math.min(1, l));
  const rgb = hslToRgb(normalizedH, clampedS, clampedL);
  const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
  const lum = getRelativeLuminance(rgb[0], rgb[1], rgb[2]);
  const contrastWithWhite = getContrastRatio(lum, 1.0);
  const contrastWithBlack = getContrastRatio(lum, 0.0);

  return {
    role,
    hue: Math.round(normalizedH),
    saturation: Math.round(clampedS * 100) / 100,
    lightness: Math.round(clampedL * 100) / 100,
    hex,
    rgb,
    contrastWithWhite: Math.round(contrastWithWhite * 10) / 10,
    contrastWithBlack: Math.round(contrastWithBlack * 10) / 10,
    isAccessibleAA: contrastWithWhite >= 4.5 || contrastWithBlack >= 4.5,
  };
}

export const TactileColorPalettePicker = forwardRef<
  TactileColorPalettePickerHandle,
  TactileColorPalettePickerProps
>(function TactileColorPalettePicker(
  {
    initialHue = 217,
    initialSaturation = 0.88,
    initialLightness = 0.52,
    harmony = 'triadic',
    variant = 'studio-obsidian',
    soundEnabled = true,
    compact = false,
    className = '',
    onChange,
    onCopyToken,
  },
  ref
) {
  const [hue, setHueState] = useState<number>(initialHue);
  const [saturation, setSaturationState] = useState<number>(initialSaturation);
  const [lightness] = useState<number>(initialLightness);
  const [activeHarmony, setActiveHarmony] = useState<PaletteHarmony>(harmony);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastDetentAngleRef = useRef<number>(-1);
  const isDraggingRef = useRef<boolean>(false);

  // Sync external harmony prop change
  useEffect(() => {
    setActiveHarmony(harmony);
  }, [harmony]);

  // Audio synthesizer functions
  const playDetentTick = useCallback(
    (freq = 820) => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioClass) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioClass();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.022);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.025);
      } catch {
        // Silently catch audio policy blocks
      }
    },
    [soundEnabled]
  );

  const playChime = useCallback(
    (freq = 660) => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioClass) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioClass();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        // Silently catch audio policy blocks
      }
    },
    [soundEnabled]
  );

  // Calculate palette based on active harmony
  const primary = createSwatch('Primary', hue, saturation, lightness);

  const harmonySwatches: ColorSwatch[] = [];
  if (activeHarmony === 'triadic') {
    harmonySwatches.push(
      createSwatch('Secondary', hue + 120, saturation, lightness),
      createSwatch('Accent', hue + 240, saturation, lightness)
    );
  } else if (activeHarmony === 'complementary') {
    harmonySwatches.push(
      createSwatch('Complement', hue + 180, saturation, lightness)
    );
  } else if (activeHarmony === 'analogous') {
    harmonySwatches.push(
      createSwatch('Harmonic A', hue + 30, saturation, lightness),
      createSwatch('Harmonic B', hue - 30, saturation, lightness)
    );
  } else if (activeHarmony === 'split-complementary') {
    harmonySwatches.push(
      createSwatch('Split 1', hue + 150, saturation, lightness),
      createSwatch('Split 2', hue + 210, saturation, lightness)
    );
  } else if (activeHarmony === 'tetradic') {
    harmonySwatches.push(
      createSwatch('Accent 1', hue + 90, saturation, lightness),
      createSwatch('Accent 2', hue + 180, saturation, lightness),
      createSwatch('Accent 3', hue + 270, saturation, lightness)
    );
  } else if (activeHarmony === 'monochromatic') {
    harmonySwatches.push(
      createSwatch('Shade', hue, Math.min(1, saturation * 1.1), Math.max(0.18, lightness - 0.22)),
      createSwatch('Tint', hue, Math.max(0.2, saturation * 0.7), Math.min(0.85, lightness + 0.22))
    );
  }

  const allSwatches = [primary, ...harmonySwatches];

  // Generate CSS custom properties token snippet
  const generateCssTokens = useCallback(() => {
    return [
      `/* ModUI Generated Chromatic Palette (${activeHarmony.toUpperCase()}) */`,
      `--modui-color-primary: ${primary.hex}; /* HSL(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%) */`,
      ...harmonySwatches.map(
        (sw, i) =>
          `--modui-color-${sw.role.toLowerCase().replace(/\s+/g, '-')}: ${sw.hex}; /* HSL(${sw.hue}, ${Math.round(sw.saturation * 100)}%, ${Math.round(sw.lightness * 100)}%) */`
      ),
    ].join('\n');
  }, [activeHarmony, primary, harmonySwatches]);

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      getPrimaryColor: () => primary,
      getPalette: () => allSwatches,
      setHue: (h: number) => {
        const nextH = ((h % 360) + 360) % 360;
        setHueState(nextH);
      },
      setHarmony: (harm: PaletteHarmony) => {
        setActiveHarmony(harm);
      },
      copyCssTokens: () => {
        const tokens = generateCssTokens();
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(tokens);
        }
        playChime(920);
        return tokens;
      },
    }),
    [primary, allSwatches, generateCssTokens, playChime]
  );

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange({
        primary,
        harmonies: harmonySwatches,
        cssToken: generateCssTokens(),
      });
    }
  }, [hue, saturation, activeHarmony, onChange, primary, harmonySwatches, generateCssTokens]);

  // Render polar wheel to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = compact ? 104 : 220;
    const center = size / 2;
    const radius = center - 4;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * size + x) * 4;

        if (dist <= radius) {
          let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          if (angle < 0) angle += 360;
          const sat = Math.min(1, dist / radius);
          const rgb = hslToRgb(angle, sat, 0.5);

          data[idx] = rgb[0];
          data[idx + 1] = rgb[1];
          data[idx + 2] = rgb[2];
          // Antialias outer rim
          const edgeAlpha = Math.min(1, Math.max(0, radius - dist + 1));
          data[idx + 3] = Math.round(255 * edgeAlpha);
        } else {
          data[idx + 3] = 0;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [compact]);

  // Pointer drag handling on polar wheel
  const handlePointerCoord = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const size = compact ? 104 : 220;
      const center = size / 2;
      const radius = center - 4;

      const px = clientX - rect.left - center;
      const py = clientY - rect.top - center;

      const dist = Math.min(radius, Math.sqrt(px * px + py * py));
      let angle = Math.atan2(py, px) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;

      const newHue = Math.round(angle);
      const newSat = Math.max(0.05, Math.min(1, dist / radius));

      // Haptic detents on cardinal angles (every 60 degrees)
      const detentStep = Math.round(newHue / 60);
      if (detentStep !== lastDetentAngleRef.current) {
        lastDetentAngleRef.current = detentStep;
        playDetentTick(720 + detentStep * 45);
      }

      setHueState(newHue);
      setSaturationState(newSat);
    },
    [compact, playDetentTick]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerCoord(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    handlePointerCoord(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  // Compute puck position in wheel wrapper coordinate space
  const wheelSize = compact ? 104 : 220;
  const wheelCenter = wheelSize / 2;
  const wheelRadius = wheelCenter - 4;

  const puckAngleRad = (hue - 90) * (Math.PI / 180);
  const puckDist = saturation * wheelRadius;
  const puckX = wheelCenter + puckDist * Math.cos(puckAngleRad);
  const puckY = wheelCenter + puckDist * Math.sin(puckAngleRad);

  const handleCopySwatch = (sw: ColorSwatch) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sw.hex);
    }
    setCopiedRole(sw.role);
    playChime(880);
    setTimeout(() => setCopiedRole(null), 1800);
    if (onCopyToken) {
      onCopyToken(sw.hex);
    }
  };

  const handleCopyAllTokens = () => {
    const tokens = generateCssTokens();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(tokens);
    }
    setCopiedRole('TOKENS');
    playChime(1040);
    setTimeout(() => setCopiedRole(null), 2000);
    if (onCopyToken) {
      onCopyToken(tokens);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`modui-cpp-root modui-cpp-variant-${variant} ${
        compact ? 'modui-cpp-compact' : ''
      } ${className}`}
      role="region"
      aria-label="Tactile Color Palette Picker"
    >
      <div className="modui-cpp-card">
        {/* Polar Wheel Canvas */}
        <div
          className="modui-cpp-wheel-wrapper"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          title="Drag to select base hue & chromatic saturation"
        >
          <canvas
            ref={canvasRef}
            className="modui-cpp-canvas"
            width={wheelSize}
            height={wheelSize}
          />

          {/* Primary Draggable Puck */}
          <div
            className="modui-cpp-puck"
            style={{
              left: `${puckX}px`,
              top: `${puckY}px`,
              backgroundColor: primary.hex,
            }}
          />

          {/* Satellite Harmony Indicator Pins */}
          {harmonySwatches.map((sw, idx) => {
              const satRad = (sw.hue - 90) * (Math.PI / 180);
              const satDist = sw.saturation * wheelRadius;
              const sx = wheelCenter + satDist * Math.cos(satRad);
              const sy = wheelCenter + satDist * Math.sin(satRad);
              return (
                <div
                  key={idx}
                  className="modui-cpp-satellite"
                  style={{
                    left: `${sx}px`,
                    top: `${sy}px`,
                    backgroundColor: sw.hex,
                  }}
                  title={`${sw.role}: ${sw.hex}`}
                />
              );
            })}
        </div>

        {/* Harmonies Selector Tabs */}
        <div className="modui-cpp-harmonies" role="tablist" aria-label="Color Harmonies">
          {(
            [
              { id: 'triadic', label: 'Triadic' },
              { id: 'complementary', label: 'Complement' },
              { id: 'analogous', label: 'Analogous' },
              { id: 'split-complementary', label: 'Split' },
              { id: 'tetradic', label: 'Tetradic' },
              { id: 'monochromatic', label: 'Mono' },
            ] as const
          ).map((harm) => (
            <button
              key={harm.id}
              type="button"
              role="tab"
              aria-selected={activeHarmony === harm.id}
              className={`modui-cpp-harmony-btn ${
                activeHarmony === harm.id ? 'active' : ''
              }`}
              onClick={() => {
                setActiveHarmony(harm.id);
                playDetentTick(880);
              }}
            >
              {harm.label}
            </button>
          ))}
        </div>

        {/* Palette Swatches Row */}
        <div className="modui-cpp-swatches" role="list" aria-label="Palette Swatches">
          {allSwatches.map((sw) => (
            <div
              key={sw.role}
              role="listitem"
              className="modui-cpp-swatch"
              style={{ backgroundColor: sw.hex }}
              onClick={() => handleCopySwatch(sw)}
              title={`Click to copy ${sw.hex}`}
            >
              <span className="modui-cpp-swatch-role">
                {copiedRole === sw.role ? 'COPIED!' : sw.role}
              </span>
              <span className="modui-cpp-swatch-hex">{sw.hex}</span>
            </div>
          ))}
        </div>

        {/* Telemetry Readout & Copy Tokens Action */}
        <div className="modui-cpp-telemetry">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="modui-cpp-wcag-badge"
              title={`Contrast with black: ${primary.contrastWithBlack}:1, with white: ${primary.contrastWithWhite}:1`}
            >
              {primary.contrastWithWhite >= 4.5 ? 'WCAG AA White' : 'WCAG AA Dark'} (
              {Math.max(primary.contrastWithWhite, primary.contrastWithBlack)}:1)
            </span>
          </div>

          <button
            type="button"
            className="modui-cpp-copy-btn"
            onClick={handleCopyAllTokens}
          >
            {copiedRole === 'TOKENS' ? '✓ Copied CSS Tokens' : '📋 Copy Tokens'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default TactileColorPalettePicker;
