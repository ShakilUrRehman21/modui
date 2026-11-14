/**
 * Build-time SEO generator for ModUI.
 *
 * The app is a client-rendered SPA, so every URL used to serve the same
 * index.html -- same <title>, same description, and a canonical pointing at
 * the homepage. Google read that canonical as "this page is a duplicate of /"
 * and declined to index 29 of 30 URLs.
 *
 * This script runs after `vite build` and writes a real HTML file per route
 * with its own title, description, canonical, Open Graph tags, JSON-LD and a
 * crawlable content block. React boots over it as usual.
 *
 * It also regenerates sitemap.xml from the registry so the two can't drift.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const BASE_URL = 'https://modui.online';

/* ---------------------------------------------------------------------------
   Read the component registry.
   The item files import source code with Vite's `?raw`, so Node can't import
   them directly -- the fields are plain string literals, so we read them out.
--------------------------------------------------------------------------- */
function field(src, key) {
  const re = new RegExp(`\\b${key}:\\s*(?:\\n\\s*)?(['"\`])((?:\\\\.|(?!\\1)[\\s\\S])*)\\1`);
  const m = src.match(re);
  return m ? m[2].replace(/\\'/g, "'").replace(/\s+/g, ' ').trim() : '';
}

function arrayField(src, key) {
  const m = src.match(new RegExp(`\\b${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/(['"])((?:\\.|(?!\1)[^\\])*)\1/g)].map((x) => x[2]);
}

function readRegistry() {
  const dir = join(ROOT, 'src/registry/items');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .map((f) => {
      const src = readFileSync(join(dir, f), 'utf8');
      return {
        slug: field(src, 'slug') || f.replace(/\.ts$/, ''),
        name: field(src, 'name'),
        description: field(src, 'description'),
        category: field(src, 'category'),
        tags: arrayField(src, 'tags'),
        status: field(src, 'status'),
        updatedAt: field(src, 'updatedAt') || field(src, 'publishedAt'),
      };
    })
    .filter((c) => c.status === 'published' && c.name && c.description);
}

/* ---------------------------------------------------------------------------
   Per-route metadata
--------------------------------------------------------------------------- */
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function componentJsonLd(c) {
  const url = `${BASE_URL}/components/${c.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: c.name,
      programmingLanguage: ['TypeScript', 'React', 'CSS'],
      codeRepository: 'https://github.com/ShakilUrRehman21/modui',
      description: c.description,
      runtimePlatform: 'Browser',
      url,
      keywords: c.tags.join(', '),
      license: 'https://opensource.org/licenses/MIT',
      author: { '@type': 'Organization', name: 'ModUI Lab', url: BASE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Components', item: `${BASE_URL}/components` },
        { '@type': 'ListItem', position: 3, name: c.name, item: url },
      ],
    },
  ];
}

function buildRoutes(components) {
  const total = components.length;

  const routes = [
    {
      path: '/',
      priority: '1.0',
      changefreq: 'weekly',
      title: 'ModUI — Crafted React UI Components, Audio DSP & Micro-Interactions',
      description: `ModUI is a collection of ${total} modular React components — Web Audio DSP, 3D interactions and spring physics — with zero runtime CSS dependencies. Copy the source, own the code.`,
      body: `<h1>ModUI</h1><p>${total} crafted React components you copy into your own codebase. No package to install, no runtime CSS dependency.</p>`,
    },
    {
      path: '/components',
      priority: '0.9',
      changefreq: 'weekly',
      title: `Component Catalog — ${total} Interactive React Primitives | ModUI`,
      description: `Browse all ${total} production-ready React components: audio decks, 3D carousels, spring-physics accordions, film galleries and machined controls. TypeScript, accessible, copy-paste.`,
      body:
        `<h1>Component catalog</h1><p>All ${total} ModUI components.</p><ul>` +
        components
          .map((c) => `<li><a href="/components/${c.slug}">${esc(c.name)}</a> — ${esc(c.description)}</li>`)
          .join('') +
        '</ul>',
    },
    {
      path: '/docs',
      priority: '0.8',
      changefreq: 'monthly',
      title: 'Documentation & Architecture Guide — ModUI',
      description:
        'Architecture principles, the copy-paste workflow, design tokens, theming and accessibility guidelines for ModUI components.',
      body: '<h1>Documentation</h1><p>Architecture, design tokens, theming and accessibility guidelines for ModUI.</p>',
    },
  ];

  for (const c of components) {
    routes.push({
      path: `/components/${c.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: c.updatedAt,
      title: `${c.name} — React Component | ModUI`,
      description: c.description.length > 158 ? `${c.description.slice(0, 155).trimEnd()}…` : c.description,
      keywords: [...c.tags, 'react component', 'typescript', 'copy paste ui'],
      jsonLd: componentJsonLd(c),
      body:
        `<nav><a href="/">Home</a> / <a href="/components">Components</a> / ${esc(c.name)}</nav>` +
        `<h1>${esc(c.name)}</h1>` +
        `<p>${esc(c.description)}</p>` +
        `<p>Category: ${esc(c.category)}</p>` +
        `<ul>${c.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` +
        `<p>React + TypeScript source you copy into your project. MIT licensed.</p>`,
    });
  }

  return routes;
}

/* ---------------------------------------------------------------------------
   Rewrite the built shell for one route
--------------------------------------------------------------------------- */
function renderRoute(shell, route) {
  const url = `${BASE_URL}${route.path === '/' ? '/' : route.path}`;
  let html = shell;

  const setMeta = (attr, key, value) => {
    const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`);
    const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
    html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
  };

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`);
  setMeta('name', 'description', route.description);
  if (route.keywords) setMeta('name', 'keywords', route.keywords.join(', '));

  // The canonical is the whole ballgame: it used to say "/" on every page.
  const canonical = `<link rel="canonical" href="${url}" />`;
  html = /<link rel="canonical"[^>]*>/.test(html)
    ? html.replace(/<link rel="canonical"[^>]*>/, canonical)
    : html.replace('</head>', `    ${canonical}\n  </head>`);

  setMeta('property', 'og:url', url);
  setMeta('property', 'og:title', route.title);
  setMeta('property', 'og:description', route.description);
  setMeta('property', 'og:type', route.path.startsWith('/components/') ? 'article' : 'website');
  setMeta('name', 'twitter:url', url);
  setMeta('name', 'twitter:title', route.title);
  setMeta('name', 'twitter:description', route.description);

  if (route.jsonLd) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" data-seo-build>${JSON.stringify(route.jsonLd)}</script>\n  </head>`,
    );
  }

  // Real content for the crawler. React clears #root and renders over it, so
  // this is only on screen until the bundle boots -- styled just enough that
  // the moment reads as the page loading rather than as broken markup.
  const shellStyle = [
    'max-width:72ch',
    'margin:0 auto',
    'padding:18vh 24px 0',
    'font-family:system-ui,-apple-system,sans-serif',
    'color:#5A6178',
    'font-size:15px',
    'line-height:1.6',
  ].join(';');
  html = html.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root"><div data-prerendered="true" style="${shellStyle}">${route.body}</div></div>`,
  );

  return html;
}

/* ---------------------------------------------------------------------------
   Sitemap
--------------------------------------------------------------------------- */
function renderSitemap(routes, today) {
  const urls = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${BASE_URL}${r.path === '/' ? '/' : r.path}</loc>\n` +
        `    <lastmod>${r.lastmod || today}</lastmod>\n` +
        `    <changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/* ------------------------------------------------------------------------ */
const components = readRegistry();
if (components.length === 0) {
  console.error('[seo] no published components parsed from src/registry/items — aborting');
  process.exit(1);
}

// `vite build` regenerates dist/index.html, but this script also WRITES it (the
// '/' route). Strip anything a previous run injected so re-running without a
// rebuild can't compound its own output.
const shell = readFileSync(join(DIST, 'index.html'), 'utf8')
  .replace(/<script type="application\/ld\+json" data-seo-build>[\s\S]*?<\/script>\s*/g, '')
  .replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/, '<div id="root"></div>\n  </body>');
const routes = buildRoutes(components);
const today = new Date().toISOString().slice(0, 10);

for (const route of routes) {
  const out = route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, renderRoute(shell, route), 'utf8');
}

const sitemap = renderSitemap(routes, today);
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(ROOT, 'public/sitemap.xml'), sitemap, 'utf8');

console.log(`[seo] ${routes.length} routes written (${components.length} components), sitemap regenerated`);
