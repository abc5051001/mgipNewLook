import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:5175';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const running=decoration=>decoration.evaluate(el=>el.getAnimations().some(animation=>animation.playState==='running'));
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base,{waitUntil:'networkidle'});
 const cards=page.locator('.mg-benefit-card');
 await expect(cards).toHaveCount(6);
 for(let index=0;index<6;index++){
  const card=cards.nth(index),trigger=card.getByRole('button'),decoration=card.locator('.mg-benefit-decoration');
  await card.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  await expect.poll(()=>running(decoration)).toBe(false);
  await trigger.hover();await expect(trigger).toHaveCSS('cursor','pointer');
  await expect.poll(()=>running(decoration)).toBe(true);
  await expect.poll(()=>running(decoration)).toBe(false);
  await trigger.focus();await expect.poll(()=>running(decoration)).toBe(true);
  await expect.poll(()=>running(decoration)).toBe(false);
  await page.keyboard.press('Enter');await expect.poll(()=>running(decoration)).toBe(true);
 }
 const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 touch.on('pageerror',error=>errors.push(error.message));
 await touch.goto(base,{waitUntil:'networkidle'});
 const card=touch.locator('.mg-benefit-card').first(),trigger=card.getByRole('button'),decoration=card.locator('.mg-benefit-decoration');
 await card.scrollIntoViewIfNeeded();await expect.poll(()=>running(decoration)).toBe(false);
 await trigger.tap();await expect.poll(()=>running(decoration)).toBe(true);
 await expect.poll(()=>running(decoration)).toBe(false);
 await trigger.tap();await expect.poll(()=>running(decoration)).toBe(true);
 await touch.emulateMedia({reducedMotion:'reduce'});
 await expect.poll(()=>running(decoration)).toBe(false);
 await trigger.tap();await expect.poll(()=>running(decoration)).toBe(false);
 assert.ok(await touch.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.deepEqual(errors,[]);
 console.log('All six benefits replay on hover, keyboard focus/Enter and repeated mobile taps; reduced motion suppresses playback.');
}finally{await browser.close();}
