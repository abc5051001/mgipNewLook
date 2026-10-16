import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:5174';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.goto(base+'/team/Roman.C',{waitUntil:'networkidle'});
  const metadata=await page.evaluate(async()=>(await import('/membershipMasterList.js')).default);
  const members=await page.evaluate(async()=>(await import('/lib/team.js')).teamMembers);
  const checked=new Set();
  for(const member of members){
    const known=(member.memberships||[]).filter(label=>metadata[label]&&!checked.has(label));
    if(!known.length)continue;
    await page.goto(base+'/team/'+encodeURIComponent(member.id));
    for(const label of known){
      const button=page.getByRole('button',{name:label+(metadata[label].name===label?'':' '+metadata[label].name),exact:true});
      await button.hover();
      await expect(button).toHaveAttribute('aria-expanded','true');
      const explanation=page.locator('[id="'+await button.getAttribute('aria-controls')+'"]');
      await expect(explanation).toBeVisible();
      await expect(explanation).toHaveText(metadata[label].description);
      await page.mouse.move(0,0);
      await expect(explanation).toBeHidden();
      await button.focus();
      await expect(explanation).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(explanation).toBeHidden();
      checked.add(label);
    }
  }
  assert.deepEqual([...checked].sort(),[...new Set(members.flatMap(member=>member.memberships||[]).filter(label=>metadata[label]))].sort());
  const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await touch.goto(base+'/team/Roman.C');
  const aba=touch.getByRole('button',{name:'ABA American Bar Association',exact:true});
  await aba.tap();
  await expect(touch.getByRole('tooltip')).toHaveText(metadata.ABA.description);
  await expect(aba).toHaveAttribute('aria-expanded','true');
  await aba.tap();await expect(aba).toHaveAttribute('aria-expanded','false');
  await aba.tap();await touch.locator('h1').tap();await expect(aba).toHaveAttribute('aria-expanded','false');
  assert.equal(await touch.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  console.log(`${checked.size} original organization descriptions verified verbatim; hover, focus, Escape, mobile tap/toggle and outside dismissal passed.`);
}finally{await browser.close();}
