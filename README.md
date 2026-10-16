# MG-IP modern website

A local redesign of Muncy, Geissler, Olds & Lowe, P.C.'s website. The visual direction uses restrained navy, cool white and blue-gray surfaces, sans-serif headings paired with serif reading copy, architectural line work and interactive technical illustrations. Navigation uses a wordmark in the site's Mona Sans typeface; the original artwork remains in the footer. The original Washington, D.C. photograph and logo source assets are retained.

## Development

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5174
```

Preview: http://localhost:5174

```sh
npm run build
node tools/serve-production.mjs
```

Netlify uses `npm run build` and `dist`. The build prerenders all 48 pages and the 404 page, generates route-specific titles, descriptions, canonical/social metadata and structured data, and writes the sitemap, routing rules and cache headers. The local production audit server runs on http://127.0.0.1:4176 and mirrors these routes; Vite's generic preview fallback does not mirror Netlify's extensionless page routing.

The separate review site is https://mgip-modern-review.netlify.app, linked to `review/mgip-modern`. It has `SITE_PREVIEW=true`: all pages receive noindex metadata/headers, the CMS targets the review branch, and contact messages are not transmitted. The existing `mgipnewlook` Netlify project remains linked to `main`. After approval, merge the review branch into main through the normal review process; that site's existing Git integration will build the merged commit. Do not copy the review site's `SITE_PREVIEW` setting to production. Production canonical URLs remain on https://mg-ip.com.

## Release audit — October 16, 2026

All 48 generated pages passed raw-HTML metadata checks and Chrome console checks, including reduced-motion rendering. All 43 biographies and their original photos/content passed retention checks. The 404 route returns a real 404. Responsive checks cover 320, 390, 768 and 1440 pixels. Directory filters, keyboard/touch navigation, membership descriptions, service dialogs, contact field serialization and local delivery guards passed. Profile lists now have bullets; faint profile-intro linework, navy nav underlines and aligned Team caption controls complete the requested polish.

The homepage mobile Lighthouse lab run improved from performance 61 to 80, first contentful paint 5.6 to 1.7 seconds, and largest contentful paint 14.9 to 5.3 seconds. Accessibility, best practices and SEO scored 100. These are local simulated-mobile measurements, not field Core Web Vitals; the photo-heavy first view still has room to improve LCP. The original 1.8 MB photo is preserved, with responsive WebP derivatives, a high-priority preload, route splitting and deferred below-fold artwork. Hero text is visible in the static HTML without waiting for JavaScript. The font uses swap, and the identity widget loads only for account-confirmation/recovery URLs. Audit JSON, HTML reports and screenshots are generated under ignored `test-results/`.

```sh
npm run build
node tools/serve-production.mjs
# In another terminal:
node tests/release-audit.mjs
```

Use `SITE_PREVIEW=true` when building a local review artifact and `EXPECT_PREVIEW=true` when checking it. Netlify branch and deploy-preview builds set the review behavior automatically. No new runtime dependencies were added for the release audit.

## Structure and retained content

- `components/modern/` contains the new homepage, shared navigation/footer, team directory, biography, careers, contact and disclaimer pages.
- `modern.css` supplies the visual system and responsive layouts, on top of the existing utility styles. `editorial.css` contains the photographic hero, colored statistics cards, service previews/dialogs, typography pairing, and the full-width team linework composition.
- `content/firm-copy.json` retains the original hero, firm introduction, full service descriptions and details, benefits, statistics, milestones, and team/careers/contact copy verbatim. `tests/copy.test.mjs` compares that content against the retained original components. Layout and illustrations change; the firm's wording does not.
- `teamMembers_updated.js`, `lib/team.js`, `membershipMasterList.js`, the `pictures/` assets and the CMS content path remain the sources for profiles. No team biography data or photos were replaced. The directory lists every profile and links to full biographies, including the original experience, education, admissions, memberships and other populated sections.
- The prior page components are retained for reference; `App.jsx` routes visitors through the new components.
- The existing Netlify contact form field names and hidden form remain intact. The local preview does not transmit contact messages or claim delivery. Live form delivery needs verification on the existing Netlify setup.

## Motion

The homepage restores the original full-width Washington, D.C. photograph with centered white copy, rectangular actions and a bottom scroll cue. A minimal local text shadow and solid action fills support readability without changing the photograph or its overlay. It adapts to narrow and short mobile viewports with a transparent-to-white scrolling header. The firm statistics use navy, pale blue, teal and lavender cards with subtle circular corner shapes, counting from zero each time they return to view; their final values remain available to screen readers and reduced-motion users. The benefits use six colored editorial cards with crisp sans-serif descriptions, retaining every original description.

The homepage portrait mosaic includes every profile at the same size, alphabetically arranged. The Team hero uses restrained connected linework, with portraits appearing only in the directory on that page. The existing directory, filters and biography pages remain intact. Careers reuses the earlier interactive Hairline Terrain illustration, with explicit pause/play controls, separate from the service drafting instrument.

Each colored service preview shows its original introduction and a Read more button. The original detailed headings and paragraphs appear only in a native dialog, with keyboard focus containment, Escape and backdrop closing, background scroll locking, and focus return. Patent uses the drafting instrument; Trademark uses a press that prints a distinctive mark and small trademark symbol; Copyright uses a writing machine that types an original work. Their automatic cycles are approximately 10, 6.4 and 8 seconds. Pointer exploration resumes automatically after a short idle interval, while keyboard focus and explicit pause hold the figure. All stop outside the viewport or under reduced motion. The earlier trademark label and copyright document remain in their respective detail dialogs.

Motion supplies entrance transitions and pointer/keyboard artwork response. The earlier Three.js scene remains in the source for reference but is no longer rendered by the careers page. The supplied Motionmaxxing repository informed pacing and composition; its video-production workflow is not a browser dependency.

The project retains React 18 and uses Fiber 8. `.npmrc` skips peer auto-resolution of optional Expo/React Native packages, which are not used in this browser project.

## Browser verification

With the development server running:

```sh
node tests/browser.mjs
node tests/motion.mjs
node tests/drafting.mjs
node tests/service-art.mjs
node tests/memberships.mjs
node tests/interface-polish.mjs
node tests/design-revision.mjs
node tests/hero-navigation.mjs
node tests/team-directory.mjs
node --test tests/copy.test.mjs
```

Set `CHROME_PATH` for the main browser check if Chrome is installed outside the default Windows location; set `BASE_URL` if the Vite development server uses another address. The checks verify all original team photos and biography content, directory search and role filtering, practice tabs and detail dialogs, history controls, mobile navigation, local form behavior, and overflow at 320, 390, 768 and 1440 pixels. The motion check verifies intermediate/final counter values and replay on re-entry, moving documents, offscreen pauses, reduced motion, and equal visual weight for all team portraits. Reports and screenshots are saved to ignored `test-results/`.

References: [Hairline](https://github.com/lucasmarkes/hairline), [Motion](https://motion.dev/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [Motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing).

## Anatomy drafting instrument

The Patent service figure uses [Anatomy](https://github.com/wheresryan22/anatomy) geometry primitives under the MIT license, retained in `tools/anatomy/LICENSE`. Its original concept and parts plan are in `components/modern/drafting/DESIGN.md`. The Node generator vendors only the required build-time modules; the browser receives generated SVG strings and a small independent path model, with no additional rendering dependency. The pen, ink, and readout are driven by the same path. Pointer and keyboard exploration, pause/play, offscreen suspension and reduced motion are supported.

To regenerate its checked-in paths and audit five travel poses:

```sh
node tools/build-drafting.mjs --audit
```

The existing production build uses the checked-in generated `art.json`; it does not require the Anatomy repository or a network connection. The illustration is an engineering reference, not a representation of the firm's workflow or a legal outcome.

Visual references for the colored editorial panels and restrained motion: [Palantir](https://www.palantir.com/), [Foley](https://www.foley.com/), [Fish & Richardson](https://www.fr.com/), [Kilpatrick](https://ktslaw.com/). Their brand assets and copy are not used.

The service panels use three compact interactive instruments in that same visual family: the drafting plotter for Patent, a label-stamping press for Trademark, and a writing machine for Copyright. The full original service descriptions stay in Read more dialogs; the earlier trademark label and copyright document illustrations are retained inside those dialogs. Generate and audit the new instrument geometry with `node tools/build-service-art.mjs --audit` (or `--only=stamp` / `--only=writing`). Their concepts are documented in `components/modern/service-art/DESIGN.md`.

The shared footer uses an original exploded CPU and motherboard assembly: a routed circuit board, central CPU socket and processor, three supporting chips, four mounting posts, two memory modules, two expansion slots, five separate cooling fins and a small cooler cap, enclosed by a full-size vented hood and fasteners. Twenty-four moving groups spread into a readable exploded view, then build back together in stages: motherboard, processor and memory, cooling assembly, expansion slots, protective hood and fasteners. The CPU and supporting chips fan into the foreground so they remain visible beside the larger layers. The hood lifts clear of the internal components and closes over the complete assembly. The SVG shares its isometric projection with the Team drawing; it loads near the viewport and separates/reassembles on a seven-second loop, including while the pointer is over it. Autoplay stops offscreen and under reduced motion. Profile membership cards use the original names and descriptions from `membershipMasterList.js`; explanations open on hover, keyboard focus or tap, and dismiss with Escape, an outside tap or a second tap. Metadata is not rewritten, and organizations without reference metadata retain their original label. The disclaimer includes the original Scott Tulino responsibility statement and biography link.

Team filters and the optional contact title use the existing Headless UI dependency for styled listboxes with type-ahead, keyboard selection, outside dismissal and touch input. The contact title remains a serialized form field through React Hook Form. The Contact hero reuses the original Alexandria office photograph and original introductory copy. The four office details use compact spacing, smaller labels and icons, and 16px contact text; the map retains its source and 270px height. Send a Message uses a white bordered panel against the page background, with white fields and the existing validation and form delivery behavior. About-page content groups reset outside the viewport and replay their fade and rise on return using Motion; reduced motion and keyboard focus make content immediately visible, without a WebGL canvas. The footer retains its navy background and plain text credit: Website by CZR AI LLC.

The homepage navigation begins transparently over the full-screen photograph, then shifts to a compact white header after 48 pixels of scrolling. Its colors, height and wordmark animate back to their initial state at the top; reduced-motion users receive an immediate change. Opening the mobile dropdown gives the header a solid white background for readability. Other pages retain their white navigation. The existing Motion `useScroll` hook supplies that state; no new runtime dependency is added. Mobile navigation remains an animated, nonmodal disclosure with Escape, outside-click and keyboard dismissal. Careers, Team, Contact and Disclaimer retain their compact hero spacing.

The Team hero matches the supplied open diamond-tile network: twelve thin tiles in four groups connect to a larger central tile, without a shared pedestal. The satellite tiles lift gently at different points in a 4.6-second cycle, while the center has a smaller lift and lights travel along the four connecting paths. Pause/play, offscreen suspension and reduced-motion support remain available. Its light isometric drawing relates to the Careers terrain without person icons. The Careers terrain keeps its existing movement, with the caption Build your next chapter connecting rising terrain to professional growth. A–Z initials inherit the directory font, use matching medium weights and contrasting selected/unselected colors, and remain unboxed except for All. They filter first, middle or last initials alongside name, role and expertise filters and wrap into touch-friendly rows. The result count appears above the alphabet. Profile sections follow Bar admissions, Education, Memberships and other populated details, with Experience last in both the biography and its anchor navigation. All four desktop navigation links restore the original text-only style. Motion animates their left-to-right underline on hover and keyboard focus; the current page stays underlined. Underlines are white over the home photograph and teal on the white header. The mobile disclosure behavior remains intact.

The footer places both contact/team actions alongside its contact links and keeps moving geometry directly beneath the logo. The promotional headline and redundant About the firm disclosure are removed. Biographies use open editorial sections with plain headings, a single section divider and no numbers or decorative header icons. Credentials, expertise and awards remain clean lists; membership cards retain their interactive explanations. Only long reading passages such as Experience receive a subtle bordered frame. The portrait, contact details and contents return to an open sidebar. Desktop section navigation stays beside long biographies; mobile contents wrap into two columns. Motion supplies a brief entrance per section, with immediate reduced-motion, keyboard-focus and print access. All profile text, contact information, section order and membership explanations remain unchanged. Run `node tests/profile-panels.mjs` for anchor navigation, long-biography reading and narrow-screen checks.

Source Serif 4 provides a second voice for longer descriptions, biographies, credentials and the footer address. Why MG-IP descriptions, headings, navigation, buttons and contact controls use sans-serif typography. The Roman variable font is self-hosted at `src/fonts/SourceSerif4Variable-Roman.woff2`, from the [official Adobe Source Serif repository](https://github.com/adobe-fonts/source-serif/tree/release/WOFF2/VAR). Its SIL Open Font License is retained at `public/licenses/source-serif-OFL.md`; no Google Fonts request is needed.
