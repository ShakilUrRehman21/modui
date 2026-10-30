import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './ReelTapeDeck.css';

export type ReelTapeDeckVariant = 'studio-light' | 'dark-slate' | 'warm-editorial' | 'minimal-mono';
export type TapeTransportState = 'stop' | 'play' | 'pause' | 'rewind' | 'fast-forward' | 'record';
export type TapeSpeed = '3.75' | '7.5' | '15';

export interface TapeTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  bpm?: number;
}

export interface ReelTapeDeckProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Visual finish matching platform design system (default: 'studio-light') */
  variant?: ReelTapeDeckVariant;
  /** Playlist of tape recordings */
  tracks?: TapeTrack[];
  /** Controlled active track index */
  activeTrackIndex?: number;
  /** Tape transport tape speed in inches per second (default: '15') */
  speed?: TapeSpeed;
  /** Enable synthesized mechanical clicks, capstan hum, and tape chord acoustics */
  soundEnabled?: boolean;
  /** Output monitor volume (0.0 to 1.0, default: 0.75) */
  volume?: number;
  /** Auto-start playback on mount */
  autoPlay?: boolean;
  /** Compact card preview mode for explorer catalogue cards */
  compact?: boolean;
  /** Callback fired when transport state changes */
  onTransportChange?: (state: TapeTransportState) => void;
  /** Callback fired when the active track changes */
  onTrackChange?: (track: TapeTrack, index: number) => void;
  /** Optional custom overlay child elements */
  children?: React.ReactNode;
}

export const DEFAULT_TRACK_LIST: TapeTrack[] = [
  {
    id: 'trk-01',
    title: 'Subpixel Reverie (Master A)',
    artist: 'ModUI Sound Lab',
    duration: 184,
    bpm: 78,
  },
  {
    id: 'trk-02',
    title: 'Kinetic Spring Harmonics',
    artist: 'Analog Continuum',
    duration: 216,
    bpm: 86,
  },
  {
    id: 'trk-03',
    title: 'Magnetic Flux Echoes',
    artist: 'Modular Horizon',
    duration: 195,
    bpm: 72,
  },
];

// Audio Context Singleton & Synthesizer Engine
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// 1. Heavy mechanical solenoid engagement clunk
function playSolenoidThud(isStop = false) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isStop ? 180 : 120, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.06);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.linearRampToValueAtTime(150, t + 0.06);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);

    // Micro mechanical click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(1600, t);
    clickOsc.frequency.exponentialRampToValueAtTime(400, t + 0.015);
    clickGain.gain.setValueAtTime(0.08, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.025);
  } catch {
    // Fallback
  }
}

// 2. Synthesize manual tape scrub grain
let lastScrubTime = 0;
function playScrubTone(delta: number) {
  const now = performance.now();
  if (now - lastScrubTime < 45) return;
  lastScrubTime = now;

  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const speedMod = Math.min(Math.abs(delta) * 12, 600);
    const freq = 180 + speedMod;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freq * 0.75, t + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, t);
    filter.Q.setValueAtTime(3.0, t);

    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  } catch {
    // Fallback
  }
}

