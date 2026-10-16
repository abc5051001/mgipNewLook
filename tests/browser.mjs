import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://127.0.0.1:5174';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];
const copy = JSON.parse(await readFile(new URL('../content/firm-copy.json',import.meta.url),'utf8'));
const normalize = text => text.replace(/\s+/g,' ').trim();
const report = { profiles: 0, completeBios: 0, viewports: [], checks: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/team', { waitUntil: 'networkidle' });
  // Read the retained Vite/CMS data path, then check every original profile.
  const members = await page.evaluate(async () => (await import('/lib/team.js')).teamMembers);
  assert.equal(new Set(members.map(member => member.id)).size, members.length);
  await expect(page.locator('.mg-team-grid .mg-person')).toHaveCount(members.length);
  await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.images].every(image => image.complete));
  assert.deepEqual(await page.locator('img').evaluateAll(images => images.filter(image => !image.naturalWidth).map(image => image.src)), []);
  report.profiles = members.length;
  await page.getByRole('searchbox').fill('Muncy');
  await expect(page.locator('.mg-team-grid .mg-person')).toHaveCount(members.filter(member => [member.name,member.title,...(member.field||[]),...(member.memberships||[])].join(' ').toLowerCase().includes('muncy')).length);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.mg-team-grid .mg-person')).toHaveCount(members.length);
  await page.getByRole('button', { name: 'Filter by role' }).click();
  await page.getByRole('option', { name: 'Principal Shareholder', exact: true }).click();
  await expect(page.locator('.mg-team-grid .mg-person')).toHaveCount(members.filter(member => member.title === 'PRINCIPAL SHAREHOLDER').length);
  for (const member of members) {
    await page.goto(base + '/team/' + encodeURIComponent(member.id));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(member.name);
    const text = await page.locator('.mg-profile-body').textContent();
    for (const value of Object.values(member).filter(Array.isArray).flat()) {
      assert.ok(text.includes(value), `${member.name}: retained biography content missing`);
    }
    for (const [key,value] of Object.entries(member)) {
      if(!['id','name','firstName','middleName','lastName','email','phone','title','photo'].includes(key)&&typeof value==='string'&&value){
        assert.ok(text.includes(value),`${member.name}: retained ${key} content missing`);
      }
    }
    assert.equal(await page.locator('.mg-profile-aside>img').getAttribute('src'), member.photo);
    if(member.experience?.length){
      await expect(page.locator('.mg-profile-body>.mg-bio-section').last().locator('h2')).toHaveText('Experience');
      await expect(page.locator('.mg-profile-index>a').last()).toHaveText('Experience');
    }
    report.completeBios++;
  }
  await page.goto(base);
  await page.getByRole('tab', { name: /Trademark/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText(copy.services[1].description);
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tabpanel')).toContainText(copy.services[2].description);
  // Compare rendered content with the untouched original copy, across every tab.
  assert.ok(normalize(await page.locator('body').innerText()).includes(copy.about.description));
  for(const [index,service] of copy.services.entries()) {
    await page.getByRole('tab').nth(index).click();
    const panel=normalize(await page.getByRole('tabpanel').innerText());
    assert.ok(panel.includes(service.description),'Service introduction changed');
    for(const detail of service.details)assert.ok(!panel.includes(detail.body),'Detailed copy should stay behind Read more');
    const trigger=page.getByRole('button',{name:`Read more about ${service.title}`});
    await trigger.click();
    const dialog=page.getByRole('dialog',{name:service.title,exact:true});
    await expect(dialog).toBeVisible();
    assert.equal(await page.locator('body').evaluate(el=>el.style.overflow),'hidden');
    const details=normalize(await dialog.innerText());
    for(const value of [service.description,...service.details.flatMap(detail=>[detail.heading,detail.body])])assert.ok(details.includes(value),'Service copy changed: '+value);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    assert.notEqual(await page.locator('body').evaluate(el=>el.style.overflow),'hidden');
  }
  const body=normalize(await page.locator('body').innerText());
  for(const feature of copy.features)for(const value of [feature.title,feature.description])assert.ok(body.includes(value),'Feature copy changed');
  await expect(page.locator('.mg-header .mg-wordmark')).toHaveText(/^Muncy, Geissler,\s*Olds & Lowe, P\.C\.$/);
  assert.equal(await page.locator('.mg-footer-logo img').getAttribute('src'),'/mgip-logo.png');
  assert.ok((await page.locator('.mg-dc-hero-photo').getAttribute('src')).includes('/media/washington-'));
  assert.ok((await page.locator('.mg-dc-hero-photo').getAttribute('srcset')).includes('2560w'));
  await expect(page.locator('.mg-copyright-machine')).toBeVisible();
  for(const [index,item] of copy.milestones.entries()) {
    const control=page.locator('.mg-history-item button').nth(index);
    if(await control.getAttribute('aria-expanded')!=='true')await control.click();
    for(const value of item.events)await expect(page.locator('#history-'+index)).toContainText(value);
    await control.click();
  }
  const history = page.getByRole('button', { name: /2026 New Leadership/ });
  await history.click();
  await expect(history).toHaveAttribute('aria-expanded', 'true');
  await history.click();
  await expect(history).toHaveAttribute('aria-expanded', 'false');
  await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.images].every(image => image.complete));
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/hero-desktop.png' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width > 600 ? 1000 : 844 });
    for (const path of ['/', '/team', '/team/Joe.M', '/contact', '/careers', '/disclaimer']) {
      await page.goto(base + path);
      await page.locator('h1').waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px overflow on ${path}`);
    }
    report.viewports.push(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded','false');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Team' }).click();
  await expect(page).toHaveURL(base + '/team');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded','false');
  await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.images].every(image => image.complete));
  await page.screenshot({ path: 'test-results/team-mobile.png' });
  await page.goto(base);
  await page.screenshot({ path: 'test-results/hero-mobile.png' });
  await page.getByRole('button',{name:'Read more about Patent'}).click();
  const mobileService=page.getByRole('dialog',{name:'Patent',exact:true});
  await expect(mobileService).toBeVisible();
  await mobileService.getByRole('heading',{name:'Portfolio Management'}).scrollIntoViewIfNeeded();
  await expect(mobileService.getByRole('heading',{name:'Portfolio Management'})).toBeVisible();
  await mobileService.getByRole('button',{name:'Close service details'}).click();
  await expect(mobileService).toHaveCount(0);
  await page.goto(base + '/careers');
  await expect(page.locator('.mg-careers-grid')).toBeVisible();
  const careerText=normalize(await page.locator('body').innerText());
  for(const value of [...copy.careers.paragraphs,...copy.careers.perks.flatMap(perk=>[perk.title,perk.desc])])assert.ok(careerText.includes(value),'Career copy changed');
  await expect(page.getByRole('link',{name:'View Current Openings'})).toHaveAttribute('href',/^https:\/\/recruiting\.paylocity\.com\/recruiting\/jobs\/All\//);
  await expect(page.locator('.mg-careers-panel ul')).toHaveCount(0);
  await expect(page.locator('.mg-careers-terrain .mg-figure svg')).toBeVisible();
  await page.goto(base + '/contact');
  await expect(page.locator('iframe[title="Office Location"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'mailroom@mg-ip.com', exact: true }).first()).toHaveAttribute('href', 'mailto:mailroom@mg-ip.com');
  await page.getByLabel('First Name', { exact: true }).fill('Preview');
  await page.getByLabel('Last Name', { exact: true }).fill('Check');
  await page.getByLabel('Email', { exact: true }).fill('preview@example.test');
  await page.getByLabel('Message', { exact: true }).fill('Local preview validation only.');
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.getByText('Something went wrong. Please try again or email us directly.')).toBeVisible();
  assert.deepEqual(errors, []);
  report.checks.push('All retained photos load; every original biography array is present; search and filters; keyboard practice tabs; history accordion; mobile dialog, Escape and navigation; no overflow across routes; local preview never claims message delivery.');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile('test-results/browser-report.json', JSON.stringify({ ...report, errors }, null, 2));
  await browser.close();
}
