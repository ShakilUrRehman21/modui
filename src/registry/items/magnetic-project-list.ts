import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/magnetic-project-list/MagneticProjectList.tsx?raw';
import rawCssCode from '../../components/ui/magnetic-project-list/MagneticProjectList.css?raw';

export const magneticProjectListItem: ComponentRegistryItem = {
  id: 'magnetic-project-list',
  slug: 'magnetic-project-list',
  name: 'Magnetic Project List',
  description:
    'High-density editorial case study index inspired by Rauno Freiberg. Features a velocity-damped 3D cursor-following floating preview card that tilts with mouse momentum, micro-haptic acoustic ticks, deliverable chips, and full keyboard navigation.',
  category: '3D & Interactive Showcase',
  tags: [
    'Project',
    'Portfolio',
    'Showcase',
    'Magnetic',
    'Cursor',
    'Velocity',
    'Tilt',
    'Micro-Interaction',
    'Interactive',
  ],
  status: 'published',
  publishedAt: '2026-11-02',
  updatedAt: '2026-11-02',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/magnetic-project-list/MagneticProjectList.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/magnetic-project-list',
  codeSnippet: `import { MagneticProjectList } from '@/components/ui/magnetic-project-list';

export function PortfolioWorkSection() {
  return (
    <MagneticProjectList
      variant="studio-light"
      soundEnabled={true}
      enableVelocityTilt={true}
      onProjectClick={(proj) => console.log('Viewing project:', proj.title)}
    />
  );
}`,
  installSnippet: 'npm install react react-dom',
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'variant',
      type: "'studio-light' | 'dark-slate' | 'editorial-paper' | 'minimal-mono'",
      defaultValue: "'studio-light'",
      description: 'Visual color styling matching studio lighting and darkroom aesthetics.',
    },
    {
      name: 'projects',
      type: 'ProjectItem[]',
      defaultValue: 'DEFAULT_PROJECTS',
      description: 'Array of case study projects with titles, clients, deliverables, and preview graphics.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesizes subtle Web Audio acoustic micro-ticks when crossing project rows.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact card preview mode with pinned card optimized for catalogue cards.',
    },
    {
      name: 'enableVelocityTilt',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Calculates mouse velocity (dx/dy) to dynamically tilt the floating preview card.',
    },
    {
      name: 'onProjectClick',
      type: '(project: ProjectItem) => void',
      description: 'Callback fired when a project row is clicked.',
    },
    {
      name: 'onProjectHover',
      type: '(project: ProjectItem | null) => void',
      description: 'Callback fired when hovered project changes or resets on mouse leave.',
    },
  ],
  accessibilityNotes: [
    'Semantic list and listitem roles with descriptive aria-label reading project number, title, and client.',
    'Full keyboard navigation: ArrowDown / ArrowUp to cycle through rows, Enter / Space to view project.',
    'Visible focus indicator rings compliant with WCAG AA accessibility standards.',
    'Floating cursor card is safely hidden from assistive tech via aria-hidden="true" to prevent redundant reading.',
    'Supports reduced motion preferences by smoothly settling transitions.',
  ],
  features: [
    'High-density editorial case study rows with title, client, category, and year',
    'Velocity-damped 3D cursor-following floating preview card with dynamic tilt physics',
    'Specular glare reflection layer that shifts relative to cursor coordinates',
    'Zero-dependency Web Audio micro-haptic ticks synthesized when crossing rows',
    '4 curated visual finishes: Studio Light, Dark Slate, Editorial Paper, and Minimal Mono',
    'Compact explorer mode with pinned preview card tailored for catalogue cards',
    'Full keyboard accessibility (ArrowDown, ArrowUp, Enter, Space) and ARIA roles',
  ],
};

