import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:5174';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
await mkdir('test-results',{recursive:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/team',{waitUntil:'networkidle'});
  const members=await page.evaluate(async()=>(await import('/lib/team.js')).teamMembers);
  const initials=member=>[member.firstName,member.middleName,member.lastName].filter(Boolean).map(name=>name.charAt(0).toUpperCase()).join('');
  const cards=page.locator('.mg-team-grid .mg-person');
  const initial=letter=>page.getByRole('button',{name:'Initial '+letter,exact:true});
  const all=page.getByRole('button',{name:'All initials',exact:true});
  await expect(cards).toHaveCount(members.length);
  await expect(page.getByText('Explore a profile for the full biography',{exact:false})).toHaveCount(0);
  const count=await page.getByRole('status').boundingBox();
  const alphabet=await page.locator('.mg-alphabet').boundingBox();
  assert.ok(count.y+count.height<=alphabet.y,'The result count should appear above the alphabet.');
  await expect(page.getByRole('link',{name:'Explore the team',exact:true})).toHaveCount(0);
  for(const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){
    const matches=members.filter(member=>initials(member).includes(letter));
    if(!matches.length){await expect(initial(letter)).toBeDisabled();continue;}
    await initial(letter).click();
    await expect(initial(letter)).toHaveAttribute('aria-pressed','true');
    await expect(cards).toHaveCount(matches.length);
    assert.deepEqual(new Set(await cards.locator('h2').allTextContents()),new Set(matches.map(member=>member.name)));
  }
  await initial('M').click();await initial('M').click();
  await expect(all).toHaveAttribute('aria-pressed','true');
  await expect(cards).toHaveCount(members.length);
  await initial('J').focus();await page.keyboard.press('Space');
  await expect(initial('J')).toHaveAttribute('aria-pressed','true');
  const filteredLinks=await cards.evaluateAll(elements=>elements.map(el=>el.getAttribute('href')));
  await cards.first().click();
  await expect(page.locator('.mg-profile-next a')).toHaveCount(1);
  await expect(page.locator('.mg-profile-next a')).toHaveAttribute('href',filteredLinks[1]);
  await expect(page.locator('.mg-bio-section').last().locator('h2')).toHaveText('Experience');
  await page.goto(base+'/team');
  await initial('M').click();await page.getByRole('searchbox').fill('Muncy');
  await expect(cards).toHaveCount(members.filter(member=>initials(member).includes('M')&&[member.name,member.title,...(member.field||[]),...(member.memberships||[])].join(' ').toLowerCase().includes('muncy')).length);
  await all.click();
  await expect(page.getByRole('searchbox')).toHaveValue('Muncy');
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await page.getByRole('button',{name:'Filter by role',exact:true}).click();
  await page.getByRole('option',{name:'Principal Shareholder',exact:true}).click();
  await initial('J').click();
  const roleMatches=members.filter(member=>member.title==='PRINCIPAL SHAREHOLDER'&&initials(member).includes('J'));
  await expect(cards).toHaveCount(roleMatches.length);
  await page.getByRole('button',{name:'Filter by expertise',exact:true}).click();
  await page.getByRole('option',{name:'Electrical Engineering',exact:true}).click();
  await expect(cards).toHaveCount(roleMatches.filter(member=>member.field?.includes('Electrical Engineering')).length);
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await expect(cards).toHaveCount(members.length);
  await expect(all).toHaveAttribute('aria-pressed','true');
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:'test-results/team-directory-desktop.png'});
  for(const [width,height] of [[1920,1080],[1440,1000],[390,844],[320,568]]){
    await page.setViewportSize({width,height});await page.goto(base);
    await page.screenshot({path:`test-results/original-hero-${width}.png`});
  }
  const mobile=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
  for(const width of [390,320]){
    await mobile.setViewportSize({width,height:844});await mobile.goto(base+'/team');
    await expect(mobile.getByRole('status')).toHaveText('43 profiles');
    await expect(mobile.getByRole('status')).toBeVisible();
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const letters=await mobile.locator('.mg-alphabet-letters>button').evaluateAll(elements=>elements.map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})));
    assert.ok(letters.every(rect=>rect.width>=40&&rect.height>=44),'Letters need usable touch targets.');
    await mobile.getByRole('button',{name:'Initial M',exact:true}).tap();
    await expect(mobile.locator('.mg-team-grid .mg-person')).toHaveCount(members.filter(member=>initials(member).includes('M')).length);
    await mobile.getByRole('button',{name:'All initials',exact:true}).tap();
    await expect(mobile.locator('.mg-team-grid .mg-person')).toHaveCount(members.length);
    await mobile.evaluate(()=>scrollTo(0,0));
    await mobile.screenshot({path:`test-results/team-directory-mobile-${width}.png`});
    await mobile.locator('.mg-alphabet').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:`test-results/team-alphabet-mobile-${width}.png`});
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/team/Joe.M');
  await expect(page.locator('.mg-bio-heading h2').first()).toBeVisible();
  const headings=await page.locator('.mg-bio-heading h2').allTextContents();
  assert.deepEqual(headings.slice(0,3),['Bar admissions','Education','Professional memberships']);
  assert.equal(headings.at(-1),'Experience');
  await page.screenshot({path:'test-results/profile-order-desktop.png'});
  assert.deepEqual(errors,[]);
  console.log('A–Z initials, direct switching, toggling, keyboard/touch, combined filters, clear/reset, filtered profile navigation and biography order passed.');
} finally {await browser.close();}
