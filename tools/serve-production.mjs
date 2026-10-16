// Local audit server: mirror Netlify's generated-page routing and 404 status.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
createServer(async(req,res)=>{
 try {
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  let status=200;
  try {if((await stat(file)).isDirectory())file=path.join(file,'index.html');await stat(file);}catch{file=path.join(root,'404.html');status=404;}
  let content=await readFile(file);
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Vary':'Accept-Encoding'};
  if(/gzip/.test(req.headers['accept-encoding']||'')&&/\.(html|js|css|json|svg|xml|txt)$/.test(file)){content=gzipSync(content);headers['Content-Encoding']='gzip';}
  res.writeHead(status,headers);
  res.end(content);
 }catch{res.writeHead(500).end();}
}).listen(4176,'127.0.0.1',()=>console.log('Production audit: http://127.0.0.1:4176'));
