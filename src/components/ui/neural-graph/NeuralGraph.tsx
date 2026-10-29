import React, { useRef, useEffect, useState, useCallback } from 'react';
import './NeuralGraph.css';

export type NeuralGraphVariant = 'studio-light' | 'dark-slate' | 'warm-editorial' | 'quantum-violet';

export type NodeCluster = 'perception' | 'embedding' | 'reasoning' | 'executive' | 'memory';

export interface NeuralNode {
  id: string;
  label: string;
  cluster: NodeCluster;
  value?: number; // 0.0 to 1.0 activation level
  radius?: number;
  fixed?: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface NeuralEdge {
  source: string;
  target: string;
  weight?: number; // 0.2 to 1.0 connection strength
}

export interface SynapticPulse {
  id: string;
  sourceId: string;
  targetId: string;
  progress: number; // 0.0 to 1.0
  speed: number;
  color: string;
}

export interface NeuralGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual surface theme and accent palette (default: 'studio-light') */
  variant?: NeuralGraphVariant;
  /** Custom nodes array */
  nodes?: NeuralNode[];
  /** Custom edges array */
  edges?: NeuralEdge[];
  /** Controlled selected node identifier */
  selectedNodeId?: string;
  /** Callback fired when a node is selected */
  onSelectNode?: (node: NeuralNode | null) => void;
  /** Callback fired when a synaptic action potential fires */
  onFireSynapse?: (sourceId: string, targetId: string) => void;
  /** Enable mouse hover magnetism, drag physics, and pan/zoom */
  interactive?: boolean;
  /** Synthesize acoustic resonance and electrical discharge ticks via Web Audio API */
  soundEnabled?: boolean;
  /** Automatically fire subtle ambient pulses across connected nodes */
  autoPulse?: boolean;
  /** Display floating telemetry HUD and interaction controls */
  showControls?: boolean;
  /** Display floating inspector card for selected node */
  showInspector?: boolean;
  /** Compact preview mode optimized for catalogue cards */
  compact?: boolean;
  /** Optional custom overlay child elements */
  children?: React.ReactNode;
}

// Default Neural Graph Dataset: Cognitive Inference Engine
export const DEFAULT_NEURAL_NODES: NeuralNode[] = [
  { id: 'n-in1', label: 'Sensory Intake', cluster: 'perception', value: 0.95 },
  { id: 'n-in2', label: 'Visual Stream', cluster: 'perception', value: 0.88 },
  { id: 'n-in3', label: 'Acoustic Buffer', cluster: 'perception', value: 0.72 },
  { id: 'n-emb1', label: 'Latent Projection', cluster: 'embedding', value: 0.85 },
  { id: 'n-emb2', label: 'Cross-Attention', cluster: 'embedding', value: 0.92 },
  { id: 'n-emb3', label: 'Vector Quantizer', cluster: 'embedding', value: 0.68 },
  { id: 'n-mem1', label: 'Working Cache', cluster: 'memory', value: 0.81 },
  { id: 'n-mem2', label: 'Episodic Weights', cluster: 'memory', value: 0.76 },
  { id: 'n-rsn1', label: 'Semantic Nexus', cluster: 'reasoning', value: 0.98 },
  { id: 'n-rsn2', label: 'Inference Engine', cluster: 'reasoning', value: 0.91 },
  { id: 'n-rsn3', label: 'Hypothesis Filter', cluster: 'reasoning', value: 0.84 },
  { id: 'n-exe1', label: 'Policy Dispatch', cluster: 'executive', value: 0.89 },
  { id: 'n-exe2', label: 'Motor Actuator', cluster: 'executive', value: 0.74 },
  { id: 'n-exe3', label: 'Feedback Loop', cluster: 'executive', value: 0.82 },
];

