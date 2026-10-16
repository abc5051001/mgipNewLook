import test from 'node:test';
import assert from 'node:assert/strict';
import { previewOrigin } from '../tools/build-environment.mjs';

const primary = 'https://mgip-modern-review.netlify.app';
const branch = 'https://review-mgip-modern--mgip-modern-review.netlify.app';

test('a separate review site shares its primary URL even when Netlify supplies a branch alias', () => {
  assert.equal(previewOrigin({ SITE_PREVIEW: 'true', CONTEXT: 'production', URL: primary, DEPLOY_PRIME_URL: branch }), primary);
});

test('branch and pull request previews share their own deployment URL', () => {
  for (const context of ['branch-deploy', 'deploy-preview']) {
    assert.equal(previewOrigin({ CONTEXT: context, URL: primary, DEPLOY_PRIME_URL: branch }), branch);
  }
});

test('production keeps the official website metadata', () => {
  assert.equal(previewOrigin({ CONTEXT: 'production', NETLIFY: 'true', BRANCH: 'main', URL: primary, DEPLOY_PRIME_URL: branch }), '');
});

test('local builds without a deployment URL keep the default metadata', () => {
  assert.equal(previewOrigin({}), '');
  assert.equal(previewOrigin({ SITE_PREVIEW: 'true' }), '');
});
