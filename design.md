# Monolog — Product Design Specification

Version: 1.0  
Updated: 20 November 2026  
Team: NoTokens  
Platform: Android  
Status: Proposed product design. This document describes intended behavior, not shipped capabilities.

## 1. Product definition

Monolog is a privacy-first AI keyboard **and a personal journal**. The keyboard helps people express themselves and take action in the app they are already using. The journal helps them make sense of, search and revisit **“your side of the day.”**

The journal is a primary product experience, with its own navigation, timeline, editor, context library and memory retrieval. It must receive the same design attention as the keyboard, Vox and AI panel.

Brand line:

> Type. Speak. Act. Remember your side of the day.

### Three connected needs

| Need | Experience | Outcome |
| --- | --- | --- |
| Express | Familiar typing, Vox voice input, grammar and rewriting | Communicate naturally and clearly |
| Act | Contextual suggestions, AI search, reminders and supported phone actions | Complete small tasks without losing the current conversation |
| Remember | Private journals, saved context, daily summaries and monthly recaps | Retrieve details and revisit a meaningful account of the day |

### Initial audience

Android students and young professionals who message, dictate, make plans and save information throughout the day. Additional users include creators, freelancers, journal users and people who find speaking easier than typing.

### Design principles

1. **Familiar first.** Everyday typing must remain fast and predictable when AI is unused or unavailable.
2. **A journal worth returning to.** Build an intentional reflection and retrieval experience, beyond an activity archive.
3. **Keep the user in the moment.** Preserve the host app's draft and focus when opening keyboard tools.
4. **Private by default.** Capture and cloud processing require understandable boundaries and controls.
5. **Help without acting silently.** Suggestions do not imply permission to save a reminder, send a message or execute a command.
6. **Separate evidence from interpretation.** An entered sentence does not prove that a message was sent or an event happened.
7. **Accessible interaction paths.** Long-press gestures have visible, accessible alternatives.

## 2. Scope and priorities

### First usable release

- Reliable Android keyboard with Paper and Ink themes, borderless keys, suggestions and essential settings.
- Explicit memory onboarding, local journal capture controls, manual journaling, daily timeline and local search.
- Sensitive-input protection and manual incognito.
- Vox voice typing with transcript review and basic writing assistance.
- The `m` context key, permission-based capture and a searchable context library.
- A floating AI panel for explicit requests and sourced web search.
- Supported reminders, alarms and Journal shortcuts, with validated execution.
- Transparent Free and Pro allowances and subscription management.

### Subsequent enhancements

- Richer personal-memory questions and weekly/monthly narratives.
- Narrative Nostalgia November and equivalent month-specific recaps.
- Additional languages, custom vocabulary, reusable writing styles and routines.
- Optional encrypted backup and recovery after the restoration experience is validated.
- Additional on-device model support, including future evaluation of Gemini Nano.

The interface must not advertise unavailable features as working. Feature visibility and capability messaging follow the actual device and release configuration.

## 3. Product surfaces and navigation

| Surface | Primary job | Entry points |
| --- | --- | --- |
| Keyboard | Type, speak, improve text and access assistance | Any supported editable field after IME setup |
| Vox | Dictate and refine text into the active field | Hold toolbar microphone; accessible toolbar/menu action |
| AI panel | Search, ask questions and request supported actions | Hold lightning spacebar; toolbar/menu action |
| Context capture | Review and save a screenshot, text or voice note | Tap `m`; Android share/import where supported |
| Today | Overview of the current day and journal | App launch; home navigation |
| Journal | Daily timeline, entries and monthly recaps | Bottom navigation; `m` shortcut |
| Library | Browse and search saved source material | Bottom navigation; context cards |
| Settings | Privacy, keyboard, voice, storage and account controls | App menu; keyboard menu |

Main app bottom navigation: **Today · Journal · Library**. Settings is available through the app menu. A persistent ask/chat composer is available on the main journal surfaces, without obscuring scroll content.

Opening the main app is an intentional navigation action. Search, dictation and supported quick actions should otherwise remain available from the keyboard.

