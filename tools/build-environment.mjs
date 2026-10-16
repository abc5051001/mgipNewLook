export function isPreviewBuild(env = process.env) {
  return env.SITE_PREVIEW === 'true' || ['deploy-preview', 'branch-deploy'].includes(env.CONTEXT) || Boolean(env.NETLIFY && env.BRANCH && env.BRANCH !== 'main');
}

export function previewOrigin(env = process.env) {
  if (!isPreviewBuild(env)) return '';
  const branchPreview = ['deploy-preview', 'branch-deploy'].includes(env.CONTEXT);
  const url = branchPreview ? env.DEPLOY_PRIME_URL || env.URL : env.URL || env.DEPLOY_PRIME_URL;
  return url ? new URL(url).origin : '';
}
