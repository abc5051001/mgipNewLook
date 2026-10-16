export function isPreviewBuild(env = process.env) {
  return env.SITE_PREVIEW === 'true' || ['deploy-preview', 'branch-deploy'].includes(env.CONTEXT) || Boolean(env.NETLIFY && env.BRANCH && env.BRANCH !== 'main');
}
