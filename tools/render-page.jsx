import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { HelmetProvider } from 'react-helmet-async';
import { PageContent } from '../App';
export { teamMembers } from '../lib/team';

export function renderPage(location) {
  return new Promise((resolve, reject) => {
    const context = {};
    const output = new PassThrough();
    let html = '';
    output.on('data', chunk => { html += chunk; });
    output.on('end', () => resolve({ html, head: ['title', 'meta', 'link', 'script'].map(key => context.helmet[key].toString()).join('\n') }));
    output.on('error', reject);
    const rendering = renderToPipeableStream(<HelmetProvider context={context}><StaticRouter location={location}><PageContent/></StaticRouter></HelmetProvider>, {
      onAllReady() { rendering.pipe(output); },
      onShellError: reject,
      onError: reject,
    });
  });
}