## 4. Visual identity

### Official logo

- Use the approved `monolog-logo-v3` artwork as the source of truth.
- The face is a white rounded keyboard key carrying the **lowercase Beth Ellen `m`**, optically aligned toward the left and vertically centered.
- Three disciplined page layers extend down and right, visible on the right edge, around the lower-right corner and along the bottom.
- Do not substitute an uppercase `M`, a generic italic `m`, a spiral notebook or an AI sparkle mark.
- Do not redraw or generate a new interpretation for each screen. Reuse the approved asset.
- Small sizes must preserve the face and handwritten mark; simplify page-edge detail only through a deliberate small-size asset.
- The handwritten `monolog.` wordmark is brand typography, not a font for product body copy.

### Themes and color tokens

White and black lead the palette. Aurora is a quiet supporting material, never a competing color system.

| Semantic token | Paper | Ink |
| --- | --- | --- |
| Background | `#FAFAFC` | `#08090B` |
| Surface | `#FFFFFF` | `#16171C` |
| Raised surface | `#F1F2F6` | `#22232A` |
| Primary text | `#151823` | `#F7F8FC` |
| Secondary text | `#535B6B` | `#B9BFCC` |
| Divider | `#D9DDE6` | `#393C46` |
| Primary action background | `#151823` | `#F7F8FC` |
| Primary action text | `#FFFFFF` | `#151823` |
| Aurora blue | `#DCE8F7` | Pale blue used sparingly behind dark surfaces |
| Aurora lavender | `#E8E2F3` | Pale lavender used sparingly behind dark surfaces |
| Aurora blush | `#F4E7EB` | Optional faint accent; never a large bright patch |

These are initial design tokens. Validate final combinations against contrast requirements and bind them to semantic theme roles during implementation.

### Materials

- Paper uses pearl-white surfaces and softly blurred blue, silver, lavender and faint blush at the left and right corners.
- Ink uses black/charcoal surfaces with low-intensity pale corner color and white accents.
- Glass belongs to containers, cards and keyboard backgrounds. Do not put an individual glass box behind every key.
- Add sufficient surface opacity beneath text. Content must remain readable regardless of the host app or wallpaper.
- Avoid saturated mint, teal, orange washes, neon purple, hard blooms and smoky text shadows.
- Text is always crisp. Do not apply drop shadows or glow to headings, answers or labels.
- Provide opaque and reduced-transparency fallbacks. Blur is decorative, not necessary for comprehension.

### Typography and spacing

- Use Android's familiar sans-serif typography, with Roboto as the design baseline.
- Suggested type scale: 28–32 sp page titles, 20–24 sp section headings, 16 sp body, 14 sp supporting text and 12 sp secondary metadata.
- Support system font scaling; important content must not depend on fixed-height text containers.
- Use a 4 dp spacing scale, with 8, 12, 16, 24 and 32 dp as common intervals.
- App content uses approximately 16–24 dp side padding. Cards use consistent radii around 20–24 dp; small controls use smaller radii.
- Prefer monochrome line icons. Every unfamiliar icon has an accessible name and discoverable explanation.

## 5. Keyboard layout

### Baseline

Use a familiar QWERTY layout with consistent column spacing and predictable shift, backspace, symbol and enter positions. Adapt to language and field type. Key faces are **borderless**: no individual rectangles behind alphabetic keys. The entire cell remains interactive even though its boundary is invisible.

The keyboard must work in compact widths, landscape, system insets and supported large-screen layouts. Reference phone mockups are visual direction, not fixed production dimensions.

### Toolbar

| Position | Control | Behavior |
| --- | --- | --- |
| Left | Menu/dropdown | Open tools, settings and pinned actions |
| Center | Suggestions | Dictionary predictions, writing help or one useful contextual action |
| Right, before context key | Microphone | Tap for basic dictation; hold to enter Vox |
| Far right | Official `m` key | Tap for context capture; hold for quick shortcuts |

