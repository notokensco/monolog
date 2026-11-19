import { readFile, writeFile, mkdir } from 'node:fs/promises'

// The untouched export is retained so future updates can be compared with Stitch.
const original = await readFile('reference/stitch-showcase.html', 'utf8')
await mkdir('reference', { recursive: true })
await mkdir('public/images', { recursive: true })
await mkdir('src', { recursive: true })
await writeFile('reference/stitch-showcase.html', original)

const config = original.match(/tailwind\.config = ([\s\S]*?)\n  <\/script>/)[1].trim()
await writeFile('tailwind.config.js', `import forms from '@tailwindcss/forms'\nimport containerQueries from '@tailwindcss/container-queries'\nconst config = ${config}\nconfig.content = ['./index.html', './src/**/*.{js,css}']\nconfig.plugins = [forms, containerQueries]\nexport default config\n`)

const embeddedStyles = [...original.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]).join('\n')
await writeFile('src/stitch.css', `/* Original Stitch styles. */\n${embeddedStyles}\n`)

const images = new Map()
for (const match of original.matchAll(/<img\b[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/g)) {
  const [, alt, url] = match
  if (!images.has(url)) images.set(url, `${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}.webp`)
}
await Promise.all([...images].map(async ([url, filename]) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${filename}`)
  const mime = response.headers.get('content-type') || ''
  if (!mime.startsWith('image/')) throw new Error(`Expected an image: ${filename}`)
  const extension = mime.includes('png') ? '.png' : mime.includes('jpeg') ? '.jpg' : '.webp'
  const local = filename.replace(/\.webp$/, extension)
  images.set(url, local)
  await writeFile(`public/images/${local}`, Buffer.from(await response.arrayBuffer()))
  console.log(`Saved ${local}`)
}))
await writeFile('reference/assets.json', JSON.stringify(Object.fromEntries(images), null, 2) + '\n')

let html = original
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
  .replace(/<!--[^]*?-->/g, '')
  .replace(/ onclick="setVisualTheme\('([^']+)'\)"/g, ' data-theme="$1"')
  .replace(/ onclick="switchTab\('([^']+)'\)"/g, ' data-tab="$1"')
  .replace(/viewbox=/g, 'viewBox=')
for (const [url, filename] of images) html = html.replaceAll(url, `/images/${filename}`)
html = html.replace(/<img alt="Monolog Logo"[^>]*\/>/g, '<span class="brand-logo">$&</span>')

html = html.replace('</head>', `
<meta name="description" content="Explore Monolog, the privacy-first Android keyboard and journal. Discover Vox voice typing, floating AI, personal memories, and Paper and Ink themes." />
<meta name="theme-color" content="#FAFAFC" />
<link rel="icon" type="image/png" href="/images/monolog-icon.png" />
<script type="module" src="/src/main.js"></script>
</head>`)
html = html.replace('<header ', '<a class="skip-link" href="#main-content">Skip to content</a>\n<header ')
html = html.replace('<section class="relative overflow-hidden pt-12', '<main id="main-content">\n<section class="relative overflow-hidden pt-12')
html = html.replace('<footer ', '</main>\n<footer ')

// Reflect design.md's proposed-product status instead of shipping dummy downloads.
const copy = [
  ['Google Startup Buildathon Finalist: On-device Gemma + Android IME Architecture', 'Meet Monolog: your keyboard, voice assistant and private journal'],
  ['Google Startup Buildathon Finalist Entry', 'Monolog · Product concept'],
  ['v1.0 for Android', 'Made for Android'],
  ['Join Android Beta', 'Android release updates'],
  ['Gemma 2B On-Device', 'Local-first memory'],
  ['Zero Telemetry', 'Consent-led capture'],
  ['Android Keystore AES-256', 'Privacy controls built in'],
  ['Privacy-First Android IME &amp; Personal Journal', 'Privacy-first Android keyboard &amp; personal journal'],
  ['No Typing Latency:', 'Familiar first:'],
  ['Rendered at 120Hz using Android Jetpack Compose Canvas keys.', 'Everyday typing stays fast and predictable, with or without AI.'],
  ['Zero App Context Leakage:', 'Local-first processing:'],
  ['Processing happens via on-device regex &amp; local intent classification.', 'Eligible input is processed under your chosen memory and privacy settings.'],
  ['Our on-device formatting model automatically injects capitalization, commas, and periods while preserving your authentic voice.', 'Intelligent formatting adds capitalization, commas, and periods while preserving your authentic voice. Availability depends on the device and release.'],
  ['Android IME System Service &amp; Google Gemma Integration', 'Planned native Android architecture · implementation in progress'],
  ['Android 12 (API 31)+', 'Android-first'],
  ['Encrypted SQLite Room database keyed with Android Keystore 256-bit AES-GCM. Keys never leave the secure hardware enclave (TEE/StrongBox).', 'Planned encrypted Room storage protected with Android Keystore. Personal memories stay local by default, with review, deletion and export controls.'],
  ['2. On-Device Gemma SLM', '2. Device-Aware Local AI'],
  ['Google Gemma 2B model executed via LiteRT-LM (TensorFlow Lite runtime) directly on Snapdragon/Tensor NPUs for offline summarization and formatting.', 'On-device summarization and writing assistance are planned for supported devices. Model choice and runtime support will be validated during development.'],
  ['Firebase AI Logic + Gemini 1.5 Flash utilized strictly when user triggers the web search pill in the floating panel. Explicit opt-in per query.', 'Firebase AI Logic and Gemini are planned for explicit AI requests, grounded search and supported actions. Only the request and user-selected context are sent.'],
  ['Our core keyboard and complete on-device privacy are free forever. Pro unlocks unlimited multi-modal voice and deeper historical synthesis.', 'The core keyboard and privacy controls stay free. Pro expands voice and AI allowances, writing assistance and personal-memory features. Proposed launch pricing below.'],
  ['10× Expanded Vox &amp; AI pool', 'Expanded Vox &amp; AI allowance'],
  ['Priority access to Gemma on-device beta updates', 'Saved writing styles and vocabulary'],
  ['Unlimited context card pins in Journal', 'Enhanced journal and recap exports'],
  ['Cloud encrypted sync backup via Google Drive', 'Richer weekly and monthly recaps'],
  ['Direct founder engineering support', 'Advanced routines and writing assistance'],
  ['Install Free APK', 'Explore Free'],
  ['Subscribe Monthly', 'Explore Pro Monthly'],
  ['Get Pro Yearly', 'Explore Pro Yearly'],
  ['Monolog Lifetime Privacy Guarantee:', 'Privacy belongs in every plan:'],
  ['Local encryption, incognito modes, 1-click database erasure, and standard Markdown export remain completely free forever.', 'Encryption, incognito, deletion and basic export are included in both Free and Pro. Usage allowances will be finalized before launch.'],
  ['Download the early build APK today or sign up for Google Play Internal Testing.', 'Monolog is in development. Explore the product concept and get in touch about Android release updates.'],
  ['href="#download-apk"', 'href="mailto:monolog@notokens.co?subject=Monolog%20Android%20release%20updates"'],
  ['Download Signed APK (v1.0-alpha)', 'Ask about Android access'],
  ['href="#play-store"', 'href="#interactive-showcase"'],
  ['Request Google Play Track', 'Explore the interfaces'],
  ['MD5: 8f9b2a7d4e1c0b3a • Requires Android 12+ • 48 MB', 'Product preview · Android release and device support to be announced'],
  ['href="#">GitHub (Public Core)', 'href="https://github.com/notokensco/monolog">GitHub'],
  ['href="#">Terms of Service', 'href="#release-notes">Release status'],
  ['href="#privacy">Privacy Policy', 'href="#privacy">Privacy principles'],
  ['Yes. The core QWERTY keyboard, local SQLite Room storage, Vox speech model, and Gemma 2B on-device models operate 100% offline. Network connectivity is only utilized if you choose to trigger cloud web-grounding or Google Drive encrypted backups.', 'Everyday typing, local journals and basic search are designed to work offline. Voice and advanced local AI depend on device support. Cloud AI search and optional backups require a connection and explicit user action.'],
  ['Any password field, PIN, OTP, banking app package ID, or incognito browser tab triggers immediate automatic lockdown.', 'Sensitive fields and supported app signals pause memory capture automatically. Manual incognito and app-level controls add another layer of choice.'],
  ['Zero override allowed', 'Sensitive-input protection'],
]
for (const [from, to] of copy) html = html.replaceAll(from, to)

html = html.replace('id="download">', 'id="download" aria-labelledby="release-title">')
html = html.replace('Ready for a more mindful keyboard?', '<span id="release-title">Ready for a more mindful keyboard?</span>')
html = html.replace('Product preview · Android release', '<span id="release-notes">Product preview</span> · Android release')

// Keep compact navigation out of the desktop link row and provide a mobile menu.
html = html.replace('class="hidden md:flex items-center space-x-7', 'class="hidden xl:flex items-center space-x-7')
html = html.replace('aria-label="Main Navigation"', 'id="desktop-nav" aria-label="Main navigation"')
const navLinks = html.match(/<nav[^>]*id="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)[1]
html = html.replace('</header>', `<button id="menu-toggle" class="mobile-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>\n<nav id="mobile-nav" aria-label="Mobile navigation" hidden>${navLinks}</nav>\n</header>`)
html = html.replace(/\n\s*\n\s*\n/g, '\n\n')
const imageTags = [...html.matchAll(/<img\b[^>]*src="(\/images\/[^\"]+)"[^>]*>/g)]
for (const [index, match] of imageTags.entries()) {
  const buffer = await readFile(`public${match[1]}`)
  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)
  const attributes = ` width="${width}" height="${height}" decoding="async"${index > 1 ? ' loading="lazy"' : ''}`
  html = html.replace(match[0], match[0].replace('/>', `${attributes}/>`))
}
await writeFile('index.html', html)
console.log(`Imported showcase and ${images.size} original assets.`)
