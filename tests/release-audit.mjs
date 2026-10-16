import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:4176';
const preview=process.env.EXPECT_PREVIEW==='true';
const sitemap=await (await fetch(base+'/sitemap.xml')).text();
const routes=[...sitemap.matchAll(/<loc>https:\/\/mg-ip.com([^<]*)<\/loc>/g)].map(match=>match[1]);
assert.equal(routes.length,47);
routes.push('/disclaimer');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const report={base,preview,pages:[],errors:[],warnings:[],viewports:[]};
await mkdir('test-results',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page.on('pageerror',error=>report.errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());if(message.type()==='warning')report.warnings.push(message.text());});
 const titles=new Set();
 for(const route of routes){
  const response=await fetch(base+route),html=await response.text();
  assert.equal(response.status,200,route);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,route+' canonical');
  assert.equal((html.match(/name="description"/g)||[]).length,1,route+' description');
  assert.ok(html.includes('data-prerendered="true"')&&html.includes('<h1'),route+' server content');
  if(preview)assert.match(html,/name="robots" content="noindex, follow"/);
  const nav=await page.goto(base+route,{waitUntil:'networkidle'});
  assert.equal(nav.status(),200);
  await expect(page.locator('h1')).toHaveCount(1);
  const title=await page.title();assert.ok(!titles.has(title),'Duplicate title: '+title);titles.add(title);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  for(const text of await page.locator('script[type="application/ld+json"]').allTextContents())JSON.parse(text);
  const failed=await page.locator('img').evaluateAll(images=>images.filter(image=>image.complete&&!image.naturalWidth).map(image=>image.src));
  assert.deepEqual(failed,[],route+' image errors');
  report.pages.push({route,title});
 }
 const missing=await page.goto(base+'/release-audit-missing-page',{waitUntil:'networkidle'});
 assert.equal(missing.status(),404);
 await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, follow');
 // Browser logs the deliberately requested 404; exclude only that resource status.
 report.errors=report.errors.filter(error=>!error.includes('status of 404'));
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/team','/careers','/contact','/team/Roberta.B']){
   await page.goto(base+route,{waitUntil:'networkidle'});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
  }
  report.viewports.push(width);
 }
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto(base+'/team',{waitUntil:'networkidle'});
 await expect(page.locator('.mg-team-collaboration figcaption button')).toBeVisible();
 const aligned=await page.locator('.mg-team-collaboration figcaption').evaluate(el=>{const span=el.querySelector('span').getBoundingClientRect(),button=el.querySelector('button').getBoundingClientRect();return Math.abs(span.top-button.top)<1;});
 assert.ok(aligned,'Team caption/pause control alignment');
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'test-results/release-team-mobile.png'});
 await page.goto(base+'/team/Roberta.B',{waitUntil:'networkidle'});
 const lists=await page.locator('.mg-bio-record-grid').evaluateAll(elements=>elements.map(el=>getComputedStyle(el).listStyleType));
 assert.ok(lists.length&&lists.every(style=>style==='disc'));
 await page.screenshot({path:'test-results/release-bio-mobile.png'});
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify({pages:report.pages.length,viewports:report.viewports,errors:report.errors,warnings:report.warnings},null,2));
}finally{
 await writeFile('test-results/release-audit.json',JSON.stringify(report,null,2));
 await browser.close();
}
