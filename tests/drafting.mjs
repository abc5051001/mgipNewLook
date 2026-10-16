import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://127.0.0.1:5174';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: {width:1440,height:1000} });
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('.mg-drafting-figure').scrollIntoViewIfNeeded();
  const figure=page.locator('.mg-drafting-figure');
  const stage=page.getByRole('slider',{name:/Explore the drafting instrument/});
  const progress=()=>stage.getAttribute('data-progress');
  const start=await progress();
  await expect.poll(progress).not.toBe(start);
  await page.getByRole('button',{name:'Pause illustration'}).click();
  const paused=await progress();
  await page.waitForTimeout(200);
  assert.equal(await progress(),paused,'Pause must freeze the mechanism.');
  await stage.focus();
  await page.keyboard.press('Home');
  await expect(stage).toHaveAttribute('data-progress','0.0000');
  await page.keyboard.press('ArrowRight');
  await expect.poll(async()=>Number(await progress())).toBeGreaterThan(0);
  await expect(stage).toHaveAttribute('aria-valuenow','3');
  await page.keyboard.press('End');
  await expect(stage).toHaveAttribute('data-progress','1.0000');
  await expect(figure.locator('[data-readout]')).toHaveText('100% drawn');
  // The actual ink path must finish at the stylus model's projected contact point.
  const alignment=await page.evaluate(async()=>{
    const model=await import('/components/modern/drafting/model.mjs');
    const art=await (await fetch('/components/modern/drafting/art.json')).json();
    const expected=model.project([...model.poseAt(1).tip,.65],art.camera);
    const line=document.querySelector('[data-drafting-ink]');
    const actual=line.getPointAtLength(line.getTotalLength());
    return Math.hypot(expected[0]-actual.x,expected[1]-actual.y);
  });
  assert.ok(alignment<.05,'Ink and stylus must use the same path.');
  await page.keyboard.press('Home');
  await stage.hover({position:{x:300,y:150}});
  await expect.poll(async()=>Number(await progress())).toBeGreaterThan(.1);
  await page.getByRole('button',{name:'Play illustration'}).click();
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(figure).toHaveAttribute('data-active','false');
  const outside=await progress();
  await page.waitForTimeout(200);
  assert.equal(await progress(),outside,'Offscreen motion must stop.');
  await page.emulateMedia({reducedMotion:'reduce'});
  await figure.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('data-progress','1.0000');
  await stage.focus();
  await page.keyboard.press('Home');
  await expect(stage).toHaveAttribute('data-progress','0.0000');
  await page.keyboard.press('ArrowRight');
  await expect(stage).toHaveAttribute('data-progress','0.0250');
  const still=await progress();
  await page.waitForTimeout(200);
  assert.equal(await progress(),still,'Reduced motion must allow input without an idle loop.');
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Overflow at '+width);
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'test-results/drafting-page.png'});
  assert.deepEqual(errors,[]);
  console.log('Drafting tour, pause, keyboard, pointer, ink alignment, offscreen stop, reduced motion, and responsive checks passed.');
} finally { await browser.close(); }
