# Monolog — App Overview Brief

> **Purpose:** Give another agent (or a new conversation) everything it needs to understand, navigate and work on this project without re-reading source files from scratch.

---

## 1. What Monolog Is

**Monolog** is an **Android-first AI keyboard and personal journal app** by **NoTokens**.
It combines everyday typing, natural voice input, writing assistance, AI search and phone actions with a private, searchable memory of the user's day.

**Tagline:** *"Type. Speak. Act. Remember your side of the day."*

Monolog is a **Google Startup Buildathon 2026 Finalist** entry, using on-device Gemma + Android IME architecture.

---

## 2. The Problem It Solves

People's thoughts, plans and useful information are scattered across chats, screenshots, notes and apps. Writing, searching, setting reminders and manually journaling require repeated effort and app switching.

Monolog puts assistance *inside the keyboard* and connects information the user chooses to retain with a companion journal app — without leaving the current app or sacrificing privacy.

---

## 3. Three Connected Needs

| Need | Experience | Outcome |
|------|-----------|---------|
| **Express** | Familiar typing, Vox voice input, grammar & rewriting | Communicate naturally and clearly |
| **Act** | Contextual suggestions, AI search, reminders & phone actions | Complete tasks without losing the current conversation |
| **Remember** | Private journals, saved context, daily summaries & monthly recaps | Retrieve details and revisit a meaningful account of the day |

---

## 4. Main Features (Five Pillars)

### Pillar 1 — Everyday Keyboard
- Familiar QWERTY layout, suggestions, personal dictionary, clipboard, emojis, GIFs, resizing, customization.
- **Borderless keys** (no visible rectangles behind alphabetic keys).
- Paper (pearl-white) and Ink (black/charcoal) themes.
- Proactive inline suggestions: e.g. typing "exam at 5 PM" surfaces a one-tap reminder pill.

### Pillar 2 — Vox Voice Mode
- Hold the toolbar microphone to enter Vox Mode.
- Sustained, hands-free speech-to-text with live waveform, punctuation & formatting.
- Keeps colloquial phrasing; doesn't cut out after pauses.
- Multi-language toggle between English and regional dialects.

### Pillar 3 — Floating AI Panel
- Hold the lightning-marked spacebar → frosted glass overlay above the keyboard.
- Ask questions, web search with cited sources, follow-up conversations.
- Insert answers back into the current app's draft.
- Cloud AI is explicit opt-in per query (Firebase AI Logic + Gemini 1.5 Flash).

### Pillar 4 — Context Engine (`m` key)
- **Tap `m`:** Capture screen context (with permission), add text or voice note.
- **Hold `m`:** Quick shortcuts — Reminder, Alarm, Journal, Edit.
- Saved items go to a searchable **Context Library** (screenshots, photos, text notes, voice notes).

### Pillar 5 — Companion Journal & Memory
- With consent, eligible non-sensitive input contributes to daily memories.
- **Today Dashboard:** journal card, reminders, weather, Memory of the Day, customizable cards, ask/chat composer.
- **Journal Timeline:** reverse-chronological day entries, editable titles, source previews.
- **Monthly Recaps:** narrative summaries (e.g. "Narrative Nostalgia November"), user-reviewable before export.
- **Searchable Memory:** retrieve saved details by date, topic or natural-language question.

---

## 5. Keyboard Interaction Cheatsheet

| Gesture | Action |
|---------|--------|
| Tap `m` | Capture screen context + note |
| Hold `m` | Quick shortcuts (Reminder, Alarm, Journal, Edit) |
| Hold lightning spacebar | Open Floating AI panel |
| Tap microphone | Basic dictation |
| Hold microphone | Enter Vox mode |
| Hold period (`.`) key | Toggle manual incognito (default 15 min) |

---

## 6. Privacy Model

> [!IMPORTANT]
> Privacy is a core product pillar, not an afterthought.

**Four privacy states:**

