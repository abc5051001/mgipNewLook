import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:5174';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/team',{waitUntil:'networkidle'});
  const members=await page.evaluate(async()=>(await import('/lib/team.js')).teamMembers);
  const roles=[...new Set(members.map(member=>member.title).filter(Boolean))].sort();
  const title=value=>value.toLowerCase().replace(/\b\w/g,char=>char.toUpperCase());
  const role=page.getByRole('button',{name:'Filter by role'});
  const list=page.getByRole('listbox');
  for(const value of roles){
    await role.click();await page.getByRole('option',{name:title(value),exact:true}).click();
    await expect(page.locator('.mg-team-grid>a')).toHaveCount(members.filter(member=>member.title===value).length);
    await expect(role).toContainText(title(value));
  }
  await page.getByRole('button',{name:'Clear filters'}).click();
  await expect(page.locator('.mg-team-grid>a')).toHaveCount(members.length);
  await role.focus();await page.keyboard.press('ArrowDown');await expect(list).toBeVisible();
  await page.keyboard.type('Technical Advisor');await page.keyboard.press('Enter');
  await expect(role).toContainText('Technical Advisor');
  await expect(page.locator('.mg-team-grid>a')).toHaveCount(members.filter(member=>member.title==='TECHNICAL ADVISOR').length);
  await role.click();await page.keyboard.press('Escape');await expect(list).toBeHidden();await expect(role).toBeFocused();
  await page.getByRole('button',{name:'Clear filters'}).click();
  const expertise=page.getByRole('button',{name:'Filter by expertise'});
  const field=members.flatMap(member=>member.field||[]).find(Boolean);
  await expertise.click();await page.getByRole('option',{name:field,exact:true}).click();
  await expect(page.locator('.mg-team-grid>a')).toHaveCount(members.filter(member=>member.field?.includes(field)).length);
  await page.getByRole('button',{name:'Clear filters'}).click();
  await role.click();await expect(list).toHaveCSS('opacity','1');
  await page.screenshot({path:'test-results/dropdown-role-final.png'});
  await page.getByRole('searchbox').click();await expect(list).toBeHidden();

  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:844});
    await role.scrollIntoViewIfNeeded();await role.click();await expect(list).toHaveCSS('opacity','1');
    const rect=await list.boundingBox();
    assert.ok(rect.x>=0&&rect.x+rect.width<=width+1,'Dropdown must stay inside the viewport.');
    assert.ok(rect.y>=0&&rect.y+rect.height<=845,'Dropdown must fit or scroll inside the viewport.');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(width===390)await page.screenshot({path:'test-results/dropdown-mobile-final.png'});
    await page.keyboard.press('Escape');
  }

  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'/contact',{waitUntil:'networkidle'});
  await expect(page.locator('.mg-contact-hero-office>img')).toBeVisible();
  await expect(page.locator('.mg-contact-hero-office>img')).toHaveJSProperty('complete',true);
  await page.screenshot({path:'test-results/contact-hero-final.png'});
  await page.getByRole('link',{name:'Send a Message',exact:true}).click();
  const titleControl=page.getByRole('button',{name:'Title (Optional)',exact:true});
  await expect(titleControl).toBeInViewport();
  await titleControl.click();await expect(list).toHaveCSS('opacity','1');
  await page.screenshot({path:'test-results/dropdown-title-final.png'});
  await page.getByRole('option',{name:'Dr',exact:true}).click();
  const form=page.locator('.mg-contact-form form');
  assert.equal(await form.evaluate(form=>new FormData(form).get('title')),'Dr');
  assert.equal(await form.evaluate(form=>new FormData(form).get('form-name')),'contact');
  await expect(page.getByText('Something went wrong. Please try again or email us directly.')).toHaveCount(0);
  await page.getByLabel('First Name',{exact:true}).fill('Preview');
  await page.getByLabel('Last Name',{exact:true}).fill('Check');
  await page.getByLabel('Email',{exact:true}).fill('preview@example.test');
  await page.getByLabel('Message',{exact:true}).fill('Local preview validation only.');
  await page.getByRole('button',{name:'Send Message',exact:true}).click();
  await expect(page.getByText('Something went wrong. Please try again or email us directly.')).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/contact');await page.screenshot({path:'test-results/contact-hero-mobile-final.png'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);

  const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  await touch.goto(base+'/contact');
  await touch.getByRole('button',{name:'Title (Optional)',exact:true}).tap();
  await touch.getByRole('option',{name:'Ms',exact:true}).tap();
  await expect(touch.getByRole('button',{name:'Title (Optional)',exact:true})).toContainText('Ms');
  await touch.close();

  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base,{waitUntil:'networkidle'});
  for(const selector of ['.mg-original-stats','.mg-service-content','.mg-collective-mosaic','.mg-history-layout']){
    const section=page.locator(selector);
    await expect(section).toHaveCSS('opacity','0');
    for(let visit=0;visit<2;visit++){
      await section.scrollIntoViewIfNeeded();
      await expect.poll(async()=>Number(await section.evaluate(el=>getComputedStyle(el).opacity)),{intervals:[16,16,32]}).toBeGreaterThan(0);
      const intermediate=Number(await section.evaluate(el=>getComputedStyle(el).opacity));
      assert.ok(intermediate<1,'Section should fade through intermediate opacity on every visit.');
      await expect(section).toHaveCSS('opacity','1');
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await expect(section).toHaveCSS('opacity','0');
    }
  }
  await page.reload({waitUntil:'networkidle'});
  await expect(page.locator('.mg-history-layout')).toHaveCSS('opacity','0');
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const reveal of await page.locator('[data-reveal]').all())await expect(reveal).toHaveCSS('opacity','1');
  assert.deepEqual(errors,[]);
  console.log(`${roles.length} role filters, expertise filters, keyboard/type-ahead/Escape, mobile/touch menus, form title serialization, Contact hero and replaying section fade/reduced-motion checks passed.`);
}finally{await browser.close();}