The toolbar can be customized through a deliberate edit mode. Do not make ordinary taps accidentally drag controls. Keep the context key and privacy state discoverable. If space is constrained, shorten or overflow suggestions rather than shrinking touch targets or overlapping icons.

### Bottom row

`?123` · emoji/language control · spacebar · period/incognito · enter/action

- Tap spacebar to insert a space. Hold the lightning-marked spacebar to enter AI mode.
- Emoji and language switching default to a combined control left of the spacebar. Provide separate accessible actions and a setting to show, hide or reposition the language control.
- Tap period to insert `.`. Hold it to toggle manual incognito.
- Show the incognito hat-and-glasses indicator above the dot within the **same period-key area**. Do not introduce an extra standalone key.
- Enter adapts to the host field: new line, search, next, done or send as supported. It must not unpredictably trigger an AI action.
- Reserve long-press spacebar for AI in the default layout. Alternative language/cursor gestures require explicit settings and must not conflict.

### Contextual suggestions

Example: a draft reading “We have exam at 5 PM?” can produce **“Set 5 PM exam reminder”**.

This is a suggestion, not proof of a confirmed event. Tapping opens an editable reminder preview. If the date is unclear, resolve it before saving. Never create reminders merely because a sentence was typed. Sensitive fields show no personalized suggestions.

## 6. Vox voice typing

Vox is part of the keyboard, not a separate destination app.

### Entry and layout

1. User holds the toolbar microphone, or selects the visible Vox action.
2. The key grid changes into a docked voice surface while the host input remains the destination.
3. Show **“Vox mode”**, recording state, a waveform, language, pause/resume, finish and return-to-keyboard controls.
4. Display the live transcript in a readable review region or the active draft, with a clear distinction between provisional and finalized text.
5. On completion, refine punctuation and formatting while preserving meaning. Keep the result editable.

A waveform must respond to actual microphone activity. Do not use a decorative looping waveform to imply recording when no audio is being captured.

### States

| State | Visible feedback | Available action |
| --- | --- | --- |
| Permission required | Explain microphone use | Grant access; return to typing |
| Listening | Recording indicator, waveform, live text | Pause, finish, cancel |
| Paused | Explicit paused label; stopped waveform | Resume, finish, cancel |
| Refining | Short progress feedback; preserve transcript | Wait or keep transcript |
| Ready | Editable final text | Insert/keep, undo refinement |
| Unavailable/error | Plain-language explanation | Retry or use basic typing |
| Allowance exhausted | Explain the limit without discarding text | Keep draft, basic typing, view plans |

### Behavior rules

- Preserve the pre-existing draft and insertion position. Do not duplicate the transcript on finish.
- Never send the host message automatically.
- Cleanup can remove filler words and improve punctuation; it must not invent facts, commitments, names or dates.
- Offer an undo path for AI changes. Custom vocabulary and writing preferences are explicit user settings.
- Stop recording when the user cancels, the destination becomes invalid or the interaction is interrupted in a way that requires stopping.
- Language and on-device availability are shown honestly. Do not silently upload audio when local recognition is unavailable.
- Voice input and AI assistance are unavailable in protected password/PIN fields.

## 7. Writing assistance

Use a compact correction strip or review panel instead of continuously covering the draft.

Core actions: **Fix grammar · Rewrite · Change tone · Shorten · Expand · Clarify**.

Operate on the selected text when present. Otherwise explain the intended scope before replacing a large draft. Show a preview, retain the original and offer undo. Suggestions preserve meaning by default; tone changes must not silently add certainty, promises or emotional intent.

Grammar underlines cannot be the only indication of an issue. Provide a readable list or accessible announcement. Cloud-based rewriting follows the same selected-context boundary as the AI panel.

## 8. Floating AI panel

### Entry and presentation

Hold the lightning spacebar or choose AI from the keyboard menu. Present a compact floating assistant above the key grid, with an expanded state when needed. This is the product's picture-in-picture-style interaction; it does not assume Android video PiP or unrestricted overlay access.

The panel contains:

