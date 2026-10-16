export const homeImage = '/media/washington-1920.webp';
export const homeSrcSet = [640, 1280, 1920, 2560].map(width => `/media/washington-${width}.webp ${width}w`).join(', ');
// Covering a portrait viewport needs a source wider than the visible crop.
export const homeSizes = '(max-aspect-ratio: 8/5) 164svh, 100vw';
export const portraitMedia = '(max-width: 720px) and (orientation: portrait)';
export const landscapeMedia = '(min-width: 721px), (orientation: landscape)';
export const portraitSrcSet = [480,800,1200].map(width=>`/media/washington-portrait-${width}.webp ${width}w`).join(', ');
export const officeImage = '/media/alexandria-960.webp';
export const officeSrcSet = [480, 960, 1440].map(width => `/media/alexandria-${width}.webp ${width}w`).join(', ');