export const DEFAULT_NEURAL_EDGES: NeuralEdge[] = [
  { source: 'n-in1', target: 'n-emb1', weight: 0.9 },
  { source: 'n-in2', target: 'n-emb1', weight: 0.85 },
  { source: 'n-in2', target: 'n-emb2', weight: 0.75 },
  { source: 'n-in3', target: 'n-emb2', weight: 0.8 },
  { source: 'n-emb1', target: 'n-rsn1', weight: 0.95 },
  { source: 'n-emb2', target: 'n-rsn1', weight: 0.9 },
  { source: 'n-emb2', target: 'n-rsn2', weight: 0.8 },
  { source: 'n-emb3', target: 'n-mem1', weight: 0.7 },
  { source: 'n-mem1', target: 'n-rsn2', weight: 0.85 },
  { source: 'n-mem2', target: 'n-rsn3', weight: 0.75 },
  { source: 'n-rsn1', target: 'n-rsn2', weight: 0.9 },
  { source: 'n-rsn2', target: 'n-rsn3', weight: 0.85 },
  { source: 'n-rsn1', target: 'n-exe1', weight: 0.95 },
  { source: 'n-rsn2', target: 'n-exe1', weight: 0.88 },
  { source: 'n-rsn3', target: 'n-exe2', weight: 0.82 },
  { source: 'n-exe1', target: 'n-exe2', weight: 0.75 },
  { source: 'n-exe2', target: 'n-exe3', weight: 0.9 },
  { source: 'n-exe3', target: 'n-mem1', weight: 0.65 },
  { source: 'n-exe3', target: 'n-in1', weight: 0.5 },
];

// Color Palettes & Visual Tokens for Themes
interface ThemePalette {
  bg: string;
  gridDot: string;
  nodeHalo: string;
  edgeBase: string;
  edgeActive: string;
  textPrimary: string;
  textSecondary: string;
  hudBg: string;
  hudBorder: string;
  clusters: Record<NodeCluster, { color: string; glow: string; label: string }>;
}

const THEME_PALETTES: Record<NeuralGraphVariant, ThemePalette> = {
  'studio-light': {
    bg: '#F8F7F2',
    gridDot: 'rgba(32, 32, 30, 0.08)',
    nodeHalo: 'rgba(54, 92, 245, 0.12)',
    edgeBase: 'rgba(32, 32, 30, 0.14)',
    edgeActive: 'rgba(54, 92, 245, 0.85)',
    textPrimary: '#20201E',
    textSecondary: '#696963',
    hudBg: 'rgba(255, 255, 255, 0.88)',
    hudBorder: '#E4E1D9',
    clusters: {
      perception: { color: '#365CF5', glow: 'rgba(54, 92, 245, 0.28)', label: 'Perception' },
      embedding: { color: '#7C3AED', glow: 'rgba(124, 58, 237, 0.28)', label: 'Embedding' },
      reasoning: { color: '#059669', glow: 'rgba(5, 150, 105, 0.28)', label: 'Reasoning' },
      executive: { color: '#FF735E', glow: 'rgba(255, 115, 94, 0.28)', label: 'Executive' },
      memory: { color: '#D97706', glow: 'rgba(217, 119, 6, 0.28)', label: 'Memory' },
    },
  },
  'dark-slate': {
    bg: '#0F1219',
    gridDot: 'rgba(255, 255, 255, 0.07)',
    nodeHalo: 'rgba(56, 189, 248, 0.16)',
    edgeBase: 'rgba(255, 255, 255, 0.12)',
    edgeActive: 'rgba(56, 189, 248, 0.9)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    hudBg: 'rgba(15, 18, 25, 0.85)',
    hudBorder: 'rgba(255, 255, 255, 0.12)',
    clusters: {
      perception: { color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.38)', label: 'Perception' },
      embedding: { color: '#A78BFA', glow: 'rgba(167, 139, 250, 0.38)', label: 'Embedding' },
      reasoning: { color: '#34D399', glow: 'rgba(52, 211, 153, 0.38)', label: 'Reasoning' },
      executive: { color: '#FB7185', glow: 'rgba(251, 113, 133, 0.38)', label: 'Executive' },
      memory: { color: '#FBBF24', glow: 'rgba(251, 191, 36, 0.38)', label: 'Memory' },
    },
  },
  'warm-editorial': {
    bg: '#F5F2EB',
    gridDot: 'rgba(40, 36, 32, 0.09)',
    nodeHalo: 'rgba(255, 115, 94, 0.14)',
    edgeBase: 'rgba(40, 36, 32, 0.15)',
    edgeActive: 'rgba(255, 115, 94, 0.85)',
    textPrimary: '#282420',
    textSecondary: '#7A746B',
    hudBg: 'rgba(250, 248, 243, 0.9)',
    hudBorder: '#E8E2D5',
    clusters: {
      perception: { color: '#C2410C', glow: 'rgba(194, 65, 12, 0.28)', label: 'Perception' },
      embedding: { color: '#B45309', glow: 'rgba(180, 83, 9, 0.28)', label: 'Embedding' },
      reasoning: { color: '#047857', glow: 'rgba(4, 120, 87, 0.28)', label: 'Reasoning' },
      executive: { color: '#E11D48', glow: 'rgba(225, 29, 72, 0.28)', label: 'Executive' },
      memory: { color: '#D97706', glow: 'rgba(217, 119, 6, 0.28)', label: 'Memory' },
    },
  },
  'quantum-violet': {
    bg: '#0A0914',
    gridDot: 'rgba(168, 85, 247, 0.12)',
    nodeHalo: 'rgba(168, 85, 247, 0.22)',
    edgeBase: 'rgba(255, 255, 255, 0.1)',
    edgeActive: 'rgba(192, 132, 252, 0.95)',
    textPrimary: '#FAF5FF',
    textSecondary: '#C084FC',
    hudBg: 'rgba(10, 9, 20, 0.85)',
    hudBorder: 'rgba(168, 85, 247, 0.25)',
    clusters: {
      perception: { color: '#818CF8', glow: 'rgba(129, 140, 248, 0.4)', label: 'Perception' },
      embedding: { color: '#C084FC', glow: 'rgba(192, 132, 252, 0.45)', label: 'Embedding' },
      reasoning: { color: '#2DD4BF', glow: 'rgba(45, 212, 191, 0.4)', label: 'Reasoning' },
      executive: { color: '#F472B6', glow: 'rgba(244, 114, 182, 0.42)', label: 'Executive' },
      memory: { color: '#FBBF24', glow: 'rgba(251, 191, 36, 0.4)', label: 'Memory' },
    },
  },
};