- Monolog AI heading, collapse/expand and close controls.
- A separate query field, microphone action and submit control.
- Answer content, source links for web-grounded responses and follow-up input.
- Explicit copy/insert actions when an answer should enter the host draft.

Keep the host app recognizable. Avoid hiding the active input when resizing is possible. Closing the panel restores the existing draft and focus without inserting the AI conversation.

### Context and actions

- A cloud query sends only the explicit request and context the user has selected for it.
- A request such as “this screen” does not authorize silent screen capture. Offer the appropriate permission/capture flow.
- Search results do not automatically become journal memories.
- Reminders, alarms and supported app intents use structured, validated requests.
- Show an editable action preview for consequential or ambiguous requests; obtain required confirmation and permissions.
- Report success only after the underlying action succeeds. Keep failures actionable and preserve the request.
- Do not promise unrestricted control of every app or Android setting.

## 9. Context key and library capture

### Tap `m`

Open a capture composer. Where supported and permitted, capture the current screen and show a preview before saving. Let the user crop/redact, add a text note, record a voice note, select a date or cancel. Protected screens must not be captured or bypassed.

If capture is denied or unavailable, offer an explicit manual note, photo import or share flow. Do not repeatedly pressure the user for permission.

### Hold `m`

Open an anchored **Quick shortcuts** menu containing:

1. Reminder.
2. Alarm.
3. Journal — opens Monolog.
4. An Edit/pencil control for supported shortcut customization.

Journal replaces the earlier Google Photos shortcut. The popup must stay inside available screen space and dismiss predictably without changing the host draft.

### Saved context

Each item has a source type, created/captured time, user-editable title, optional note and preview. OCR text is searchable but must remain linked to its source. Voice notes can have a transcript; OCR is not voice transcription. Users can correct extracted text and delete an item together with its derived indexes.

## 10. Today dashboard

Use a calm, personalized overview with a prominent journal card and a flexible secondary card grid.

Recommended order:

1. Monolog identity, menu and clear local-memory status.
2. Today's weather with place and freshness information; manual location or permission-based location.
3. **Today's journal** — short summary and Continue writing action.
4. Reminders and Memory of the day.
5. Context library preview and **Add a card**.
6. Ask/chat composer with plus and microphone.
7. Today / Journal / Library navigation.

Weather must not block journal use. Provide a quiet unavailable state. Dashboard cards are editable and reorderable through an intentional customization flow. Do not fabricate a memory to fill an empty card.

## 11. Journal: core experience

### Timeline

- Default to a reverse-chronological day timeline grouped by month.
- Each day shows date, editable title, concise summary, source previews and a View day/expand action.
- Offer **Timeline · Calendar · Gallery** views and visible search/filter controls.
- Scrolling preserves position when returning from a day or memory.
- Show authentic empty, partially captured and incognito-only days without implying completeness.

### Expanded day

Show an editable day summary, then a time-ordered list of entries and saved context. Let users switch between summary and all memories, open originals, add a reflection, edit, remove or exclude material from summaries.

Differentiate these source types:

- User-written journal entry.
- Text entered through Monolog, eligible for capture under the user's settings.
- Explicitly saved screenshot, photo, text note or voice note.
- A confirmed reminder/action result.
- AI-generated interpretation or summary, visibly labeled and editable.

Typing “coffee with Sam tomorrow” is evidence of a draft or plan, not evidence that coffee occurred. Summaries must not infer another person's replies, feelings or activity that Monolog did not observe. Avoid claiming “your whole day”; Monolog captures the user's available side of it.

### Journal editor

Support manual writing independently of keyboard capture. Provide a title, date, body, attachments, autosave status and undo. A user can keep a useful journal even if memory capture, cloud AI or subscription features are off.

### Search and memory questions

Basic search retrieves local entries and extracted context. Natural-language memory questions should return the relevant day/source alongside the answer. Show uncertainty and a useful no-result state; never create a plausible memory to answer a question.

### Monthly narratives

**Narrative Nostalgia November / NNN Recap** is the November example of a monthly journal recap.

