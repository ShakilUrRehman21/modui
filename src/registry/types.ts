export type ComponentCategory =
  | 'Buttons and Actions'
  | 'Status & Indicators'
  | 'Typography & Motion'
  | '3D & Interactive Showcase';

export type ComponentStatus = 'published' | 'in-progress';

export interface ComponentPropDoc {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface ComponentRegistryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  tags: string[];
  status: ComponentStatus;
  publishedAt?: string;
  updatedAt?: string;
  version: string;
  sourceLocation: string;
  githubUrl: string;
  codeSnippet: string;
  installSnippet: string;
  rawSourceCode: string;
  rawCssCode: string;
  propsDoc: ComponentPropDoc[];
  accessibilityNotes: string[];
  features: string[];
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  'Buttons and Actions',
  'Status & Indicators',
  'Typography & Motion',
  '3D & Interactive Showcase',
];