| State | Capture | UI |
|-------|---------|-----|
| **Memory Off** | Zero keystrokes saved | Clean baseline keyboard |
| **Memory On** | Consented, eligible input only → encrypted local Room DB | Normal theme, discoverable status |
| **Manual Incognito** | No capture; 15 min default, configurable | Countdown icon visible |
| **Protected Input** | Automatic; password/PIN/OTP/banking apps | "Memory paused for this field" — cannot be overridden |

**Key rules:**
- Personal memory stays **on-device by default**; encrypted with Android Keystore AES-256-GCM.
- Cloud AI receives only explicit requests and selected context.
- No raw keystroke logging. No silent uploads. No telemetry.
- Optional encrypted backup → user's Google Drive.
- Journal represents the user's *available* input — Monolog cannot read incoming messages or prove a draft was sent.

---

## 7. Visual Identity

**Themes:** Paper (pearl-white surfaces, dark text) and Ink (black/charcoal surfaces, white text).

**Key tokens (Paper / Ink):**
- Background: `#FAFAFC` / `#08090B`
- Surface: `#FFFFFF` / `#16171C`
- Primary text: `#151823` / `#F7F8FC`
- Aurora accents: subtle blue/lavender/blush radial gradients — never dominant.

**Logo:** Handwritten lowercase **m** (Beth Ellen font) on a rounded white keyboard key with three page layers extending down-right. Wordmark: handwritten **monolog.**

**Materials:** Frosted glass containers/backgrounds, borderless keys, no glow/shadow on text, restrained blue/lavender accents. Avoid saturated or neon colors.

**Typography:** Roboto (design baseline), 4 dp spacing scale.

---

## 8. Subscription & Pricing

| Plan | Price | Key inclusions |
|------|-------|---------------|
| **Free** | ₹0 forever | Full keyboard, local journal, basic search, basic Vox/grammar, incognito, banking shield |
| **Pro Monthly** | ₹299/month | 10× Vox & AI pool, advanced rewrites, writing styles, NL memory questions, richer recaps |
| **Pro Yearly** | ₹3,372/year (₹281/month) | All Pro features + priority Gemma updates, unlimited pins, Drive backup, founder support |

Annual saving: ₹216 (~6%). Privacy protections, deletion, and basic export stay free forever.

---

## 9. Technical Stack (Planned)

> [!NOTE]
> These are **planning decisions**, not verified implementation claims. Inspect any recovered code before reporting features as implemented.

| Layer | Technology |
|-------|-----------|
| Platform | Native Kotlin, Android 12+ (API 31+) |
| UI | Jetpack Compose (IME + main app) |
| Local storage | Encrypted SQLite Room + Android Keystore (AES-256-GCM, TEE/StrongBox) |
| On-device AI | Google Gemma 2B via LiteRT-LM (TF Lite) on Snapdragon/Tensor NPUs |
| Cloud AI | Firebase AI Logic + Gemini 1.5 Flash (explicit opt-in per query) |
| Speech | ML Kit / on-device recognition |
| OCR | ML Kit for screenshot text extraction |
| Backup | Optional encrypted Google Drive |

Gemini Nano is future evaluation, not the current dependency.

---

## 10. Current Project State

### What exists in the workspace (`q:\ybtheflash stuff\monolog`)

This is a **Vite product showcase website**, not the Android app itself. It was built by pulling a Stitch design and reimplementing it as an original site.

**Stack:** Vite 8 + Tailwind CSS 3 + vanilla JS + Playwright tests.

**Key files:**