- Show month/year and distinguish **month so far** from a completed month.
- Combine a readable narrative with user-selected moments and source links.
- Let users review, edit and exclude sensitive entries before export or sharing.
- Avoid invented sentiment, milestones, counts or achievements.
- Use “NNN Recap” with its expanded title nearby; never assume the abbreviation is self-explanatory.

## 12. Library

Provide a searchable grid/list with filters for **All · Screenshots · Photos · Notes · Voice**. Filters and view preference persist. Detail views show the original, attached note, extracted text/transcript, date and related journal day.

Deletion must explain whether it removes an attachment, an entry or both. A source deleted from memory must also be removed from derived search material and future summary inputs; already saved narrative text needs a clear update/review path.

## 13. Privacy and capture model

### Privacy states

| State | Capture | AI behavior | UI |
| --- | --- | --- | --- |
| Memory off | No automatic memory capture | Explicit eligible requests only | Memory off, with settings link |
| Memory on | Consented, eligible input only | Local assistance; explicit selected-context cloud requests | Normal theme and discoverable status |
| Manual incognito | No automatic capture or learning | Do not silently process private typing | Active period icon and remaining time |
| Protected input | No capture, learning or retained input buffers | No voice, cloud assistance or context capture for the field | Automatic incognito; Memory paused |

Protected input overrides memory-on and manual timer settings. The protected state must not expire while a sensitive field remains active.

### Manual incognito

Hold period to toggle; provide the same action in the menu for accessibility. Default duration is **15 minutes**, configurable in settings. Show a countdown and allow extension or a setting to remain paused until manually resumed. Explain expiration clearly. Do not resume capture inside protected input when a timer ends.

### Sensitive input and banking example

Treat password/PIN fields, supported sensitive-input signals and explicitly excluded apps as protected. Users can exclude banking apps or other apps entirely. Detection is a protective layer, not a promise to identify every sensitive string or every banking screen.

For the banking concept screen:

- Show **Incognito is on**, **Automatic** and **Memory paused for this field**.
- Remove predictions and personalized action suggestions.
- Highlight the hat-and-glasses icon on the period key.
- Disable context capture and AI/voice controls, with an understandable reason.
- Do not show a 15-minute countdown for automatic protected input.
- Keep normal typing, deletion and navigation reliable.

### Data rules

- Ask separately for keyboard setup, memory capture, microphone access, screen capture, cloud context and backup when relevant.
- Do not retain raw keystroke events. Define eligible text capture around meaningful text segments and user settings; capture must pass privacy checks before persistence, model processing or logging.
- Do not treat entered drafts as sent messages. Do not imply access to the other side of a conversation.
- Encrypt journal records and private media with keys protected by Android Keystore. Room alone is not encryption.
- Keep raw input, transcripts, screenshots and journal bodies out of analytics, crash reports and debug logs.
- Do not upload private memories automatically for better suggestions or cloud fallback.
- Make storage usage, export, retention settings and deletion understandable.
- Optional encrypted backup requires an explicit recovery design. Explain key loss and restoration honestly before enabling it.

## 14. Onboarding and settings

### Onboarding sequence

1. Explain the keyboard and journal together, including local memory and optional cloud requests.
2. Guide the user through Android keyboard enablement and selection, acknowledging the system's keyboard-access warning plainly.
3. Let the user try typing without enabling memory capture.
4. Offer a separate memory opt-in with examples, exclusions and access to incognito controls.
5. Introduce Vox and request microphone access only when used.
6. Introduce context capture and cloud requests at their first meaningful use.
7. Offer theme selection and an optional first journal entry.

No forced account or subscription is required for basic local typing and journaling.

### Settings groups

- Keyboard: height, layout, suggestions, haptics, sound, toolbar pins and language placement.
- Appearance: Paper, Ink, system preference, reduced motion and reduced transparency.
- Vox: language, available recognition mode, cleanup preferences and custom vocabulary.
- Writing: grammar, suggestion behavior and saved styles.
- Memory and privacy: capture toggle, excluded apps, incognito duration, retention and deletion.
- Journal: summary preferences, recap preferences and dashboard cards.
- Storage and backup: local usage, export, optional Drive backup and recovery.
- Plan and account: allowances, billing, restore purchases and subscription management.

