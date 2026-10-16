import { chromium, devices, expect } from '@playwright/test';
import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://127.0.0.1:4176';
const origin = process.env.SHARE_ORIGIN || 'https://mg-ip.com';
const preview = process.env.EXPECT_PREVIEW === 'true';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  const context = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/', '/team', '/careers', '/contact', '/team/Joe.M']) {
    const url = origin + route;
    const response = await fetch(base + route);
    assert.equal(response.status, 200);
    assert.equal(response.url, base + route, 'Server must not redirect to the live domain');
    const html = await response.text();
    assert.ok(html.includes(`rel="canonical" href="${url}"`), 'Initial HTML canonical');
    assert.ok(html.includes(`property="og:url" content="${url}"`), 'Initial HTML sharing URL');
    assert.ok(html.includes(`property="og:image" content="${origin}/og-image.jpg"`), 'Initial HTML sharing image');
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(base + route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', url);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', origin + '/og-image.jpg');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', origin + '/og-image.jpg');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', preview ? 'noindex, follow' : 'index, follow');
    await expect(page.locator('.mg-header')).toBeVisible();
  }
  const image = await fetch(base + '/og-image.jpg');
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /^image\/jpeg/);
  assert.deepEqual(errors, []);
  console.log(`Sharing URLs, image, canonical, indexing and mobile hydration passed for ${preview ? 'review' : 'production'} on five routes.`);
} finally {
  await browser.close();
}
