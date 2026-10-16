// CMS invitation/recovery links still work without loading the widget for every visitor.
if (/(?:invite_token|recovery_token|confirmation_token|access_token)=/.test(window.location.hash)) {
  const widget = document.createElement('script');
  widget.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
  widget.async = true;
  document.head.append(widget);
}
