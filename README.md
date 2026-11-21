# Monolog

> Android-first AI keyboard and personal journal by NoTokens.

## Structure

- Monolog/: Native Android application (Kotlin, Jetpack Compose, IME service, Room, Keystore, Vox speech engine).
- Web Showcase: Interactive product showcase, keyboard playground demo, and design specs at repository root.

# Monolog — A keyboard. With a memory.

An original Vite product website with oversized editorial typography, generated 3D artwork, a playable keyboard, and scroll-driven feature chapters.

## Run and build

- Install: pnpm install
- Develop: pnpm run dev 
- Production build: pnpm run build
- Preview production: pnpm run preview
- Browser checks after building: pnpm test

The production output is dist/. Tests use installed Microsoft Edge on Windows; other hosts can install Chromium using npx playwright install chromium.

## Design and interactions

- Editable Beth Ellen wordmarks and handwritten accents, with Manrope and IBM Plex Mono. All fonts are hosted locally.
- Original generated ceramic-key artwork and a keyboard key unfolding into journal pages.
- Separate transparent hero keys pop into place once when the artwork enters view. Reduced-motion visitors see the settled arrangement.
- Working keyboard playground: letter keys, shift, backspace, space, punctuation polish and a clearly labelled voice-typing simulation. Drafts stay in memory in the current browser tab.
- Native scrolling drives a pinned horizontal feature story on desktop. Mobile and reduced-motion users get a regular vertical layout.
- Scroll reveals, animated waveform, Paper/Ink product previews, accessible tabs, incognito illustration and monthly/yearly pricing.
- Every contact action uses monolog@notokens.co. No signup or payment backend is implied.

## Files

- index.html: Product content and semantic markup.
- src/main.js: Interactions and scroll choreography.
- src/styles.css: Original responsive design.
- src/hero-keys.js and src/hero-keys.css: Viewport-triggered popcorn entrance and independent key motion.
- public/artwork/keys-v2/: Four transparent key assets, arranged as eight independent sculptures.
- public/artwork/: Optimized generated WebP assets.
- reference/generated/: Preserved original generated PNGs.
- reference/art-direction.json: Final image prompts, generation mode and inspiration notes.
- public/images/: Existing Monolog product concepts retained from Stitch.
- tests/showcase.spec.js: Production browser checks.
- design.md: Product design specification supplied in the project.

The initial Stitch export remains under reference/stitch-showcase.html. Its legacy importer and src/stitch.css are retained for reference; running scripts/import-stitch.mjs would replace the current custom homepage with the earlier import. It is not part of the build.

## Artwork and inspiration

Both new artworks were created with the built-in image_gen tool. No third-party artwork was copied. Final prompts and inspiration sources are documented in reference/art-direction.json. To re-encode the preserved artwork, run node scripts/optimize-artwork.mjs.

The replacement hero keys were generated individually with the built-in image_gen tool. Prompts are in reference/hero-keys-v2.json; originals are preserved in reference/generated/keys-v2/. Run node scripts/prepare-hero-keys.mjs to regenerate optimized WebP files from those originals.

## Product status

Monolog is in development. App screens, journal content and voice/AI illustrations are product previews. The website does not capture microphone audio, save journal entries, execute Android actions or accept payments. Pricing is proposed at ₹299/month or ₹3,372/year (₹281 monthly equivalent, about 6% annual savings). Local storage holds only the optional Paper/Ink preview preference.
