/**
 * SEO & Metadata Utility for ModUI (https://modui.online)
 * Manages document title, meta description, canonical URLs, Open Graph,
 * Twitter cards, and Schema.org JSON-LD structured data for Google Search.
 */

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const BASE_URL = 'https://modui.online';

function setMetaTag(selector: string, attribute: 'name' | 'property', name: string, content: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url: string) {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function setJsonLd(data?: Record<string, unknown> | Array<Record<string, unknown>>) {
  const SCRIPT_ID = 'modui-jsonld-schema';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!data) {
    if (script) script.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

export function updatePageSeo(config: SeoConfig) {
  if (typeof document === 'undefined') return;

  const fullTitle = config.title.includes('ModUI') ? config.title : `${config.title} — ModUI`;
  document.title = fullTitle;

  // Description
  setMetaTag('meta[name="description"]', 'name', 'description', config.description);

  // Keywords
  if (config.keywords && config.keywords.length > 0) {
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', config.keywords.join(', '));
  }

  // Canonical URL
  const canonicalUrl = `${BASE_URL}${config.canonicalPath || ''}`;
  setCanonical(canonicalUrl);

  // Open Graph
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', config.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', config.ogType || 'website');
  if (config.ogImage) {
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', config.ogImage);
  }

  // Twitter Cards
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', config.description);
  if (config.ogImage) {
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', config.ogImage);
  }

  // Structured Data (JSON-LD)
  if (config.jsonLd) {
    setJsonLd(config.jsonLd);
  }
}

/**
 * Generate Schema.org JSON-LD for a ModUI Component
 */
export function generateComponentJsonLd(component: {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags?: string[];
  version?: string;
}) {
  const componentUrl = `${BASE_URL}/components/${component.slug}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: component.name,
      programmingLanguage: ['TypeScript', 'React', 'CSS'],
      codeRepository: 'https://github.com/ShakilUrRehman21/modui',
      description: component.description,
      runtimePlatform: 'Browser',
      url: componentUrl,
      keywords: component.tags ? component.tags.join(', ') : undefined,
      license: 'https://opensource.org/licenses/MIT',
      author: {
        '@type': 'Organization',
        name: 'ModUI Lab',
        url: BASE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Components',
          item: `${BASE_URL}/components`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: component.name,
          item: componentUrl,
        },
      ],
    },
  ];
}

