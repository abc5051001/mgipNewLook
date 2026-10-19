# D.C. photo hero

The default About page uses the original Jefferson Memorial photograph, with the
firm name and Engineering / Science / Law at the lower left, the original firm
description above and to the right, and actions at the lower right. Existing
responsive WebP sources preserve the photo's composition on phones.

The photo has no overall tint. Feathered masks support the desktop text: an even
26% navy layer across the paragraph, fading horizontally and vertically outside
its bounds, and a soft radial gradient behind the firm-name block. Neither uses
text shadows, boxes, or architectural lines. Mobile removes both masks and makes
the whole paragraph white. Its copy sits 35svh from the top; Contact Us aligns
left beside an outlined Learn More action.

A rounded 1500px maximum-width tray uses a 12px blur and 25% navy tint behind the
header wordmark and unboxed Mona Sans navlinks. After scrolling, About uses the
same navbar height, logo size, and spacing as Team, Careers, and Contact: a 92px
inner height on desktop and 76px on mobile. The tray appears only at the top with
the mobile menu closed.

The name and paragraph drop word by word into clipped masks, hold while visible,
and replay when they return to view. The eyebrow, expertise line, and actions
also replay the shared fade and rise. Reduced motion displays completed text
immediately. Prerendered text is visible before hydration and without JavaScript.
Accessible unanimated copy prevents individual words from being read separately.

The reference is the user's SolarInsight screenshot and matching local source at
`C:/Users/llol1/Desktop/downloaded/remix_-cosmo/src/pages/Home.tsx`. Its separated
text areas and Manrope typography informed the composition; its assets and
preloader are not included. Manrope is self-hosted, with its SIL Open Font License
alongside the font. All original wording and content below the hero are retained.

Run `node tests/photo-hero.mjs` against the local server for layout, typography,
contrast styling, reduced-motion, and entrance-replay checks.