## 15. Subscription design

Pricing is the proposed India launch configuration, not a claim of validated willingness to pay.

| Plan | Price | Core offering |
| --- | --- | --- |
| Free | ₹0 | Keyboard, local journaling, basic search, basic grammar/voice and a limited Vox/cloud AI pool |
| Pro monthly | ₹299/month | Advanced assistance and expanded allowances |
| Pro yearly | ₹3,372/year | Equivalent to ₹281/month, billed annually |

Annual savings: ₹299 × 12 = ₹3,588; ₹3,588 − ₹3,372 = **₹216**, or approximately **6.02%**. A **Save 6%** badge is accurate when rounded.

Pro features: expanded Vox, punctuation/formatting, vocabulary, advanced grammar and rewriting, writing styles, expanded AI/search/screenshot allowance, memory questions, richer recaps, supported routines and enhanced exports.

Paywall requirements:

- Clearly distinguish the monthly equivalent from the actual yearly charge.
- Show annual total, renewal/cancellation information, Restore, Terms and Privacy.
- Provide **Get Monolog Pro** and a visible **Continue with Free** action.
- Do not claim unlimited cloud usage or invent word/minute allowances before cost testing.
- Once limits are defined, show remaining usage and reset timing consistently.
- Exhausting a pool must not lose a draft, stop ordinary typing or lock existing journals.
- Privacy protections, deletion and basic data export remain available on Free.
- Cancellation returns the user to Free without deleting their memories.

## 16. Accessibility and interaction quality

- Aim for at least 48 dp touch targets for toolbar, navigation and major controls. Keyboard columns use the full available cell width with sufficient vertical touch area; do not falsely assume ten 48 dp columns fit a narrow phone.
- Meet WCAG AA contrast targets: 4.5:1 for ordinary text and 3:1 for large text and essential non-text indicators.
- Provide TalkBack labels for every key/control and announcements for recording, privacy and action-result state changes.
- Long-press actions are also available through visible menus or accessibility actions. Do not require holding a finger down throughout dictation.
- Support font scaling, reduced motion, reduced transparency, landscape and display cutouts.
- Never communicate recording, incognito, errors or selected billing solely through color.
- Distinguish press, selected, active, loading and disabled states without heavy glow.
- Keep haptics optional. Avoid repeated announcements while every interim speech token changes.

## 17. Motion and feedback

Use short, restrained transitions, approximately 150–220 ms as an initial reference. Opening Vox or AI should feel like a surface changing purpose, not a separate app launching. Preserve spatial continuity and input focus.

Reduced motion removes decorative movement. Recording indicators still communicate state through labels. Loading feedback must not imply an answer or action has already succeeded.

## 18. Empty, error and recovery states

| Situation | Required experience |
| --- | --- |
| First journal day | Invite a manual entry or optional capture setup; no invented summary |
| No memories found | State that nothing matched and offer another query/filter |
| Network unavailable | Keep keyboard/journal usable; explain cloud limitation and preserve request |
| Local model unsupported | Explain available features; no automatic cloud upload |
| Microphone denied | Offer permission settings or ordinary typing |
| Capture blocked | Respect the restriction; offer a manual note when appropriate |
| Action permission denied | Keep an editable request and explain what is needed |
| AI refinement fails | Preserve the original transcript/draft |
| Storage constrained | Explain usage and offer export/deletion without silent loss |
| Backup restoration fails | Preserve local data; show recovery options and actual status |
| Subscription check fails | Retry gracefully; preserve draft and access to local memories |

## 19. Planned implementation boundaries

This is design guidance for the agreed stack, not a version-specific API contract.

