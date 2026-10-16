import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { isPreviewBuild } from './build-environment.mjs';

const root = process.cwd();
const output = path.join(root, 'dist');
const preview = isPreviewBuild();
const shell = await readFile(path.join(output, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(output, '.vite/manifest.json'), 'utf8'));
const server = await createServer({ server: { middlewareMode: true, watch: null }, appType: 'custom', logLevel: 'error' });
try {
  const { renderPage, teamMembers } = await server.ssrLoadModule('/tools/render-page.jsx');
  const routes = ['/', '/team', '/contact', '/careers', '/disclaimer', ...teamMembers.map(member => `/team/${encodeURIComponent(member.id)}`)];
  const resolveAssets = html => {
    for (const [source, entry] of Object.entries(manifest)) {
      if (entry.src && !entry.isEntry) html = html.replaceAll(`/${source}`, `/${entry.file}`);
    }
    return html;
  };
  const writePage = async (route, filename) => {
    const { html, head } = await renderPage(route);
    const page = shell.replace('</head>', `${resolveAssets(head)}\n</head>`).replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${resolveAssets(html)}</div>`);
    const file = path.resolve(output, filename);
    if (!file.startsWith(output + path.sep)) throw new Error('Output path escapes dist');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, page);
  };
  for (const route of routes) await writePage(route, route === '/' ? 'index.html' : `${decodeURIComponent(route.slice(1))}/index.html`);
  await writePage('/notfound', '404.html');
  await writePage('/notfound', 'notfound/index.html');
  const redirects = [...routes.filter(route => route !== '/').map(route => `${route} ${route}/index.html 200!`), '/notfound /404.html 404!', '/* /404.html 404'].join('\n') + '\n';
  await writeFile(path.join(output, '_redirects'), redirects);
  const indexing = preview ? '  X-Robots-Tag: noindex, nofollow\n' : '';
  await writeFile(path.join(output, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${indexing}\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/media/*\n  Cache-Control: public, max-age=3600, must-revalidate\n\n/admin/*\n  X-Robots-Tag: noindex, nofollow\n`);
  const indexable = routes.filter(route => route !== '/disclaimer');
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map(route => `  <url><loc>https://mg-ip.com${route}</loc></url>`).join('\n')}\n</urlset>\n`);
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n${preview ? '' : '\nSitemap: https://mg-ip.com/sitemap.xml\n'}`);
  if (preview) {
    const config = await readFile(path.join(output, 'admin/config.yml'), 'utf8');
    await writeFile(path.join(output, 'admin/config.yml'), config.replace(/  branch: main/, `  branch: ${process.env.BRANCH || 'review/mgip-modern'}`));
  }
  console.log(`Prerendered ${routes.length} pages plus 404; ${preview ? 'review indexing disabled' : 'production metadata and sitemap generated'}.`);
} finally {
  await server.close();
}
