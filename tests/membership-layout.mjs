import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:5175';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
await mkdir('test-results',{recursive:true});
try{
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/team/Roman.C',{waitUntil:'networkidle'});
  const buttons=page.locator('.mg-membership>button');
  assert.ok(await buttons.count()>1);
  if(width===1440){const first=await buttons.nth(0).boundingBox(),second=await buttons.nth(1).boundingBox();assert.ok(Math.abs(first.y-second.y)<1&&second.x>first.x,'Desktop memberships should sit side by side');}
  await buttons.first().hover();
  const explanation=page.locator('.mg-membership-explanation:visible').first();
  await expect(explanation).toBeVisible();
  const overlaps=await page.locator('.mg-membership-list').evaluate(list=>{
   const tooltip=list.querySelector('.mg-membership-explanation:not([hidden])'),box=tooltip.getBoundingClientRect();
   return [...list.querySelectorAll('button')].filter(button=>button.parentElement!==tooltip.parentElement).some(button=>{const other=button.getBoundingClientRect();return box.left<other.right&&box.right>other.left&&box.top<other.bottom&&box.bottom>other.top;});
  });
  assert.equal(overlaps,false,'Membership description must not cover another control at '+width);
  await buttons.nth(1).click();await expect(buttons.nth(1)).toHaveAttribute('aria-expanded','true');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:`test-results/membership-layout-${width}.png`});
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('Membership cards sit side by side on desktop; open descriptions do not cover neighboring controls at 320–1440px.');
}finally{await browser.close();}