// Web Audio Synthesizer for Micro-Tonal Chimes & Synaptic Sparks
let audioCtx: AudioContext | null = null;
let lastAudioTick = 0;

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

function playNodeHoverChime(cluster: NodeCluster) {
  const now = performance.now();
  if (now - lastAudioTick < 50) return;
  lastAudioTick = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Resonant chime pitch based on functional cluster
    const clusterPitches: Record<NodeCluster, number> = {
      perception: 440,
      embedding: 554.37, // C#5
      reasoning: 659.25, // E5
      executive: 783.99, // G5
      memory: 523.25,    // C5
    };
    const freq = clusterPitches[cluster] || 440;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.12);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  } catch {
    // Graceful fallback
  }
}

function playSynapseDischarge() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    // Dual oscillator synthesized action potential spark
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(880, t);
    osc1.frequency.exponentialRampToValueAtTime(220, t + 0.14);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, t);
    osc2.frequency.exponentialRampToValueAtTime(330, t + 0.12);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.065, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.18);
    osc2.stop(t + 0.18);
  } catch {
    // Fallback
  }
}

function playReleaseDetent() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);

    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  } catch {
    // Fallback
  }
}

export const NeuralGraph: React.FC<NeuralGraphProps> = ({
  variant = 'studio-light',
  nodes: customNodes,
  edges: customEdges,
  selectedNodeId: controlledSelectedId,
  onSelectNode,
  onFireSynapse,
  interactive = true,
  soundEnabled = true,
  autoPulse = true,
  showControls = true,
  showInspector = true,
  compact = false,
  children,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Internal selection state (supports controlled or uncontrolled)
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  // Active cluster filter state
  const [activeClusterFilter, setActiveClusterFilter] = useState<NodeCluster | 'all'>('all');

  // Interactive metrics for telemetry HUD
  const [synapsePulseCount, setSynapsePulseCount] = useState<number>(0);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(soundEnabled);

  // Helper function to build initial positioned nodes
  const buildInitialNodes = useCallback((rawNodes: NeuralNode[]) => {
    const clusterAngles: Record<NodeCluster, { baseAngle: number; radius: number }> = {
      perception: { baseAngle: -Math.PI * 0.75, radius: 140 },
      embedding: { baseAngle: -Math.PI * 0.25, radius: 95 },
      reasoning: { baseAngle: 0, radius: 40 },
      executive: { baseAngle: Math.PI * 0.45, radius: 150 },
      memory: { baseAngle: Math.PI * 0.85, radius: 120 },
    };

    const clusterCounters: Record<string, number> = {};

    return rawNodes.map((node) => {
      const clusterInfo = clusterAngles[node.cluster] || { baseAngle: 0, radius: 100 };
      const count = clusterCounters[node.cluster] || 0;
      clusterCounters[node.cluster] = count + 1;

      const angleOffset = (count - 1) * 0.45;
      const angle = clusterInfo.baseAngle + angleOffset;
      const r = clusterInfo.radius + (count % 2 === 0 ? 25 : -15);

      return {
        ...node,
        x: node.x !== undefined ? node.x : Math.cos(angle) * r,
        y: node.y !== undefined ? node.y : Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        radius: node.radius || (node.cluster === 'reasoning' ? 14 : 11),
        pulseWave: 0,
      };
    });
  }, []);

  const initialNodes = customNodes || DEFAULT_NEURAL_NODES;
  const initialEdges = customEdges || DEFAULT_NEURAL_EDGES;

  // Simulation state refs initialized synchronously
  const simNodesRef = useRef<(NeuralNode & { x: number; y: number; vx: number; vy: number; radius: number; pulseWave?: number })[]>(
    buildInitialNodes(initialNodes)
  );
  const simEdgesRef = useRef<NeuralEdge[]>([...initialEdges]);
  const pulsesRef = useRef<SynapticPulse[]>([]);
  const hoveredNodeRef = useRef<string | null>(null);
  const draggedNodeRef = useRef<string | null>(null);

  // Sync ref when props change
  useEffect(() => {
    const rawNodes = customNodes || DEFAULT_NEURAL_NODES;
    const rawEdges = customEdges || DEFAULT_NEURAL_EDGES;
    simEdgesRef.current = [...rawEdges];
    simNodesRef.current = buildInitialNodes(rawNodes);
  }, [customNodes, customEdges, buildInitialNodes]);

  // Camera Pan and Zoom state
  const cameraRef = useRef<{ x: number; y: number; zoom: number; targetZoom: number }>({
    x: 0,
    y: 0,
    zoom: 1,
    targetZoom: 1,
  });

  const isPanningRef = useRef<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number; camX: number; camY: number }>({
    x: 0,
    y: 0,
    camX: 0,
    camY: 0,
  });

  const palette = THEME_PALETTES[variant] || THEME_PALETTES['studio-light'];

  // Trigger an action potential pulse along an edge
  const triggerPulse = useCallback(
    (sourceId: string, targetId: string) => {
      const sourceNode = simNodesRef.current.find((n) => n.id === sourceId);
      const targetNode = simNodesRef.current.find((n) => n.id === targetId);
      if (!sourceNode || !targetNode) return;

      const clusterColor = palette.clusters[sourceNode.cluster]?.color || palette.edgeActive;

      pulsesRef.current.push({
        id: `pulse-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sourceId,
        targetId,
        progress: 0,
        speed: 0.022 + Math.random() * 0.015,
        color: clusterColor,
      });

      // Target node absorbs excitation pulse wave
      sourceNode.pulseWave = 1.0;

      setSynapsePulseCount((c) => c + 1);

      if (isAudioActive) {
        playSynapseDischarge();
      }

      if (onFireSynapse) {
        onFireSynapse(sourceId, targetId);
      }
    },
    [palette, isAudioActive, onFireSynapse]
  );

  // Trigger random network action potential discharge
  const fireRandomImpulse = useCallback(() => {
    const edges = simEdgesRef.current;
    if (edges.length === 0) return;
    const randomEdge = edges[Math.floor(Math.random() * edges.length)];
    triggerPulse(randomEdge.source, randomEdge.target);
  }, [triggerPulse]);

  // Periodic subtle ambient firing
  useEffect(() => {
    if (!autoPulse) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      fireRandomImpulse();
    }, 2800);
    return () => clearInterval(interval);
  }, [autoPulse, fireRandomImpulse]);

  // Center & Reset camera view
  const handleResetCamera = useCallback(() => {
    cameraRef.current.x = 0;
    cameraRef.current.y = 0;
    cameraRef.current.zoom = 1;
    cameraRef.current.targetZoom = 1;
    if (isAudioActive) {
      playReleaseDetent();
    }
  }, [isAudioActive]);

  // Main Canvas Physics & Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 280);
      height = Math.max(rect.height, 240);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const nodes = simNodesRef.current;
      const edges = simEdgesRef.current;
      const pulses = pulsesRef.current;
      const cam = cameraRef.current;

      // Smooth zoom damping
      cam.zoom += (cam.targetZoom - cam.zoom) * 0.15;

      // 1. Force-Directed Physics Simulation Step
      const kRepulsion = 2600;
      const kSpring = 0.038;
      const springLength = compact ? 80 : 115;
      const damping = 0.88;
      const centerGravity = 0.015;

      // A. Node-Node Coulomb Repulsion
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy + 100;
          const dist = Math.sqrt(distSq);
          const force = kRepulsion / distSq;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (draggedNodeRef.current !== n1.id) {
            n1.vx -= fx;
            n1.vy -= fy;
          }
          if (draggedNodeRef.current !== n2.id) {
            n2.vx += fx;
            n2.vy += fy;
          }
        }
      }

      // B. Edge Hooke's Spring Tension
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const n1 = nodes.find((n) => n.id === edge.source);
        const n2 = nodes.find((n) => n.id === edge.target);
        if (!n1 || !n2) continue;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - springLength;
        const force = displacement * kSpring * (edge.weight || 0.8);

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (draggedNodeRef.current !== n1.id) {
          n1.vx += fx;
          n1.vy += fy;
        }
        if (draggedNodeRef.current !== n2.id) {
          n2.vx -= fx;
          n2.vy -= fy;
        }
      }

      // C. Center Gravity & Integration
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (draggedNodeRef.current !== n.id) {
          n.vx -= n.x * centerGravity;
          n.vy -= n.y * centerGravity;

          n.vx *= damping;
          n.vy *= damping;

          n.x += n.vx;
          n.y += n.vy;
        }

        // Decay excitation wave
        if (n.pulseWave && n.pulseWave > 0) {
          n.pulseWave = Math.max(0, n.pulseWave - dt * 2.5);
        }
      }

      // 2. Synaptic Pulse Particle Propagation
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        if (p.progress >= 1.0) {
          // When pulse hits target, trigger target node glow
          const targetNode = nodes.find((n) => n.id === p.targetId);
          if (targetNode) {
            targetNode.pulseWave = 1.0;
          }
          pulses.splice(i, 1);
        }
      }

      // 3. Clear and Render Viewport
      ctx.clearRect(0, 0, width, height);

      // Render subtle canvas background fill
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      // Save transform for Camera Pan and Zoom
      ctx.save();
      const centerX = width / 2 + cam.x;
      const centerY = height / 2 + cam.y;
      ctx.translate(centerX, centerY);
      ctx.scale(cam.zoom, cam.zoom);

      // Render architectural background grid dots
      const gridSpacing = 32;
      const gridCols = Math.ceil(width / (gridSpacing * cam.zoom)) + 4;
      const gridRows = Math.ceil(height / (gridSpacing * cam.zoom)) + 4;
      ctx.fillStyle = palette.gridDot;
      const startX = -Math.floor(gridCols / 2) * gridSpacing;
      const startY = -Math.floor(gridRows / 2) * gridSpacing;

      for (let gx = startX; gx < -startX; gx += gridSpacing) {
        for (let gy = startY; gy < -startY; gy += gridSpacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Render Synapse Axon Edges
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const n1 = nodes.find((n) => n.id === edge.source);
        const n2 = nodes.find((n) => n.id === edge.target);
        if (!n1 || !n2) continue;

        const isHighlighted =
          hoveredNodeRef.current === n1.id ||
          hoveredNodeRef.current === n2.id ||
          selectedId === n1.id ||
          selectedId === n2.id;

        const matchesFilter =
          activeClusterFilter === 'all' ||
          n1.cluster === activeClusterFilter ||
          n2.cluster === activeClusterFilter;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);

        if (isHighlighted) {
          ctx.strokeStyle = palette.edgeActive;
          ctx.lineWidth = 2.2;
          ctx.globalAlpha = 0.95;
        } else if (matchesFilter) {
          ctx.strokeStyle = palette.edgeBase;
          ctx.lineWidth = Math.max(1, (edge.weight || 0.8) * 1.8);
          ctx.globalAlpha = 0.8;
        } else {
          ctx.strokeStyle = palette.edgeBase;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.2;
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // 5. Render Synaptic Pulse Packets
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        const n1 = nodes.find((n) => n.id === p.sourceId);
        const n2 = nodes.find((n) => n.id === p.targetId);
        if (!n1 || !n2) continue;

        const px = n1.x + (n2.x - n1.x) * p.progress;
        const py = n1.y + (n2.y - n1.y) * p.progress;

        // Glowing outer photon bloom
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 9);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.5, p.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fill();

        // Crisp photon core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Render Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isHovered = hoveredNodeRef.current === node.id;
        const isSelected = selectedId === node.id;
        const isConnectedToHover =
          hoveredNodeRef.current &&
          edges.some(
            (e) =>
              (e.source === hoveredNodeRef.current && e.target === node.id) ||
              (e.target === hoveredNodeRef.current && e.source === node.id)
          );

        const clusterConfig = palette.clusters[node.cluster] || palette.clusters.perception;
        const nodeColor = clusterConfig.color;
        const matchesFilter = activeClusterFilter === 'all' || node.cluster === activeClusterFilter;

        const baseRadius = node.radius || 12;
        const currentRadius = isHovered || isSelected ? baseRadius * 1.3 : baseRadius;

        ctx.save();
        ctx.translate(node.x, node.y);

        if (!matchesFilter) {
          ctx.globalAlpha = 0.25;
        }

        // Excitation Wave Shockwave Ring
        if (node.pulseWave && node.pulseWave > 0) {
          const waveRadius = currentRadius + (1 - node.pulseWave) * 22;
          ctx.beginPath();
          ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 2 * node.pulseWave;
          ctx.globalAlpha = node.pulseWave * 0.8;
          ctx.stroke();
          ctx.globalAlpha = matchesFilter ? 1.0 : 0.25;
        }

        // Ambient Cluster Halo Bloom on Hover / Active
        if (isHovered || isSelected || isConnectedToHover) {
          const halo = ctx.createRadialGradient(0, 0, currentRadius * 0.8, 0, 0, currentRadius * 2.8);
          halo.addColorStop(0, clusterConfig.glow);
          halo.addColorStop(1, 'transparent');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node Outer Precision Ring
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = variant === 'studio-light' || variant === 'warm-editorial' ? '#FFFFFF' : '#1A1D27';
        ctx.fill();
        ctx.lineWidth = isSelected ? 3.5 : isHovered ? 2.8 : 2;
        ctx.strokeStyle = isSelected ? '#365CF5' : nodeColor;
        ctx.stroke();

        // Node Nucleus Core
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Selected Pin Indicator Ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = '#365CF5';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Typographic Node Label (Clean JetBrains Mono / Studio Sans)
        if (!compact || isHovered || isSelected) {
          ctx.font = isSelected || isHovered ? '600 11px var(--font-mono, monospace)' : '500 10px var(--font-sans, sans-serif)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          const textY = currentRadius + 7;
          const text = node.label;
          const metrics = ctx.measureText(text);

          // Subtle text backing pill for readability
          ctx.fillStyle = palette.hudBg;
          ctx.beginPath();
          const pillPadding = 4;
          ctx.roundRect(
            -metrics.width / 2 - pillPadding,
            textY - 2,
            metrics.width + pillPadding * 2,
            14,
            4
          );
          ctx.fill();

          ctx.fillStyle = isSelected ? '#365CF5' : isHovered ? palette.textPrimary : palette.textSecondary;
          ctx.fillText(text, 0, textY);
        }

        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, compact, activeClusterFilter, selectedId, palette]);

  // Pointer Interaction Helpers: Map screen coordinate to canvas coordinate
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cam = cameraRef.current;

    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    const centerX = rect.width / 2 + cam.x;
    const centerY = rect.height / 2 + cam.y;

    return {
      x: (screenX - centerX) / cam.zoom,
      y: (screenY - centerY) / cam.zoom,
    };
  }, []);

  const getNodeAt = useCallback(
    (clientX: number, clientY: number) => {
      const world = screenToWorld(clientX, clientY);
      const nodes = simNodesRef.current;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = world.x - n.x;
        const dy = world.y - n.y;
        const r = (n.radius || 12) + 6;
        if (dx * dx + dy * dy <= r * r) {
          return n;
        }
      }
      return null;
    },
    [screenToWorld]
  );

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const hitNode = getNodeAt(e.clientX, e.clientY);

    if (hitNode) {
      draggedNodeRef.current = hitNode.id;
      if (isAudioActive) {
        playNodeHoverChime(hitNode.cluster);
      }
    } else {
      isPanningRef.current = true;
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        camX: cameraRef.current.x,
        camY: cameraRef.current.y,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;

    if (draggedNodeRef.current) {
      const world = screenToWorld(e.clientX, e.clientY);
      const draggedNode = simNodesRef.current.find((n) => n.id === draggedNodeRef.current);
      if (draggedNode) {
        draggedNode.x = world.x;
        draggedNode.y = world.y;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
      }
      return;
    }

    if (isPanningRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      cameraRef.current.x = panStartRef.current.camX + dx;
      cameraRef.current.y = panStartRef.current.camY + dy;
      return;
    }

    const hitNode = getNodeAt(e.clientX, e.clientY);
    const prevHovered = hoveredNodeRef.current;
    hoveredNodeRef.current = hitNode ? hitNode.id : null;

    if (hitNode && prevHovered !== hitNode.id && isAudioActive) {
      playNodeHoverChime(hitNode.cluster);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;

    if (draggedNodeRef.current) {
      if (isAudioActive) {
        playReleaseDetent();
      }
      draggedNodeRef.current = null;
    }
    isPanningRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const hitNode = getNodeAt(e.clientX, e.clientY);

    if (hitNode) {
      const newSelectedId = selectedId === hitNode.id ? null : hitNode.id;
      setInternalSelectedId(newSelectedId);

      if (onSelectNode) {
        onSelectNode(newSelectedId ? hitNode : null);
      }

      // Also fire synaptic pulse to outgoing connected nodes
      const outgoingEdges = simEdgesRef.current.filter((edge) => edge.source === hitNode.id);
      outgoingEdges.forEach((edge) => triggerPulse(edge.source, edge.target));
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!interactive) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    cameraRef.current.targetZoom = Math.min(Math.max(cameraRef.current.targetZoom * zoomFactor, 0.4), 2.5);
  };

  // Currently selected node object for inspector panel
  const selectedNode = initialNodes.find((n) => n.id === selectedId) || null;
  const connectedSynapsesCount = selectedNode
    ? initialEdges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length
    : 0;

  return (
    <div
      ref={containerRef}
      className={`modui-neural-graph modui-neural-graph--${variant} ${compact ? 'modui-neural-graph--compact' : ''} ${className}`}
      style={style}
      role="region"
      aria-label="Interactive Synaptic Neural Graph"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onWheel={handleWheel}
      tabIndex={interactive ? 0 : undefined}
      {...rest}
    >
      {/* High-DPI 2D Interactive Canvas */}
      <canvas ref={canvasRef} className="modui-neural-graph__canvas" aria-hidden="true" />

      {/* Floating Creative Studio Telemetry HUD */}
      {showControls && !compact && (
        <div className="modui-neural-hud" onClick={(e) => e.stopPropagation()}>
          <div className="modui-neural-hud__brand">
            <span className="modui-neural-hud__pulse-dot" />
            <span className="modui-neural-hud__title">SYNAPSE LATTICE // ENGINE</span>
          </div>

          <div className="modui-neural-hud__chips">
            <div className="modui-neural-chip">
              <span className="modui-neural-chip__key">NODES</span>
              <span className="modui-neural-chip__val">{initialNodes.length}</span>
            </div>
            <div className="modui-neural-chip">
              <span className="modui-neural-chip__key">SYNAPSES</span>
              <span className="modui-neural-chip__val">{initialEdges.length}</span>
            </div>
            <div className="modui-neural-chip">
              <span className="modui-neural-chip__key">PULSES</span>
              <span className="modui-neural-chip__val">{synapsePulseCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bar / Controls Pill */}
      {showControls && !compact && (
        <div className="modui-neural-controls" onClick={(e) => e.stopPropagation()}>
          {/* Cluster Filter Pills */}
          <div className="modui-neural-filters">
            {(['all', 'perception', 'embedding', 'reasoning', 'executive', 'memory'] as const).map((cluster) => (
              <button
                key={cluster}
                type="button"
                className={`modui-neural-filter-btn ${activeClusterFilter === cluster ? 'modui-neural-filter-btn--active' : ''}`}
                onClick={() => setActiveClusterFilter(cluster)}
              >
                {cluster.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Action Trigger Buttons */}
          <div className="modui-neural-action-group">
            <button
              type="button"
              className="modui-neural-action-btn modui-neural-action-btn--primary"
              onClick={fireRandomImpulse}
              title="Trigger electrical action potential pulse"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Fire Impulse</span>
            </button>

            <button
              type="button"
              className="modui-neural-action-btn"
              onClick={handleResetCamera}
              title="Reset camera center and zoom"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m10 15 5-3-5-3v6Z" />
              </svg>
              <span>Reset</span>
            </button>

            <button
              type="button"
              className={`modui-neural-action-btn ${isAudioActive ? 'modui-neural-action-btn--active' : ''}`}
              onClick={() => setIsAudioActive(!isAudioActive)}
              title="Toggle Web Audio Synthesized Haptics"
              aria-label="Toggle Web Audio Synthesized Haptics"
            >
              {isAudioActive ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating Node Telemetry Inspector Card */}
      {showInspector && selectedNode && !compact && (
        <div className="modui-neural-inspector" onClick={(e) => e.stopPropagation()}>
          <div className="modui-neural-inspector__header">
            <span
              className="modui-neural-inspector__indicator"
              style={{ backgroundColor: palette.clusters[selectedNode.cluster]?.color }}
            />
            <div className="modui-neural-inspector__meta">
              <span className="modui-neural-inspector__id">{selectedNode.id.toUpperCase()}</span>
              <h4 className="modui-neural-inspector__title">{selectedNode.label}</h4>
            </div>
            <button
              type="button"
              className="modui-neural-inspector__close"
              onClick={() => {
                setInternalSelectedId(null);
                if (onSelectNode) onSelectNode(null);
              }}
              aria-label="Close inspector"
            >
              ×
            </button>
          </div>

          <div className="modui-neural-inspector__body">
            <div className="modui-neural-inspector__row">
              <span className="modui-neural-inspector__label">Cluster</span>
              <span className="modui-neural-inspector__value" style={{ color: palette.clusters[selectedNode.cluster]?.color }}>
                {palette.clusters[selectedNode.cluster]?.label}
              </span>
            </div>
            <div className="modui-neural-inspector__row">
              <span className="modui-neural-inspector__label">Active Synapses</span>
              <span className="modui-neural-inspector__value">{connectedSynapsesCount} Links</span>
            </div>
            <div className="modui-neural-inspector__row">
              <span className="modui-neural-inspector__label">Activation Weight</span>
              <span className="modui-neural-inspector__value">{Math.round((selectedNode.value || 0.85) * 100)}%</span>
            </div>
          </div>

          <div className="modui-neural-inspector__actions">
            <button
              type="button"
              className="modui-neural-inspector__pulse-btn"
              onClick={() => {
                const outgoing = simEdgesRef.current.filter((e) => e.source === selectedNode.id);
                if (outgoing.length > 0) {
                  outgoing.forEach((e) => triggerPulse(e.source, e.target));
                } else {
                  fireRandomImpulse();
                }
              }}
            >
              ⚡ Stimulate Axons
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
