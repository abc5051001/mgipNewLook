import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:5174';
const copy=JSON.parse(await readFile(new URL('../content/firm-copy.json',import.meta.url),'utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
await mkdir('test-results/photo-hero',{recursive:true});
const held=async page=>{
  await expect(page.locator('#motion-firm-title')).toHaveAttribute('data-settled','true');
  await expect(page.locator('.mh-context-description')).toHaveAttribute('data-settled','true');
  await expect(page.locator('.mh-description-accessible')).toHaveText(copy.hero.description);
  await expect(page.locator('.mh-description-text')).toHaveText(copy.hero.description);
  assert.ok(await page.locator('.mh-title-word,.mh-description-word').evaluateAll(words=>words.every(word=>{
    const style=getComputedStyle(word);return Number(style.opacity)===1&&Math.abs(new DOMMatrix(style.transform).m42)<.1;
  })),'All words settle fully in place');
};
try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const [width,height] of [[1920,1080],[1440,900],[1024,768],[768,1024],[490,1060],[390,844],[320,568],[736,414]]){
    await page.setViewportSize({width,height});
    await page.goto(base,{waitUntil:'networkidle'});
    await held(page);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.mh-eyebrow')).toHaveText(copy.hero.eyebrow);
    await expect(page.locator('.mh-disciplines')).toHaveText('Engineering/Science/Law');
    await expect(page.locator('.mh-actions').getByRole('link',{name:'Contact Us',exact:true})).toBeInViewport();
    await expect(page.getByRole('link',{name:'Learn More',exact:true})).toBeInViewport();
    assert.ok(await page.locator('.mh-poster img').evaluate(el=>el.complete&&el.naturalWidth>0));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    assert.equal(await page.locator('.mh-hero').evaluate(el=>getComputedStyle(el,'::before').backgroundImage),'none');
    for(const selector of ['h1','.mh-eyebrow','.mh-context-description','.mh-contact'])await expect(page.locator(selector)).toHaveCSS('text-shadow','none');
    if(width<=720){
      await expect(page.locator('.mh-context-description')).toHaveCSS('color','rgb(255, 255, 255)');
      for(const selector of ['.mh-intro','.mh-context>div'])assert.equal(await page.locator(selector).evaluate(el=>getComputedStyle(el,'::before').content),'none');
      const contact=await page.locator('.mh-actions .mg-button').boundingBox(),learn=await page.locator('.mh-contact').boundingBox();
      assert.ok(contact.x<learn.x&&contact.x+contact.width<=learn.x,'Contact Us stays left of Learn More');
      await expect(page.locator('.mh-contact')).toHaveCSS('border-top-width','1px');
    }
    await page.screenshot({path:`test-results/photo-hero/${width}.png`});
  }
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await expect.poll(()=>page.locator('.mh-title-word').evaluateAll(words=>words.some(word=>new DOMMatrix(getComputedStyle(word).transform).m42<-.5))).toBe(true);
  await held(page);
  await page.locator('.mg-history').scrollIntoViewIfNeeded();
  await expect(page.locator('#motion-firm-title')).toHaveAttribute('data-settled','false');
  await expect(page.locator('.mh-context-description')).toHaveAttribute('data-settled','false');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await held(page);
  await page.getByRole('link',{name:'Learn More',exact:true}).click();
  await expect(page.locator('header')).toHaveAttribute('data-scrolled','true');
  await expect(page.locator('.mg-nav-inner')).toHaveCSS('height','92px');
  await page.goto(base);
  await page.locator('.mh-actions').getByRole('link',{name:'Contact Us',exact:true}).click();
  await expect(page).toHaveURL(base+'/contact');
  assert.deepEqual(errors,[]);
  console.log('Photo hero: eight responsive layouts, readable copy, mobile styling, reduced motion, entrance replay and actions passed.');
}finally{await browser.close();}