| Path | Purpose |
|------|---------|
| `index.html` | Full product showcase page — hero, feature pillars, interactive UI explorer, privacy section, pricing, FAQ, CTA, footer |
| `src/main.js` | Scroll interactions, tab switching, keyboard playground, waveform animation |
| `src/styles.css` | Custom responsive design (37 KB) |
| `src/keyboard.css` | Keyboard playground styles |
| `src/keyboard-demo.js` | Interactive keyboard demo engine (typing, presets, vox, ai, recovery) |
| `src/keyboard-demo.css` | Demo styling (presets, floating panel, vox stage, chat canvas) |
| `design.md` | **529-line product design specification** — the canonical feature/UX/privacy reference |
| `README.md` | Build instructions, design notes, file map |
| `public/images/` | 11 product concept PNGs from Stitch (keyboard themes, Vox, AI panel, journal, banking, etc.) |
| `public/artwork/` | 2 original generated WebP artworks (key-constellation, memory-unfolding) |
| `reference/stitch-showcase.html` | Original Stitch HTML export (retained for reference) |
| `reference/art-direction.json` | Image generation prompts and inspiration |
| `tailwind.config.js` | Custom theme: paper/ink colors, brand colors, glass shadows |
| `tests/showcase.spec.js` | Playwright browser checks |

**Build commands:**
```
npm install
npm run dev        # Vite dev server on 127.0.0.1
npm run build      # Production → dist/
npm run preview    # Preview production build
npm test           # Playwright tests (needs Edge or Chromium)
```

**Website features (implemented):**
- Editable Beth Ellen wordmarks, Manrope + IBM Plex Mono typography, locally hosted fonts.
- Working keyboard playground (letter keys, shift, backspace, space, voice-typing simulation).
- Scroll-driven horizontal feature story (desktop); vertical fallback (mobile / reduced-motion).
- Paper/Ink theme toggle, interactive tab explorer (6 UI modes), animated waveform.
- Pricing section, FAQ accordion, CTA section.
- Contact: `monolog@notokens.co`. No signup or payment backend.

### What does NOT exist yet
- **No Android app source code** in this workspace.
- No Kotlin, Gradle, or Android project files.
- No working keyboard IME, journal, AI panel, or voice features.
- Earlier materials reference an initial prototype elsewhere, but nothing is committed here.

---

## 11. Stitch Project Reference

The Monolog design assets live in a **Google Stitch** project:
- **Project:** `projects/11118739141767189196` ("Monolog Showcase Website")
- **Key screens:** "Monolog — Product Showcase" (DESIGN, 2560×19478 HTML+screenshot), plus 11 concept PNGs (Reminder, Privacy, AI Mode, Ink Theme, Vox Mode, Context Library, Journal Timeline, Monolog Home, etc.) and a `design.md` document.
- The Stitch HTML was the starting point; the current site is a custom reimplementation.

---

## 12. Target Audience

Android students and young professionals who message, dictate, make plans and save information throughout the day. Also: creators, freelancers, journal users, and people who prefer speaking over typing.

---

## 13. Design Principles (from design.md)

1. **Familiar first.** Everyday typing must stay fast when AI is unused.
2. **A journal worth returning to.** An intentional reflection experience, not just an activity archive.
3. **Keep the user in the moment.** Preserve host app draft and focus.
4. **Private by default.** Capture and cloud processing need clear boundaries.
5. **Help without acting silently.** Suggestions ≠ permission to execute.
6. **Separate evidence from interpretation.** A typed sentence doesn't prove it was sent.
7. **Accessible interaction paths.** Long-press gestures always have visible alternatives.

---

## 14. Key Warnings for Agents

> [!CAUTION]
> - **Do not describe features as implemented** unless you verify working code. The workspace contains a showcase website, not the Android app.
> - **Do not claim "captures everything"** or "always detects sensitive data" — Monolog captures the user's *available side*.
> - **Do not claim the product is completely offline** — some planned features (AI panel web search, Drive backup) use cloud services.
> - **The Stitch API key** in earlier chat messages is exposed and should be rotated before production use.
> - **Pricing is proposed**, not validated. Exact usage quotas are undecided.
> - **Gemini Nano** is future evaluation; current local dependency is Gemma 2B via LiteRT-LM.