export const ReelTapeDeck: React.FC<ReelTapeDeckProps> = ({
  variant = 'studio-light',
  tracks = DEFAULT_TRACK_LIST,
  activeTrackIndex: controlledTrackIndex,
  speed: initialSpeed = '15',
  soundEnabled = true,
  volume = 0.75,
  autoPlay = false,
  compact = false,
  onTransportChange,
  onTrackChange,
  children,
  className = '',
  style,
  ...rest
}) => {
  // Track selection state
  const [internalTrackIndex, setInternalTrackIndex] = useState<number>(0);
  const currentTrackIndex = controlledTrackIndex !== undefined ? controlledTrackIndex : internalTrackIndex;
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Transport State
  const [transportState, setTransportState] = useState<TapeTransportState>(autoPlay ? 'play' : 'stop');
  const [tapeSpeed, setTapeSpeed] = useState<TapeSpeed>(initialSpeed);
  const [isMuted, setIsMuted] = useState<boolean>(!soundEnabled);
  const monitorVolume = volume;

  // Playback Progress & Time
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isDraggingReel, setIsDraggingReel] = useState<boolean>(false);

  // Ballistic needle display values (smoothed for realistic VU galvanometer ballistics)
  const [vuLeftDb, setVuLeftDb] = useState<number>(-20);
  const [vuRightDb, setVuRightDb] = useState<number>(-20);
  const [isPeakLeft, setIsPeakLeft] = useState<boolean>(false);
  const [isPeakRight, setIsPeakRight] = useState<boolean>(false);

  // Reel Angles (in degrees)
  const leftAngleRef = useRef<number>(0);
  const rightAngleRef = useRef<number>(0);
  const [reelDisplayAngles, setReelDisplayAngles] = useState<{ left: number; right: number }>({ left: 0, right: 0 });

  // Web Audio Synth Nodes Ref for musical chord pad and capstan motor
  const synthNodesRef = useRef<{
    motorOsc?: OscillatorNode;
    motorGain?: GainNode;
    masterGain?: GainNode;
    chordOscs?: OscillatorNode[];
    chordGains?: GainNode[];
    flutterLfo?: OscillatorNode;
  }>({});

  // Mechanical 4-Digit Counter Ref
  const counterRef = useRef<number>(0);
  const [counterDisplay, setCounterDisplay] = useState<string>('0000');

  // Dragging state ref
  const dragStartRef = useRef<{ startX: number; startAngle: number; reel: 'left' | 'right' }>({
    startX: 0,
    startAngle: 0,
    reel: 'left',
  });

  // Calculate pack thicknesses based on progress (0 to 1)
  const progressRatio = useMemo(() => {
    if (!currentTrack || currentTrack.duration <= 0) return 0;
    return Math.min(Math.max(currentTimeSec / currentTrack.duration, 0), 1);
  }, [currentTimeSec, currentTrack]);

  // Physics: Left reel starts thick and gets thin; Right reel starts thin and gets thick
  // Outer radius: 46px, Hub radius: 20px
  const leftPackRadius = useMemo(() => {
    return Math.sqrt(46 * 46 - progressRatio * (46 * 46 - 20 * 20));
  }, [progressRatio]);

  const rightPackRadius = useMemo(() => {
    return Math.sqrt(20 * 20 + progressRatio * (46 * 46 - 20 * 20));
  }, [progressRatio]);

  // Audio Engine Lifecycle
  const stopSynthSounds = useCallback(() => {
    try {
      const { motorOsc, chordOscs, chordGains, motorGain } = synthNodesRef.current;
      if (motorGain) motorGain.gain.setValueAtTime(0.0001, audioCtx?.currentTime || 0);
      if (motorOsc) {
        motorOsc.stop();
        motorOsc.disconnect();
      }
      chordOscs?.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      chordGains?.forEach((g) => g.disconnect());
      synthNodesRef.current = {};
    } catch {
      // Ignore
    }
  }, []);

  const startSynthSounds = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      stopSynthSounds();
      const t = ctx.currentTime;

      // 1. Capstan Motor Hum (60Hz with soft harmonic)
      const motorOsc = ctx.createOscillator();
      const motorGain = ctx.createGain();
      const motorFilter = ctx.createBiquadFilter();

      motorOsc.type = 'triangle';
      const baseMotorFreq = tapeSpeed === '15' ? 68 : tapeSpeed === '7.5' ? 52 : 38;
      motorOsc.frequency.setValueAtTime(baseMotorFreq, t);

      motorFilter.type = 'lowpass';
      motorFilter.frequency.setValueAtTime(140, t);

      motorGain.gain.setValueAtTime(0.001, t);
      motorGain.gain.linearRampToValueAtTime(0.018 * monitorVolume, t + 0.1);

      motorOsc.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(ctx.destination);
      motorOsc.start(t);

      // 2. Analog Lo-Fi Tape Harmonic Chord (Warm ambient chords with wow & flutter)
      const rootNotes = [174.61, 220.0, 261.63, 329.63]; // F3, A3, C4, E4 (Fmaj7 ambient tape chord)
      const chordOscs: OscillatorNode[] = [];
      const chordGains: GainNode[] = [];

      // Wow & Flutter LFO (0.35 Hz sinusoidal micro-pitch modulation)
      const flutterLfo = ctx.createOscillator();
      const flutterGain = ctx.createGain();
      flutterLfo.frequency.setValueAtTime(0.35, t);
      flutterGain.gain.setValueAtTime(1.8, t); // 1.8 Hz subtle pitch warble
      flutterLfo.connect(flutterGain);
      flutterLfo.start(t);

      rootNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        flutterGain.connect(osc.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, t); // Warm tape saturation rolloff

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime((0.022 / rootNotes.length) * monitorVolume, t + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);

        chordOscs.push(osc);
        chordGains.push(gain);
      });

      synthNodesRef.current = {
        motorOsc,
        motorGain,
        chordOscs,
        chordGains,
        flutterLfo,
      };
    } catch {
      // Fallback
    }
  }, [isMuted, monitorVolume, tapeSpeed, stopSynthSounds]);

  // Handle transport state change
  const setTransport = useCallback(
    (newState: TapeTransportState) => {
      setTransportState(newState);

      if (!isMuted) {
        if (newState === 'stop') {
          playSolenoidThud(true);
        } else {
          playSolenoidThud(false);
        }
      }

      if (newState === 'play') {
        startSynthSounds();
      } else {
        stopSynthSounds();
      }

      if (onTransportChange) {
        onTransportChange(newState);
      }
    },
    [isMuted, startSynthSounds, stopSynthSounds, onTransportChange]
  );

  // Sync sounds when mute/volume/speed changes
  useEffect(() => {
    if (transportState === 'play') {
      startSynthSounds();
    } else {
      stopSynthSounds();
    }
    return () => stopSynthSounds();
  }, [isMuted, monitorVolume, tapeSpeed, transportState, startSynthSounds, stopSynthSounds]);

  // Main Animation and Physics Frame Loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    // VU meter ballistic velocities
    let vuLeftVel = 0;
    let vuRightVel = 0;
    let curVuLeft = -20;
    let curVuRight = -20;

    const frameLoop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      // 1. Transport movement physics
      let speedMultiplier = 0;
      if (transportState === 'play' || transportState === 'record') {
        const speedScale = tapeSpeed === '15' ? 1.0 : tapeSpeed === '7.5' ? 0.65 : 0.4;
        speedMultiplier = speedScale;
      } else if (transportState === 'fast-forward') {
        speedMultiplier = 4.2;
      } else if (transportState === 'rewind') {
        speedMultiplier = -4.2;
      }

      if (speedMultiplier !== 0) {
        // Advance current playback time
        setCurrentTimeSec((prev) => {
          const next = prev + dt * speedMultiplier;
          if (next >= (currentTrack?.duration || 180)) {
            setTransport('stop');
            return currentTrack?.duration || 180;
          }
          if (next <= 0) {
            setTransport('stop');
            return 0;
          }
          return next;
        });

        // Angular velocities based on dynamic spool radii (v = omega * r => omega = v / r)
        const tapeLinearSpeed = 38 * speedMultiplier; // pixels per second
        const omegaLeft = (tapeLinearSpeed / leftPackRadius) * (180 / Math.PI);
        const omegaRight = (tapeLinearSpeed / rightPackRadius) * (180 / Math.PI);

        leftAngleRef.current = (leftAngleRef.current + omegaLeft * dt) % 360;
        rightAngleRef.current = (rightAngleRef.current + omegaRight * dt) % 360;

        setReelDisplayAngles({
          left: leftAngleRef.current,
          right: rightAngleRef.current,
        });

        // Advance mechanical 4-digit odometer counter
        counterRef.current = Math.max(0, counterRef.current + dt * speedMultiplier * 14);
        const formatted = String(Math.floor(counterRef.current) % 10000).padStart(4, '0');
        setCounterDisplay(formatted);
      }

      // 2. Ballistic Galvano VU Meter Dynamics
      // Standard audio VU integration: 300ms rise time with realistic overshoot
      let targetDbLeft = -20;
      let targetDbRight = -20;

      if (transportState === 'play' || transportState === 'record') {
        const rhythmFreq = (currentTrack?.bpm || 80) / 60;
        const beatPulse = Math.sin(timestamp * 0.001 * rhythmFreq * Math.PI * 2);
        const microNoise = Math.sin(timestamp * 0.007) * 0.15 + (Math.random() - 0.5) * 0.1;

        const dynamicLevel = (Math.max(0, beatPulse * 0.75 + 0.35) + microNoise) * monitorVolume;
        // Map [0, 1] to [-20 dB, +3 dB]
        targetDbLeft = -20 + dynamicLevel * 22;
        targetDbRight = -20 + (dynamicLevel * 0.92 + (Math.random() - 0.5) * 0.15) * 22;
      } else if (transportState === 'fast-forward' || transportState === 'rewind') {
        targetDbLeft = -10 + (Math.random() - 0.5) * 3;
        targetDbRight = -11 + (Math.random() - 0.5) * 3;
      }

      // Spring-mass ballistic damping simulation
      const kSpring = 42;
      const kDamp = 8.5;

      const forceLeft = (targetDbLeft - curVuLeft) * kSpring - vuLeftVel * kDamp;
      vuLeftVel += forceLeft * dt;
      curVuLeft += vuLeftVel * dt;

      const forceRight = (targetDbRight - curVuRight) * kSpring - vuRightVel * kDamp;
      vuRightVel += forceRight * dt;
      curVuRight += vuRightVel * dt;

      // Clamp to meter mechanical physical stops (-20 dB to +3.5 dB)
      curVuLeft = Math.max(-20, Math.min(3.5, curVuLeft));
      curVuRight = Math.max(-20, Math.min(3.5, curVuRight));

      setVuLeftDb(curVuLeft);
      setVuRightDb(curVuRight);
      setIsPeakLeft(curVuLeft >= 0);
      setIsPeakRight(curVuRight >= 0);

      animId = requestAnimationFrame(frameLoop);
    };

    animId = requestAnimationFrame(frameLoop);
    return () => cancelAnimationFrame(animId);
  }, [transportState, tapeSpeed, currentTrack, leftPackRadius, rightPackRadius, monitorVolume, setTransport]);

  // Manual Reel Scrubbing Interaction
  const handleReelPointerDown = (e: React.PointerEvent, reel: 'left' | 'right') => {
    setIsDraggingReel(true);
    dragStartRef.current = {
      startX: e.clientX,
      startAngle: reel === 'left' ? leftAngleRef.current : rightAngleRef.current,
      reel,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleReelPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingReel) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const scrubAngle = deltaX * 1.2;

    // Apply scrub angle
    if (dragStartRef.current.reel === 'left') {
      leftAngleRef.current = (dragStartRef.current.startAngle + scrubAngle) % 360;
      rightAngleRef.current = (rightAngleRef.current + scrubAngle * 0.9) % 360;
    } else {
      rightAngleRef.current = (dragStartRef.current.startAngle + scrubAngle) % 360;
      leftAngleRef.current = (leftAngleRef.current + scrubAngle * 1.1) % 360;
    }

    setReelDisplayAngles({
      left: leftAngleRef.current,
      right: rightAngleRef.current,
    });

    // Advance/Rewind time with drag
    setCurrentTimeSec((prev) => {
      const next = prev + deltaX * 0.08;
      return Math.min(Math.max(next, 0), currentTrack?.duration || 180);
    });

    // Play tape head audio scrub
    if (!isMuted) {
      playScrubTone(deltaX);
    }
  };

  const handleReelPointerUp = (e: React.PointerEvent) => {
    setIsDraggingReel(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Convert dB to rotation angle for needle (-42deg at -20dB to +42deg at +3dB)
  const dbToAngle = (db: number) => {
    const clamped = Math.max(-20, Math.min(3, db));
    // Linear interpolation between -20dB and +3dB
    const norm = (clamped + 20) / 23;
    return -42 + norm * 84;
  };

  // Track selection
  const handleSelectTrack = (index: number) => {
    setInternalTrackIndex(index);
    setCurrentTimeSec(0);
    counterRef.current = 0;
    setCounterDisplay('0000');
    if (onTrackChange) {
      onTrackChange(tracks[index], index);
    }
    if (transportState === 'play') {
      startSynthSounds();
    }
  };

  // Reset mechanical counter
  const handleResetCounter = () => {
    counterRef.current = 0;
    setCounterDisplay('0000');
    if (!isMuted) {
      playSolenoidThud(true);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (transportState === 'play') {
        setTransport('pause');
      } else {
        setTransport('play');
      }
    } else if (e.key === 'Escape') {
      setTransport('stop');
    } else if (e.key === 'ArrowRight') {
      setTransport('fast-forward');
    } else if (e.key === 'ArrowLeft') {
      setTransport('rewind');
    } else if (e.key === 'r' || e.key === 'R') {
      setTransport(transportState === 'record' ? 'stop' : 'record');
    }
  };

  // Format time MM:SS
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      className={`modui-reel-deck modui-reel-deck--${variant} ${compact ? 'modui-reel-deck--compact' : ''} ${className}`}
      style={style}
      role="region"
      aria-label="Analog Studio Reel-to-Reel Tape Deck"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {/* 1. Header Bar: Studio Brand & Speed Select */}
      <div className="modui-tape-header">
        <div className="modui-tape-brand">
          <span className="modui-tape-brand__badge">STUDIO DECK</span>
          <span className="modui-tape-brand__model">MODUI RT-1500 MASTERING CONSOLE</span>
        </div>

        <div className="modui-tape-top-controls">
          {/* Speed Selector */}
          <div className="modui-tape-speed-toggle" role="group" aria-label="Tape Speed (IPS)">
            {(['3.75', '7.5', '15'] as TapeSpeed[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`modui-tape-speed-btn ${tapeSpeed === s ? 'modui-tape-speed-btn--active' : ''}`}
                onClick={() => setTapeSpeed(s)}
                title={`Set Tape Speed to ${s} Inches Per Second`}
              >
                {s} IPS
              </button>
            ))}
          </div>

          {/* Audio Mute/Unmute */}
          <button
            type="button"
            className={`modui-tape-audio-btn ${!isMuted ? 'modui-tape-audio-btn--active' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute Synthesized Tape Audio' : 'Mute Synthesized Tape Audio'}
            aria-label={isMuted ? 'Unmute Synthesized Tape Audio' : 'Mute Synthesized Tape Audio'}
          >
            {!isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Tape Bay: Dual Spools & Head Block */}
      <div className="modui-tape-bay">
        {/* Dynamic SVG Tape Ribbon Bridge */}
        <svg className="modui-tape-ribbon-svg" aria-hidden="true" viewBox="0 0 600 240" preserveAspectRatio="none">
          {/* Real-time Tape Ribbon Path linking supply reel, tension arm, heads, and take-up reel */}
          <path
            d={`M ${150 + leftPackRadius * 0.7} ${120 + leftPackRadius * 0.7} 
               Q 230 190, 270 195 
               L 330 195 
               Q 370 190, ${450 - rightPackRadius * 0.7} ${120 + rightPackRadius * 0.7}`}
            className={`modui-tape-path ${transportState === 'play' ? 'modui-tape-path--running' : ''}`}
          />
        </svg>

        {/* Left Spool: Supply Reel */}
        <div
          className={`modui-tape-reel modui-tape-reel--left ${isDraggingReel ? 'modui-tape-reel--dragging' : ''}`}
          style={{ transform: `rotate(${reelDisplayAngles.left}deg)` }}
          onPointerDown={(e) => handleReelPointerDown(e, 'left')}
          onPointerMove={handleReelPointerMove}
          onPointerUp={handleReelPointerUp}
          title="Supply Reel (Drag to manual scrub)"
          role="slider"
          aria-label="Supply Tape Reel"
          aria-valuenow={Math.round((1 - progressRatio) * 100)}
          tabIndex={0}
        >
          {/* Reel Outer Rim Flange */}
          <div className="modui-tape-reel__flange">
            {/* Magnetic Tape Ribbon Wound Pack */}
            <div
              className="modui-tape-reel__pack"
              style={{ width: `${leftPackRadius * 2}%`, height: `${leftPackRadius * 2}%` }}
            />
            {/* 3 Anodized CNC Spoke Cutouts */}
            <div className="modui-tape-reel__spoke modui-tape-reel__spoke--1" />
            <div className="modui-tape-reel__spoke modui-tape-reel__spoke--2" />
            <div className="modui-tape-reel__spoke modui-tape-reel__spoke--3" />
            {/* Center Spindle & Metal Locking Knob */}
            <div className="modui-tape-reel__hub">
              <div className="modui-tape-reel__center-pin" />
            </div>
          </div>
        </div>

        {/* Center Head Block & Mechanical Roller Assembly */}
        <div className="modui-tape-heads">
          <div className="modui-tape-heads__plate">
            {/* Tension Guide Rollers */}
            <div className={`modui-tape-roller modui-tape-roller--left ${transportState === 'play' ? 'modui-tape-roller--spinning' : ''}`} />
            {/* Magnetic Head Housing */}
            <div className="modui-tape-head-unit">
              <div className="modui-tape-head modui-tape-head--erase" title="Erase Head" />
              <div className="modui-tape-head modui-tape-head--record" title="Record Head" />
              <div className="modui-tape-head modui-tape-head--play" title="Playback Head" />
            </div>
            {/* Capstan Shaft & Rubber Pinch Roller */}
            <div className={`modui-tape-capstan ${transportState === 'play' ? 'modui-tape-capstan--engaged' : ''}`}>
              <div className="modui-tape-capstan__shaft" />
              <div className="modui-tape-capstan__roller" />
            </div>
            <div className={`modui-tape-roller modui-tape-roller--right ${transportState === 'play' ? 'modui-tape-roller--spinning' : ''}`} />
          </div>
          <div className="modui-tape-heads__label">PRECISION TAPE HEAD ASSEMBLY</div>
        </div>

        {/* Right Spool: Take-Up Reel */}
        <div
          className={`modui-tape-reel modui-tape-reel--right ${isDraggingReel ? 'modui-tape-reel--dragging' : ''}`}
          style={{ transform: `rotate(${reelDisplayAngles.right}deg)` }}
          onPointerDown={(e) => handleReelPointerDown(e, 'right')}
          onPointerMove={handleReelPointerMove}
          onPointerUp={handleReelPointerUp}
          title="Take-Up Reel (Drag to manual scrub)"
          role="slider"
          aria-label="Take-Up Tape Reel"
          aria-valuenow={Math.round(progressRatio * 100)}
          tabIndex={0}
        >
          <div className="modui-tape-reel__flange">
            <div
              className="modui-tape-reel__pack"
              style={{ width: `${rightPackRadius * 2}%`, height: `${rightPackRadius * 2}%` }}
            />
            <div className="modui-tape-reel__spoke modui-tape-reel__spoke--1" />
            <div className="modui-tape-reel__spoke modui-tape-reel__spoke--2" />
            <div className="modui-tape-reel__spoke modui-tape-reel__spoke--3" />
            <div className="modui-tape-reel__hub">
              <div className="modui-tape-reel__center-pin" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lower Console: Twin Ballistic VU Meters & Mechanical Counter */}
      <div className="modui-tape-console">
        {/* Twin VU Meters Block */}
        <div className="modui-tape-vu-container">
          {/* Channel L */}
          <div className="modui-tape-vu-meter" aria-label={`Channel 1 VU Level: ${Math.round(vuLeftDb)} dB`}>
            <div className="modui-tape-vu-meter__top">
              <span className="modui-tape-vu-meter__channel">CH 1 // L</span>
              <span className={`modui-tape-vu-peak ${isPeakLeft ? 'modui-tape-vu-peak--active' : ''}`}>PEAK</span>
            </div>
            <div className="modui-tape-vu-meter__dial">
              {/* Scale Arc Graphics */}
              <div className="modui-tape-vu-scale">
                <span className="modui-tape-vu-mark modui-tape-vu-mark--20">-20</span>
                <span className="modui-tape-vu-mark modui-tape-vu-mark--10">-10</span>
                <span className="modui-tape-vu-mark modui-tape-vu-mark--5">-5</span>
                <span className="modui-tape-vu-mark modui-tape-vu-mark--0">0</span>
                <span className="modui-tape-vu-mark modui-tape-vu-mark--3">+3</span>
              </div>
              {/* Ballistic Needle */}
              <div
                className="modui-tape-vu-needle"
                style={{ transform: `rotate(${dbToAngle(vuLeftDb)}deg)` }}
              />
              <div className="modui-tape-vu-pivot" />
            </div>
          </div>

          {/* Channel R */}
          <div className="modui-tape-vu-meter" aria-label={`Channel 2 VU Level: ${Math.round(vuRightDb)} dB`}>
            <div className="modui-tape-vu-meter__top">
              <span className="modui-tape-vu-meter__channel">CH 2 // R</span>
              <span className={`modui-tape-vu-peak ${isPeakRight ? 'modui-tape-vu-peak--active' : ''}`}>PEAK</span>
            </div>
            <div className="modui-tape-vu-meter__dial">
              <div className="modui-tape-vu-scale">
                <span className="modui-tape-vu-mark modui-tape-vu-mark--20">-20</span>
                <span className="modui-tape-vu-mark modui-tape-vu-mark--10">-10</span>
                <span className="modui-tape-vu-mark modui-tape-vu-mark--5">-5</span>
                <span className="modui-tape-vu-mark modui-tape-vu-mark--0">0</span>
                <span className="modui-tape-vu-mark modui-tape-vu-mark--3">+3</span>
              </div>
              <div
                className="modui-tape-vu-needle"
                style={{ transform: `rotate(${dbToAngle(vuRightDb)}deg)` }}
              />
              <div className="modui-tape-vu-pivot" />
            </div>
          </div>
        </div>

        {/* Center Status, Tape Counter, & Track Dymo Tape */}
        <div className="modui-tape-telemetry">
          {/* Mechanical 4-Digit Odometer Counter */}
          <div className="modui-tape-counter-box">
            <span className="modui-tape-counter-digits" aria-live="off">
              {counterDisplay}
            </span>
            <button
              type="button"
              className="modui-tape-counter-reset"
              onClick={handleResetCounter}
              title="Reset tape counter to 0000"
            >
              RESET
            </button>
          </div>

          {/* Track Label Card */}
          <div className="modui-tape-track-label">
            <div className="modui-tape-track-title">{currentTrack.title}</div>
            <div className="modui-tape-track-artist">{currentTrack.artist}</div>
            <div className="modui-tape-track-time">
              {formatTime(currentTimeSec)} / {formatTime(currentTrack.duration)}
            </div>
          </div>

          {/* Track Selector Tabs */}
          <div className="modui-tape-track-selector">
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                className={`modui-tape-track-btn ${idx === currentTrackIndex ? 'modui-tape-track-btn--active' : ''}`}
                onClick={() => handleSelectTrack(idx)}
              >
                TK {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Piano-Key Transport Bar */}
      <div className="modui-tape-transport" role="toolbar" aria-label="Tape Transport Controls">
        <button
          type="button"
          className={`modui-tape-key ${transportState === 'rewind' ? 'modui-tape-key--active' : ''}`}
          onClick={() => setTransport(transportState === 'rewind' ? 'stop' : 'rewind')}
          title="Rewind (ArrowLeft)"
          aria-label="Rewind"
        >
          <span className="modui-tape-key__icon">◀◀</span>
          <span className="modui-tape-key__label">REW</span>
        </button>

        <button
          type="button"
          className={`modui-tape-key ${transportState === 'stop' ? 'modui-tape-key--active' : ''}`}
          onClick={() => setTransport('stop')}
          title="Stop Transport (Escape)"
          aria-label="Stop Transport"
        >
          <span className="modui-tape-key__icon">■</span>
          <span className="modui-tape-key__label">STOP</span>
        </button>

        <button
          type="button"
          className={`modui-tape-key ${transportState === 'pause' ? 'modui-tape-key--active' : ''}`}
          onClick={() => setTransport(transportState === 'pause' ? 'play' : 'pause')}
          title="Pause (Space)"
          aria-label="Pause"
        >
          <span className="modui-tape-key__icon">❚❚</span>
          <span className="modui-tape-key__label">PAUSE</span>
        </button>

        <button
          type="button"
          className={`modui-tape-key modui-tape-key--play ${transportState === 'play' ? 'modui-tape-key--active' : ''}`}
          onClick={() => setTransport(transportState === 'play' ? 'pause' : 'play')}
          title="Play (Space)"
          aria-label="Play"
        >
          <span className="modui-tape-key__icon">▶</span>
          <span className="modui-tape-key__label">PLAY</span>
        </button>

        <button
          type="button"
          className={`modui-tape-key ${transportState === 'fast-forward' ? 'modui-tape-key--active' : ''}`}
          onClick={() => setTransport(transportState === 'fast-forward' ? 'stop' : 'fast-forward')}
          title="Fast Forward (ArrowRight)"
          aria-label="Fast Forward"
        >
          <span className="modui-tape-key__icon">▶▶</span>
          <span className="modui-tape-key__label">FFWD</span>
        </button>

        <button
          type="button"
          className={`modui-tape-key modui-tape-key--rec ${transportState === 'record' ? 'modui-tape-key--active' : ''}`}
          onClick={() => setTransport(transportState === 'record' ? 'stop' : 'record')}
          title="Arm Record (R)"
          aria-label="Record"
        >
          <span className="modui-tape-key__rec-dot" />
          <span className="modui-tape-key__label">REC</span>
        </button>
      </div>

      {children}
    </div>
  );
};
