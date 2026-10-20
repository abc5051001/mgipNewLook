# D.C. photo hero

The default About page uses the original Jefferson Memorial photograph, with the
firm name and Engineering / Science / Law at the lower left, the original firm
description above and to the right, and actions at the lower right. Existing
responsive WebP sources preserve the photo's composition on phones.

The photo has a 22% overall black tint on desktop and 18% on mobile. Light backdrop
blur softens the branches behind the words: 36% navy tint and 3px blur behind the
desktop paragraph, 30% and 1.5px behind the firm-name block. Mobile relies on the
overall photo tint, with no extra backdrop tint or blur behind either text block.
Its paragraph stays white. Broad, continuously fading desktop
masks preserve photo detail and avoid the flat centers of a frosted panel.
There are no text shadows or circular masks.
Mobile copy sits 35svh from the top; Contact Us aligns left beside an outlined
Learn More action.

The hero uses React Bits' WebGL Cursor Grid: 72px square cells,
faint resting lines, pale-blue highlights within 190px of the pointer, and a 950ms
fade after a short hold. The rectangular structure echoes the site's technical
artwork. Motion retains the original text entrances; the navbar is unchanged.

A second picture element reuses the same responsive photo source. It appears above
the overall image tint through a 440px feathered square mask, at 62% opacity,
revealing more of the original brightness near the pointer. No second photo asset
is generated. The local text masks remain above it, protecting copy contrast.
The reveal fades away on pointer leave. Touch and narrow layouts disable the grid
and reveal; reduced motion disables interaction. Grid animations pause offscreen
and in hidden tabs. See tech/README.md for pinned source, license, and adaptations.

The darker photo treatment follows the contrast principle of the Scale homepage
reference: white copy and light motion stand against a quieter, darker image.

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
