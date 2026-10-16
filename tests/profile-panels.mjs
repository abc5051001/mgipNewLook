import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:5174';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
await mkdir('test-results',{recursive:true});
const expectPanelNearTop=async(page,selector)=>{
  await expect.poll(async()=>{
    const panel=await page.locator(selector).boundingBox(),header=await page.locator('.mg-header').boundingBox();
    return panel.y>=header.y+header.height&&panel.y<header.y+header.height+150;
  }).toBe(true);
};
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/team',{waitUntil:'networkidle'});
  const members=await page.evaluate(async()=>(await import('/lib/team.js')).teamMembers);
  const awardMember=members.find(member=>member.name.includes('Bren'))||members.find(member=>member.awards?.length);
  assert.ok(awardMember,'An awards biography is needed for this check.');
  const longMember=[...members].sort((a,b)=>JSON.stringify(b.experience||'').length-JSON.stringify(a.experience||'').length)[0];
  await page.goto(base+'/team/'+encodeURIComponent(awardMember.id));
  await expect(page.locator('.mg-bio-section').first()).toHaveCSS('opacity','1');
  await page.screenshot({path:'test-results/profile-panels-desktop-top.png'});
  const index=page.getByRole('navigation',{name:'Biography sections',exact:true});
  await index.getByRole('link',{name:'Awards',exact:true}).click();
  await expect(page.locator('#bio-awards')).toHaveCSS('opacity','1');
  await expectPanelNearTop(page,'#bio-awards');
  await expect(page.locator('#bio-awards .mg-bio-record-grid>li')).toHaveCount(awardMember.awards.length);
  for(const value of awardMember.awards)await expect(page.locator('#bio-awards')).toContainText(value);
  await page.screenshot({path:'test-results/profile-panels-desktop-awards.png'});
  await index.getByRole('link',{name:'Experience',exact:true}).click();
  await expect(page.locator('#bio-experience')).toHaveCSS('opacity','1');
  await expectPanelNearTop(page,'#bio-experience');
  await expect(page.locator('#bio-experience h2')).toBeInViewport();
  await page.screenshot({path:'test-results/profile-panels-desktop-experience.png'});
  await page.goto(base+'/team/'+encodeURIComponent(longMember.id));
  await page.getByRole('navigation',{name:'Biography sections'}).getByRole('link',{name:'Experience',exact:true}).click();
  await expect(page.locator('#bio-experience')).toHaveCSS('opacity','1');
  const navigation=await page.locator('.mg-profile-index').boundingBox();
  const header=await page.locator('.mg-header').boundingBox();
  assert.ok(navigation.y>=header.y+header.height&&navigation.y<header.y+header.height+90,'The desktop contents should remain beside the reading panel.');
  await page.screenshot({path:'test-results/profile-panels-long-reading.png'});
  const mobile=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
  for(const width of [320,390,768]){
    await mobile.setViewportSize({width,height:844});
    await mobile.goto(base+'/team/'+encodeURIComponent(awardMember.id));
    const contents=mobile.getByRole('navigation',{name:'Biography sections',exact:true});
    await contents.getByRole('link',{name:'Awards',exact:true}).tap();
    await expect(mobile.locator('#bio-awards')).toHaveCSS('opacity','1');
    await expectPanelNearTop(mobile,'#bio-awards');
    await expect(mobile.locator('#bio-awards h2')).toBeInViewport();
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width}px biography overflow`);
    await mobile.screenshot({path:`test-results/profile-panels-awards-${width}.png`});
    await contents.getByRole('link',{name:'Experience',exact:true}).tap();
    await expect(mobile.locator('#bio-experience h2')).toBeInViewport();
    await expect(mobile.locator('#bio-experience')).toHaveCSS('opacity','1');
    await expectPanelNearTop(mobile,'#bio-experience');
    await mobile.screenshot({path:`test-results/profile-panels-experience-${width}.png`});
  }
  await page.emulateMedia({media:'print'});
  await expect(page.locator('.mg-bio-section').first()).toHaveCSS('opacity','1');
  assert.deepEqual(errors,[]);
  console.log('Awards tiles, complete experience, section anchors, sticky desktop contents, reduced motion, print visibility and 320–768px reading layouts passed.');
}finally{await browser.close();}
