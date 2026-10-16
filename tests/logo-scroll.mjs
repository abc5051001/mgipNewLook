import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:5175';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
async function returnToTop(page,logo,reduced=false){
 await logo.evaluate(element=>element.addEventListener('click',()=>{
  window.logoStart=scrollY;window.logoSamples=[];
  const sample=()=>{window.logoSamples.push(scrollY);if(window.logoSamples.length<120&&scrollY>0)requestAnimationFrame(sample);};
  requestAnimationFrame(sample);
 },{once:true,capture:true}));
 await logo.click();
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
 const {start,samples}=await page.evaluate(()=>({start:window.logoStart,samples:window.logoSamples}));
 assert.ok(start>100,'The logo should be clicked from a scrolled position');
 if(!reduced)assert.ok(samples.some(value=>value>0&&value<start),'Logo should animate through intermediate scroll positions');
 else assert.ok(samples.every(value=>value===0),'Reduced-motion logo scrolling should be immediate');
 assert.equal(new URL(page.url()).hash,'');
}
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.getByRole('link',{name:'Scroll to About Our Firm',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(300);
  await returnToTop(page,page.getByRole('link',{name:'MG-IP home',exact:true}));
  const footer=page.locator('.mg-footer-logo');await footer.scrollIntoViewIfNeeded();
  await returnToTop(page,footer);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>scrollTo({top:900,behavior:'instant'}));
  await returnToTop(page,page.getByRole('link',{name:'MG-IP home',exact:true}),true);
  await page.goto(base+'/team',{waitUntil:'networkidle'});
  await page.evaluate(()=>scrollTo({top:900,behavior:'instant'}));
  await page.getByRole('link',{name:'MG-IP home',exact:true}).click();
  await expect(page.locator('.mg-home-photo-hero h1')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
  await page.goto(base+'/careers',{waitUntil:'networkidle'});
  await expect(page.getByRole('link',{name:'View Current Openings'})).toHaveAttribute('href',/^https:\/\/recruiting\.paylocity\.com\/recruiting\/jobs\/All\//);
  assert.equal(await page.locator('.mg-careers-panel li').count(),0);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('Header/footer logos scroll smoothly on desktop/mobile, clear section hashes, respect reduced motion and retain cross-page navigation; Careers directs visitors to live openings.');
}finally{await browser.close();}
