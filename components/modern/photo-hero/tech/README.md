# Cursor lighting

ReactBitsCursorGrid.jsx and CursorGrid.css are vendored from React Bits by David Haz:
https://github.com/DavidHDev/react-bits/tree/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/content/Animations/CursorGrid

The original MIT + Commons Clause license is retained in ReactBits-LICENSE.md.
The component may be used in a commercial website; the component itself may not
be resold. Local modification: a scoped prop-types lint exemption for this
vendored source, and removal of the Next.js-specific 'use client' directive for
Vite.

Cursor Grid also has two local props, `paused` and `interactive`, to respect the
hero's viewport, document visibility and reduced-motion state. Pointer interaction
accepts only a mouse. Cleanup deletes owned GL resources without forcibly losing
the canvas context, allowing React Strict Mode to replay setup on the same canvas.

PhotoHero uses 72px square cells with crisp hover highlights and no click pulse.
A CSS-masked copy of the same image reveals some original brightness below the
pointer. Local copy masks remain above this image. The grid and image reveal are
disabled on touch/narrow layouts; reduced motion disables hover and animation.
The existing Motion library retains the firm-name and paragraph entrances.

No new package dependencies were installed. Without WebGL2 the decorative canvas
stays transparent; the photo, blur, copy and links still work.