- Android IME and Jetpack Compose provide the keyboard and main app surfaces.
- A privacy gate precedes storage, learning, logs and AI processing.
- Encrypted records/media, Room and Android Keystore support local memory.
- Permission-based screen capture and ML Kit OCR support saved screenshot search.
- Speech recognition produces transcripts; Gemma through Google AI Edge / LiteRT-LM supports local text refinement and summaries on compatible devices.
- Explicit cloud requests use Firebase AI Logic and Gemini, with App Check, validated tools and selected context.
- Android integrations execute supported reminders, alarms, notifications and app intents.
- Weather and optional encrypted Drive backup are separate integrations with independent permission/error states.
- Gemini Nano is future evaluation work. Do not describe it as the current local dependency.
- Cloud services for subscriptions, allowances and orchestration must not become an implicit store of journal content.

## 20. Content style

Use calm, concrete language. Describe what is happening and what the user can do next. Avoid backend names in ordinary user flows unless they affect a meaningful choice.

Preferred examples:

- “Your day, remembered.”
- “Ask about your day…”
- “Memory paused.”
- “Typing stays out of your journal.”
- “Speak naturally. Words appear as you talk.”
- “Set 5 PM exam reminder.”
- “Month so far.”

Avoid absolute claims such as “captures everything,” “always detects sensitive data,” “100% secure” or “controls any app.” Do not present AI summaries as unquestionable recollections.

## 21. Required design deliverables

The production design should include editable components and state variants for:

1. Paper and Ink keyboards in a neutral example chat.
2. Ordinary predictions and the exam-reminder suggestion.
3. Manual incognito with timer and automatic protected banking input.
4. Vox listening, paused, refining, unavailable and allowance-limit states.
5. Grammar correction/rewrite preview with accept and undo.
6. AI search with sources, follow-up, loading and failed request.
7. Reminder/alarm preview, confirmation and result.
8. Context capture, redaction, permission denial and quick-shortcut menu.
9. Today, journal timeline, expanded day, editor and empty day.
10. Library filters, item detail, search and deletion.
11. Monthly narrative recap and review/export.
12. Onboarding, privacy settings, excluded apps and backup/recovery.
13. Free/Pro pricing, allowance meter and subscription recovery.

Existing generated phone images are concept references. They are not proof of working behavior or substitutes for editable layouts, accessible controls and complete states.

## 22. Design acceptance checklist

- [ ] Keyboard and journal are both evident as core product experiences.
- [ ] The approved lowercase `m` logo and page stack are consistent across surfaces.
- [ ] Paper and Ink share the same layout and semantic controls.
- [ ] Letter keys are borderless; hit areas remain reliable.
- [ ] Period/incognito is one key, and all hold gestures have accessible alternatives.
- [ ] Host drafts survive Vox, AI panel, permission interruptions and failures.
- [ ] No message or reminder is silently sent/created from a suggestion.
- [ ] Sensitive input cannot enter memory, learning, logs or cloud AI.
- [ ] Automatic protection cannot expire because a manual timer ends.
- [ ] Journal summaries distinguish plans, drafts, sources and interpretations.
- [ ] Search and recaps link back to available evidence and handle uncertainty.
- [ ] A Free user can keep typing, access existing journals and control their data.
- [ ] Annual pricing shows ₹3,372 billed yearly and ₹281/month equivalent correctly.
- [ ] Text remains legible over glass and at larger system font sizes.
- [ ] No key controls, tagline text or billing information overflow their containers.

## 23. Decisions still requiring validation

- Exact free and Pro Vox/cloud allowances, reset periods and top-up packaging.
- Supported devices, local model size, languages, latency, battery and thermal budgets.
- Exact eligible-text capture/retention policy and treatment of incomplete drafts.
- Supported action integrations and their required permissions/confirmation rules.
- Secure backup key recovery and the effect of deleting data on existing backups.
- Which recap and memory-question features are ready for the first release.
- Whether users value voice, writing assistance or journaling most strongly, and how the combined experience changes retention.

Resolve these through device testing and user research. Until then, retain honest capability and allowance language rather than inventing completed functionality.
