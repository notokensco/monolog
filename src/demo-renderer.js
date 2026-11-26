import {
  BASE_CHAT_MESSAGES,
  CAPTURED_NOTICE,
  FEATURE_GIF_FIXTURES,
  FEATURE_STICKER_FIXTURES,
  LIBRARY_SEED_ITEMS,
  MONTHLY_RECAP_FIXTURE,
  SEEDED_JOURNAL_DAYS,
  SHOPPING_CAPTURE,
} from './demo-fixtures.js'

function escapeHtml(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function icon(name, cls = 'icon') {
  return `<svg class="${cls}" aria-hidden="true"><use href="#icon-${name}"/></svg>`
}

function renderLauncher(state) {
  const apps = [
    { id: 'monolog', label: 'Monolog', target: 'app-monolog', type: 'monolog' },
    { id: 'whatsapp', label: 'WhatsApp', target: 'app-whatsapp', type: 'whatsapp' },
    { id: 'notice', label: 'Finals portal', target: 'app-notice', type: 'notice' },
    { id: 'notes', label: 'Notes', target: 'app-notes', type: 'notes' },
    { id: 'calendar', label: 'Calendar', type: 'calendar' },
    { id: 'clock', label: 'Clock', type: 'clock' },
    { id: 'shop', label: 'Shop', target: 'app-shop', type: 'shop' },
    { id: 'settings', label: 'Settings', type: 'settings' },
  ]

  return `
    <div class="android-launcher">
      <div class="launcher-glance">
        <span class="launcher-date">Thu, 26 Nov</span>
        <span class="launcher-weather">24°C · Partly cloudy</span>
        <strong class="launcher-clock">${escapeHtml(state.time)}</strong>
      </div>
      <div class="launcher-search-pill" aria-hidden="true">
        <span class="g-dot">G</span>
        <span>Search apps &amp; web</span>
        ${icon('mic')}
      </div>
      <div class="launcher-grid">
        ${apps.map(app => {
          let glyph = ''
          if (app.type === 'monolog') {
            glyph = `<img src="/images/monolog-icon.png" alt="Monolog" width="512" height="512" />`
          } else if (app.type === 'whatsapp') {
            glyph = `<span class="wa-glyph" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a9.8 9.8 0 0 0-8.4 14.9L2.5 22l5.3-1.4A9.9 9.9 0 1 0 12 2Zm5.6 14c-.2.6-1.3 1.2-1.9 1.3-.5.1-1.1.1-1.8-.1a14 14 0 0 1-5.8-3.8c-1.5-1.5-2.4-3.3-2.5-3.9-.1-.6.3-1.4.8-1.9.3-.3.6-.4.9-.4h.6c.2 0 .5 0 .7.6.2.6.8 2 .9 2.1.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.4.5c-.2.2-.3.4-.1.7.2.4 1 1.6 2.1 2.5 1.4 1.2 2.5 1.6 2.9 1.8.3.1.5.1.7-.1l.9-1c.2-.3.5-.2.8-.1l1.9.9c.3.1.5.2.6.4.1.2.1.8-.1 1.4Z"/></svg></span>`
          } else if (app.type === 'notice') {
            glyph = `<span class="app-glyph app-glyph-campus">${icon('calendar')}</span>`
          } else if (app.type === 'notes') {
            glyph = `<span class="app-glyph app-glyph-notes">${icon('journal')}</span>`
          } else if (app.type === 'calendar') {
            glyph = `<span class="app-glyph app-glyph-cal">26</span>`
          } else if (app.type === 'clock') {
            glyph = `<span class="app-glyph app-glyph-clock">${icon('clock')}</span>`
          } else if (app.type === 'shop') {
            glyph = `<span class="app-glyph app-glyph-cam">${icon('bag')}</span>`
          } else {
            glyph = `<span class="app-glyph app-glyph-set">${icon('settings')}</span>`
          }
          return `
            <div class="launcher-app" ${app.target ? `data-demo-target="${app.target}"` : ''}>
              <div class="launcher-icon launcher-icon-${app.type}">${glyph}</div>
              <span>${escapeHtml(app.label)}</span>
            </div>
          `
        }).join('')}
      </div>
      <div class="launcher-dock" aria-hidden="true">
        <span class="dock-icon">${icon('phone')}</span>
        <span class="dock-icon">${icon('message')}</span>
        <span class="dock-icon">${icon('globe')}</span>
        <span class="dock-icon">${icon('camera')}</span>
      </div>
      <div class="android-gesture-bar" data-demo-target="gesture-bar"><span></span></div>
    </div>
  `
}

function renderSplash() {
  return `
    <div class="monolog-splash">
      <svg class="splash-waves" viewBox="0 0 360 760" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-40,220 C80,100 180,250 280,150 C340,95 390,40 410,10" fill="none" stroke="rgba(82,216,180,0.45)" stroke-width="2" />
        <path d="M-40,220 C80,100 180,250 280,150 C340,95 390,40 410,10" fill="none" stroke="rgba(82,216,180,0.08)" stroke-width="34" />
        <path d="M-30,710 C110,550 175,650 265,575 C340,515 390,475 410,450" fill="none" stroke="rgba(158,130,242,0.45)" stroke-width="2" />
        <path d="M-30,710 C110,550 175,650 265,575 C340,515 390,475 410,450" fill="none" stroke="rgba(158,130,242,0.08)" stroke-width="34" />
      </svg>
      <div class="splash-center">
        <div class="splash-stack">
          <span class="splash-layer layer-4"></span>
          <span class="splash-layer layer-3"></span>
          <span class="splash-layer layer-2"></span>
          <span class="splash-layer layer-1">
            <img src="/images/monolog-icon.png" alt="Monolog" width="512" height="512" />
          </span>
        </div>
        <h2>Monolog</h2>
        <p>your side of the day.</p>
      </div>
      <div class="android-gesture-bar android-gesture-light"><span></span></div>
    </div>
  `
}

function renderBuildathonPortal(checkIn = false, saved = false) {
  return `
    <div class="event-surface">
      <div class="event-masthead">
        <span class="event-brand-mark" aria-hidden="true">${icon('bolt')}</span>
        <div><strong>Buildathon</strong><span>Finalist Portal</span></div>
        <span class="event-team">NoTokens</span>
      </div>
      <div class="event-tabs"><span>Overview</span><strong>${checkIn ? 'Check-in' : 'Schedule'}</strong><span>Teams</span></div>
      <div class="event-content">
        <span class="event-date">THU, 26 NOV</span>
        <h3>Finals day</h3>
        <div class="event-update">
          <span>${checkIn ? 'FINALIST CHECK-IN' : 'VENUE UPDATED'}</span>
          <strong>${checkIn ? 'Registration opens at 3:15 PM' : 'Judging moved to Demo Bay B'}</strong>
          <p>${checkIn ? 'Registration Desk · Hall 2' : 'Your 4:00 PM timeslot stays the same.'}</p>
        </div>
        <div class="event-schedule">
          <div><time>${checkIn ? '3:15 PM' : '3:50 PM'}</time><span><strong>${checkIn ? 'Finalist check-in' : 'Check-in deadline'}</strong><small>Registration Desk · Hall 2</small></span></div>
          <div><time>4:00 PM</time><span><strong>Finalist judging</strong><small>Demo Bay B · Hall 2</small></span></div>
        </div>
        <div class="event-brief"><strong>At your station</strong><span>Be ready with your demo device and an HDMI adapter.</span></div>
      </div>
      ${saved ? '' : '<div class="event-search" data-demo-target="notice-search">' + icon('search') + '<span>Search updates</span></div>'}
    </div>
  `
}

function renderCaptureThumb(cropped = false, pins = [], checkIn = false, shopping = false) {
  return `
    <div class="capture-snapshot ${cropped ? 'is-cropped' : ''}">
      ${cropped ? '<span class="event-crop-label">Finalist judging<br>4:00 PM · Demo Bay B</span>' : shopping ? renderShoppingPage(false) : renderBuildathonPortal(checkIn, true)}
      ${pins.length ? '<span class="snapshot-pin">' + icon('pin') + ' ' + pins.length + '</span>' : ''}
    </div>
  `
}

function renderCaptureDetail(state) {
  const shopping = state.libraryDetailId === SHOPPING_CAPTURE.id
  const capture = shopping ? state.savedShopping : state.savedCapture
  if (state.screenshotOpen) {
    return `
      <div class="saved-capture-screen screenshot-viewer">
        <div class="native-back-row">
          <button type="button" class="native-back" data-demo-target="capture-preview-close" aria-label="Close screenshot">${icon('arrow-left')}</button>
          <strong>Screenshot</strong>
        </div>
        <div class="full-screenshot">${renderCaptureThumb(!shopping && state.captureCropped, shopping ? [] : state.capturePins, false, shopping)}</div>
        <div class="android-gesture-bar android-gesture-light"><span></span></div>
      </div>
    `
  }
  return `
    <div class="saved-capture-screen">
      <div class="native-back-row">
        <button type="button" class="native-back" data-demo-target="library-back" aria-label="Back to Library">${icon('arrow-left')}</button>
        <img src="/images/monolog-icon.png" alt="" width="26" height="26" /><strong>Monolog</strong>
      </div>
      <div class="saved-capture-content">
        <h2>${escapeHtml(capture.title)}</h2>
        <time>${escapeHtml(capture.timeLabel.replace('Today, ', '26 Nov 2026 · '))}</time>
        <div class="saved-capture-hero">
          ${renderCaptureThumb(!shopping && state.captureCropped, shopping ? [] : state.capturePins, false, shopping)}
          <button type="button" class="open-screenshot" data-demo-target="capture-preview">${icon('expand')} Open screenshot</button>
        </div>
        <div class="saved-capture-note">
          <span>${icon(capture.voice ? 'mic' : 'journal')} ${capture.voice ? 'Voice note' : 'Your note'}</span>
          <p>${escapeHtml(capture.note)}</p>
          ${capture.audioPath ? `
            <div class="capture-audio-row">
              <button type="button" data-demo-target="capture-audio" aria-label="Play voice note" aria-pressed="false">
                ${icon('play', 'icon audio-play')}${icon('pause', 'icon audio-pause')}
              </button>
              <span class="capture-waveform" aria-hidden="true"></span><small>0:05</small>
            </div>
          ` : ''}
        </div>
        ${state.capturePins.map(pin => `<div class="saved-capture-note"><span>${icon('pin')} Pinned note</span><p>${escapeHtml(pin.text)}</p></div>`).join('')}
        <div class="note-editor-actions"><span>Edit</span><span>Delete</span></div>
      </div>
      <div class="android-gesture-bar android-gesture-light"><span></span></div>
    </div>
  `
}

function renderMonologApp(state) {
  if (state.libraryDetailId && (state.savedCapture || state.savedShopping)) return renderCaptureDetail(state)
  const paper = state.appearance === 'paper'
  const header = `
    <div class="app-topbar">
      <div class="app-brand">
        <img src="/images/monolog-icon.png" alt="" width="512" height="512" />
        <strong>Monolog</strong>
      </div>
      <div class="app-topbar-right">
        <span class="on-device-pill" aria-label="On-device AI">${icon('shield')}${paper ? '' : '<span>On-device AI</span>'}</span>
        ${paper ? '<span class="app-connect">' + icon('globe') + ' Connect</span>' : ''}
        <span class="app-icon-btn" aria-hidden="true">${icon('settings')}</span>
      </div>
    </div>
    <div class="app-weather-pill">
      <span class="weather-left"><span class="weather-dot"></span>Turn on location</span>
      <span class="weather-right"><strong>Thursday</strong><small>26 November</small></span>
    </div>
  `

  let body = ''
  if (state.monologTab === 'today') {
    const journalText = state.journalRecapText ? 'Buildathon finals'
      : 'A little space for your thoughts, conversations, and progress.'
    const nextReminder = state.time.startsWith('3:') && state.time < '3:30' ? state.savedReminder : null
    const reminderTitle = nextReminder?.title || 'Nothing coming up'
    const reminderSub = nextReminder ? `${nextReminder.time} →` : 'Add a reminder →'
    const recentTitle = state.savedShopping?.title || state.savedCapture?.title || state.savedNote?.title || 'Finalist check-in'

    body = `
      <div class="monolog-today">
        <h2 class="app-headline">Your day, remembered.</h2>
        <div class="paper-card paper-card-hero">
          <div class="card-head">
            <span class="card-icon-badge">${icon('journal')}</span>
            <strong>Today’s journal</strong>
          </div>
          <p class="card-copy">${escapeHtml(journalText)}</p>
          <span class="card-action-link">${state.journalRecapText ? 'Open today’s recap' : 'Continue writing'} ${icon('arrow-right')}</span>
        </div>

        <div class="today-grid">
          <div class="paper-card paper-tile">
            <span class="card-icon-badge">${icon('clock')}</span>
            <strong>Reminders</strong>
            <p>${escapeHtml(reminderTitle)}</p>
            <span class="card-action-link">${escapeHtml(reminderSub)}</span>
          </div>
          <div class="paper-card paper-tile">
            <span class="card-icon-badge">${icon('journal')}</span>
            <strong>Recent memory</strong>
            <p>${escapeHtml(recentTitle)}</p>
            <span class="card-action-link">Open Journal ${icon('arrow-right')}</span>
          </div>
          <div class="paper-card paper-tile" data-demo-target="today-library-tile">
            <span class="card-icon-badge">${icon('layers')}</span>
            <strong>Context library</strong>
            <p>Photos and notes</p>
            <span class="card-action-link">View all ${icon('arrow-right')}</span>
          </div>
          <div class="paper-card paper-tile" data-demo-target="today-add-note">
            <span class="card-icon-badge">${icon('plus')}</span>
            <strong>Add a note</strong>
            <p>Make this space yours</p>
            <span class="card-action-link">Write something ${icon('arrow-right')}</span>
          </div>
        </div>
      </div>
    `
  } else if (state.monologTab === 'library') {
    const allItems = [state.savedShopping, state.savedCapture, state.savedNote, ...LIBRARY_SEED_ITEMS].filter(Boolean)
    const query = state.libraryQuery.trim().toLowerCase()
    const filtered = allItems.filter(item => {
      const type = { Photos: 'Photo', Screenshots: 'Screenshot', Voice: 'Voice' }[state.libraryFilter]
      if (type && item.type !== type && !(type === 'Voice' && item.voice)) return false
      return !query || [item.title, item.note, item.ocrText, item.preview].some(value => value?.toLowerCase().includes(query))
    })
    body = `
      <div class="monolog-library">
        <div class="app-section-head library-heading">
          <h2 class="app-headline-sm">Context library</h2>
          <div class="library-tools" aria-hidden="true">
            <span class="app-icon-btn">${icon('grid')}</span>
            <span class="app-icon-btn">${icon('sort')}</span>
            <span class="app-icon-btn">${icon('plus')}</span>
          </div>
        </div>
        <p class="app-subline">Saved moments, ready when you need them</p>
        <div class="library-chips">
          ${['All', 'Photos', 'Screenshots', 'Voice'].map(chip => `
            <button type="button" class="filter-chip ${state.libraryFilter === chip ? 'is-active' : ''}" data-demo-target="library-filter-${chip.toLowerCase()}" aria-pressed="${state.libraryFilter === chip}">
              ${chip === 'All' ? '' : icon({ Photos: 'image', Screenshots: 'capture', Voice: 'mic' }[chip])}${chip === 'Voice' ? 'Audio Notes' : chip}
            </button>
          `).join('')}
        </div>
        <div class="drive-years-hint">Load past years from Drive</div>
        <div class="library-grid">
          ${filtered.map(item => {
            const isShopping = item.id === SHOPPING_CAPTURE.id
            const isCapture = item.id === CAPTURED_NOTICE.id || isShopping
            const thumbnail = item.type === 'Screenshot'
              ? renderCaptureThumb(isCapture && !isShopping && state.captureCropped, isCapture && !isShopping ? state.capturePins : [], !isCapture, isShopping)
              : '<span class="seed-thumb">' + icon(item.type === 'Voice' ? 'mic' : 'journal') + '<span>' + escapeHtml(item.preview) + '</span></span>'
            const content = '<div class="library-card-thumb">' + thumbnail + '</div><strong>' + escapeHtml(item.title) + '</strong><span class="library-card-cta"><small>' + (item.type === 'Screenshot' ? '1 photo' : item.type) + '</small>' + icon('arrow-right') + '</span>'
            return isCapture
              ? '<div class="paper-card library-card">' + content + '<button class="library-card-hit" type="button" data-demo-target="' + (isShopping ? 'library-shopping-card' : 'library-pitch-card') + '" aria-label="Open ' + escapeHtml(item.title) + '"></button></div>'
              : '<div class="paper-card library-card">' + content + '</div>'
          }).join('')}
          ${filtered.length ? '' : '<div class="paper-card">No matching memories</div>'}
        </div>
        <div class="paper-card open-journal-row">${icon('journal')}<span>Open Journal</span>${icon('arrow-right')}</div>
      </div>
    `
  } else {
    const period = state.journalPeriod || 'Day'
    const briefTitle = period === 'Month' ? 'Your month in brief' : 'Your day in brief'
    const briefDate = period === 'Month' ? 'November 2026' : 'Thursday, 26 November 2026'
    let briefCopy = 'No journal moments saved for this period yet.'
    if (period === 'Month') {
      briefCopy = MONTHLY_RECAP_FIXTURE.summary
    } else if (state.journalRecapText) {
      briefCopy = state.journalRecapText
    } else if (state.savedCapture || state.savedReminder) {
      briefCopy = `${[state.savedCapture, state.savedReminder, state.savedNote].filter(Boolean).length} saved items today. Tap refresh to generate a recap.`
    }

    const daysToRender = state.journalOpenDay
      ? SEEDED_JOURNAL_DAYS.filter(d => d.date === state.journalOpenDay)
      : SEEDED_JOURNAL_DAYS

    body = `
      <div class="monolog-journal">
        <div class="app-section-head">
          <h2 class="app-headline-sm">Journal</h2>
          ${state.featurePill ? `
            <div class="period-chips">
              ${['Day', 'Month', 'Year'].map(p => `<span class="mini-chip ${period === p ? 'is-active' : ''}" ${p === 'Month' ? 'data-demo-target="journal-period-month"' : ''}>${p}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <div class="paper-card brief-card">
          <div class="brief-head">
            <span class="card-icon-badge">${icon('journal')}</span>
            <div class="brief-head-copy">
              <strong>${briefTitle}</strong>
              <small>${briefDate}</small>
            </div>
            <button type="button" class="brief-refresh-btn" data-demo-target="journal-recap-btn" aria-label="Generate day recap">
              ${icon('refresh')}
            </button>
          </div>
          <p class="brief-text">${escapeHtml(briefCopy)}</p>
        </div>

        ${state.journalAnswer ? `
          <div class="paper-card journal-answer-card">
            <span class="answer-kicker">From your journal</span>
            <strong>${escapeHtml(state.journalAnswer.text)}</strong>
            <button type="button" class="answer-source-card" data-demo-target="journal-source-card">
              <span class="answer-source-thumb">${icon('image')}</span>
              <span class="answer-source-copy">
                <small>Source · Saved capture</small>
                <span>${escapeHtml(state.journalAnswer.sourceTitle)}</span>
                <small>${escapeHtml(state.journalAnswer.sourceMeta)}</small>
              </span>
              ${icon('arrow-right')}
            </button>
          </div>
        ` : ''}

        <div class="journal-month-bar">
          <span class="month-pill">${icon('arrow-left')} November 2026 ${icon('arrow-right')}</span>
          <span class="app-icon-btn">${icon('search')}</span><span class="app-icon-btn">${icon('ellipsis')}</span>
        </div>

        <div class="journal-view-tabs">
          ${['Timeline', 'Calendar', 'Gallery'].map(v => `
            <span class="view-tab ${state.journalView === v ? 'is-active' : ''}">${icon({ Timeline: 'layers', Calendar: 'clock', Gallery: 'image' }[v])}${v}</span>
          `).join('')}
        </div>

        <div class="journal-timeline">
          ${daysToRender.map(day => {
            const isToday = day.date === '2026-11-26'
            if (isToday && !state.savedCapture && !state.savedReminder) return ''
            return `
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div class="paper-card timeline-card">
                  <small class="timeline-date">${escapeHtml(day.label)}</small>
                  <div class="timeline-story">
                    <div><strong>${escapeHtml(day.title)}</strong><p>${escapeHtml(day.summary)}</p></div>
                    ${isToday && state.savedCapture ? `<div class="timeline-preview">${renderCaptureThumb()}</div>` : ''}
                  </div>
                  ${state.journalOpenDay === day.date ? `
                    <div class="timeline-entries">
                      ${day.entries.map(entry => `
                        <div class="timeline-entry-row">
                          <span class="entry-meta">${escapeHtml(entry.source)} · ${escapeHtml(entry.time)}</span>
                          <p>${escapeHtml(entry.summary)}</p>
                          ${entry.linkLabel ? `
                            <div class="entry-actions">
                              <span class="entry-action-link">${escapeHtml(entry.linkLabel)}</span>
                              <span class="entry-action-muted">Edit · Pin · Delete</span>
                            </div>
                          ` : ''}
                        </div>
                      `).join('')}
                    </div>
                  ` : `
                    <div class="timeline-tags">${day.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
                    <span class="card-action-link" data-demo-target="journal-view-day-${day.date}">View day ${icon('arrow-right')}</span>
                  `}
                </div>
              </div>
            `
          }).join('')}
        </div>
      </div>
    `
  }

  const inLibrary = state.monologTab === 'library'
  const query = inLibrary ? state.libraryQuery : state.journalQuery
  const prompt = inLibrary ? 'Ask about your memories…' : 'Ask about your days…'
  return `
    <div class="monolog-app" data-tab="${state.monologTab}" data-keyboard-open="${state.keyboardOpen}">
      <div class="monolog-app-scroll">
        ${header}
        ${body}
      </div>
      <div class="app-bottom-dock">
        <div class="app-ask-bar ${query ? 'has-query' : ''}" data-demo-target="${inLibrary ? 'library-search' : 'journal-ask-input'}">
          <span class="ask-plus">${icon('plus')}</span>
          <span class="ask-text" data-demo-field="${inLibrary ? 'libraryQuery' : 'journalQuery'}" data-placeholder="${prompt}">${escapeHtml(query) || prompt}</span>
          <span class="ask-search-btn" data-demo-target="journal-ask-submit">${icon('search')}</span>
        </div>
        <nav class="app-tab-bar" aria-label="Monolog navigation">
          <button type="button" class="app-tab ${state.monologTab === 'today' ? 'is-active' : ''}" data-demo-target="tab-today" aria-pressed="${state.monologTab === 'today'}">
            ${icon('home')}<span>Today</span>
          </button>
          <button type="button" class="app-tab ${state.monologTab === 'journal' ? 'is-active' : ''}" data-demo-target="tab-journal" aria-pressed="${state.monologTab === 'journal'}">
            ${icon('journal')}<span>Journal</span>
          </button>
          <button type="button" class="app-tab ${state.monologTab === 'library' ? 'is-active' : ''}" data-demo-target="tab-library" aria-pressed="${state.monologTab === 'library'}">
            ${icon('layers')}<span>Library</span>
          </button>
        </nav>
        <div class="android-gesture-bar"><span></span></div>
      </div>
    </div>
  `
}

function renderChatNotification() {
  const message = BASE_CHAT_MESSAGES[0]
  return `
    <button type="button" class="android-chat-notification" data-demo-target="whatsapp-notification" aria-label="Open WhatsApp message from ybtheflash">
      <span class="android-notification-app"><i aria-hidden="true">${icon('message')}</i> WhatsApp <small>now</small></span>
      <span class="android-notification-message">
        <img src="/images/demo-ybtheflash.webp" alt="" width="144" height="144">
        <span><strong>ybtheflash</strong><span>${escapeHtml(message.text)}</span></span>
      </span>
    </button>
  `
}

function renderWhatsapp(state) {
  const hasDraft = Boolean(state.draftText)
  return `
    <div class="whatsapp-screen">
      <div class="wa-header">
        ${icon('arrow-left')}
        <img class="wa-avatar" src="/images/demo-ybtheflash.webp" alt="" width="144" height="144">
        <div class="wa-peer">
          <strong>ybtheflash</strong>
          <small>online</small>
        </div>
        <span class="wa-header-actions" aria-hidden="true">${icon('camera')}${icon('phone')}</span>
      </div>
      <div class="wa-thread">
        <span class="wa-day-chip">Today</span>
        <div class="wa-own-profile"><img src="/images/demo-justysss.webp" alt="" width="144" height="144"><span>Justysss (you)</span></div>
        ${state.chatMessages.map(msg => `
          <div data-message-id="${escapeHtml(msg.id)}" class="wa-bubble ${msg.from === 'justysss' ? 'wa-outgoing' : 'wa-incoming'}">
            <p>${escapeHtml(msg.text)}</p>
            <small>${escapeHtml(msg.time)}${msg.from === 'justysss' ? ' <span class="wa-ticks" aria-hidden="true">✓✓</span>' : ''}</small>
          </div>
        `).join('')}
      </div>
      <div class="wa-composer-bar">
        <div class="wa-input-pill ${hasDraft ? 'has-draft' : ''}" data-demo-target="wa-composer">
          ${icon('smile', 'icon wa-composer-icon')}
          <span ${hasDraft ? '' : 'hidden'} class="draft-pill-badge">Draft</span>
          <span class="wa-input-text ${hasDraft ? '' : 'is-placeholder'}" data-demo-field="draftText" data-placeholder="Message">${hasDraft ? escapeHtml(state.draftText) : 'Message'}</span>
          <span ${hasDraft ? '' : 'hidden'} class="typing-caret" aria-hidden="true"></span>
        </div>
        <button type="button" class="wa-send-btn ${hasDraft ? 'is-ready' : ''}" data-demo-target="wa-send" aria-label="Send message">
          ${icon('send', 'icon wa-send-glyph')}${icon('mic', 'icon wa-mic-glyph')}
        </button>
      </div>
      ${state.keyboardOpen ? '' : '<div class="android-gesture-bar android-gesture-light"><span></span></div>'}
    </div>
  `
}

function renderNoticeScreen(state) {
  return `
    <div class="notice-screen event-notice">
      ${renderBuildathonPortal()}
      ${state.keyboardOpen ? '' : '<div class="android-gesture-bar"><span></span></div>'}
    </div>
  `
}

function renderShoppingPage(showShortcut = true) {
  return `
    <div class="shop-screen">
      <div class="shop-topbar">${icon('arrow-left')}<strong>Field Supply</strong>${icon('bag')}</div>
      <div class="shop-product">
        <div class="shop-product-photo">
          <img src="/images/demo-usbc-hub.webp" width="840" height="840" alt="Graphite USB-C hub with HDMI and USB ports">
        </div>
        <div class="shop-product-info">
          <span class="shop-category">Adapters &amp; hubs</span>
          <h2>USB-C Travel Hub</h2>
          <strong class="shop-price">₹2,499</strong>
          <p>A spare hub for a laptop, display, and USB devices.</p>
          <div class="shop-specs"><span>4K HDMI</span><span>2 USB-A ports</span><span>USB-C</span></div>
          <span class="shop-buy">Add to bag</span>
        </div>
      </div>
      ${showShortcut ? `
        <button type="button" class="android-context-button" data-demo-target="android-context" aria-label="Android Quick Capture shortcut"><img src="/images/monolog-icon.png" alt="" width="512" height="512"></button>
        <div class="android-gesture-bar"><span></span></div>
      ` : ''}
    </div>
  `
}

function renderNotesScreen(state) {
  return `
    <div class="notes-screen">
      <div class="notes-header">
        <strong>Quick Notes</strong>
        <span class="notes-tag">Personal note</span>
      </div>
      <div class="notes-body">
        <div class="notes-title">Pitch thoughts</div>
        <div class="notes-editor ${state.draftText ? 'has-draft' : ''}" data-demo-target="notes-editor">
          <span data-demo-field="draftText" data-placeholder="Write a personal note…">${state.draftText ? escapeHtml(state.draftText) : 'Write a personal note…'}</span>
          <span ${state.draftText ? '' : 'hidden'} class="typing-caret" aria-hidden="true"></span>
        </div>
        ${state.incognito === 'manual' ? `
          <div class="notes-privacy-note">
            ${icon('incognito')}
            <span>Stays only in Quick Notes — excluded from Monolog memory.</span>
          </div>
        ` : ''}
      </div>
    </div>
  `
}

function renderCaptureScreen(state) {
  return `
    <div class="capture-screen">
      <div class="capture-topbar">
        <span class="capture-close">${icon('close')}</span>
        <span class="capture-hint">${state.captureCropped ? 'Crop screenshot' : 'Tap photo to add note'}</span>
        ${state.captureCropped ? '<span class="capture-crop-pill">Cropped</span>' : '<span></span>'}
      </div>
      <div class="capture-preview-frame" data-demo-target="capture-frame">
        ${renderCaptureThumb(state.captureCropped, state.capturePins, false, state.shoppingCapture)}
      </div>
      <div class="capture-bottom-sheet">
        <div class="capture-compose-row">
          <span class="capture-crop-icon" aria-label="Crop" data-demo-target="capture-crop">${icon('crop')}</span>
          <span class="capture-note-input" data-demo-field="captureNote" data-placeholder="Add a note…">${escapeHtml(state.captureNote) || 'Add a note…'}</span>
          <button type="button" class="capture-save-btn" data-demo-target="capture-save" aria-label="Save capture">${icon('arrow-right')}</button>
        </div>
        <button type="button" class="record-voice" data-demo-target="capture-voice">
          ${icon(state.captureRecording ? 'pause' : 'mic')}
          <span>${state.captureRecording ? 'Recording voice note…' : state.captureVoice ? 'Voice note attached' : 'Record voice note'}</span>
          ${state.captureRecording ? '<span class="recording-meter" aria-hidden="true"></span>' : ''}
        </button>
      </div>
      <div class="android-gesture-bar android-gesture-light"><span></span></div>
    </div>
  `
}

function renderCompanionNote(state) {
  const note = state.savedNote
  return `
    <div class="companion-note">
      <div class="app-topbar">
        <span class="app-icon-btn">${icon('arrow-left')}</span>
        <div class="app-brand"><img src="/images/monolog-icon.png" alt="" /><strong>Monolog</strong></div>
      </div>
      <h2 class="app-headline">${note ? escapeHtml(note.title) : 'New note'}</h2>
      <div class="paper-card companion-note-card">
        ${note ? `
          <time>${escapeHtml(note.timeLabel)}</time>
          <p>${escapeHtml(note.preview)}</p>
        ` : `
          <div class="note-title-field" data-demo-field="noteTitle" data-placeholder="Title" data-demo-target="note-title">${escapeHtml(state.noteTitle) || 'Title'}</div>
          <div class="note-tool-row"><strong>Write</strong><span>Preview</span><span>Formatting</span></div>
          <div class="note-body-field" data-demo-field="noteBody" data-placeholder="What would you like to remember?" data-demo-target="note-body">${escapeHtml(state.noteBody) || 'What would you like to remember?'}</div>
          <div class="note-attach-row">${icon('image')} Add photos (0/8)</div>
          <div class="note-attach-row">${icon('mic')} Record voice note</div>
        `}
      </div>
      <div class="note-editor-actions">
        ${note ? '<span>Edit</span><span>Delete</span>' : '<button type="button" data-demo-target="note-save">Save</button><span>Cancel</span>'}
      </div>
      ${state.keyboardOpen ? '' : '<div class="android-gesture-bar android-gesture-light"><span></span></div>'}
    </div>
  `
}

function renderProtectedOrSettingsScreen(state) {
  if (state.featureSubView === 'backup') {
    return `
      <div class="settings-screen">
        <div class="settings-header">${icon('arrow-left')}<strong>Backup &amp; Privacy</strong></div>
        <div class="paper-card settings-card">
          <div class="settings-row">
            <div>
              <strong>Encrypted Drive backup</strong>
              <small>AES-256-GCM · Stored in your private Drive app data</small>
            </div>
            ${icon('cloud')}
          </div>
          <div class="settings-toggle-list">
            <div class="settings-toggle-row"><span>Journal entries &amp; notes</span><span class="toggle-on">On</span></div>
            <div class="settings-toggle-row"><span>Saved screen context</span><span class="toggle-on">On</span></div>
            <div class="settings-toggle-row"><span>Keyboard profile</span><span class="toggle-on">On</span></div>
            <div class="settings-toggle-row"><span>Include attachments</span><span class="toggle-off">Off</span></div>
          </div>
          <span class="settings-action-pill">Back up now · Settings preview</span>
        </div>
        <div class="paper-card settings-card">
          <strong>Getting started · Setup</strong>
          <small>1. Enable Monolog · 2. Choose keyboard · 3. Optional Gemma offline packs</small>
        </div>
      </div>
    `
  }

  return `
    <div class="bank-screen">
      <div class="bank-address-bar">${icon('lock')}<span>pine-bank.example · Protected field</span></div>
      <div class="bank-card">
        <span class="bank-kicker">SECURE SIGN-IN</span>
        <h3>Welcome back, Justysss</h3>
        <div class="bank-field-box">
          <small>Password</small>
          <div class="bank-password-value">${state.draftText ? escapeHtml(state.draftText) : '••••••••'}</div>
        </div>
        <p class="bank-shield-note">${icon('shield')} Monolog automatically pauses memory on password, PIN, and OTP fields.</p>
      </div>
    </div>
  `
}

function renderKeyboardOverlay(state) {
  if (state.rewritePreview) {
    return `
      <div class="kb-overlay-card">
        <div class="kb-overlay-head">
          <img src="/images/monolog-icon.png" alt="" width="512" height="512" />
          <strong>Rewrite preview · ${escapeHtml(state.rewritePreview.style)}</strong>
          <span class="preview-draft-tag">Review</span>
        </div>
        <p class="kb-overlay-text">${escapeHtml(state.rewritePreview.text)}</p>
        <div class="kb-overlay-actions">
          <button type="button" class="kb-primary-btn" data-demo-target="rewrite-apply">Use</button>
          <span class="kb-secondary-btn">Keep original</span>
        </div>
      </div>
    `
  }

  if (state.keyboardMode === 'ai') {
    return `
      <div class="kb-overlay-card kb-ai-panel">
        <div class="kb-overlay-head">
          ${icon('bolt')}
          <strong>AI Ask</strong>
          <span class="kb-close-x">${icon('close')}</span>
        </div>
        <div class="ai-query-box">
          ${icon('search')}
          <span data-demo-field="aiQuery" data-placeholder="Ask or search…">${state.aiQuery ? escapeHtml(state.aiQuery) : 'Ask or search…'}</span>
        </div>
        <div class="ai-mode-toggles">
          <span class="ai-chip ${state.aiPersonal ? 'is-on' : ''}">Personal</span>
          <span class="ai-chip ${state.aiWeb ? 'is-on' : ''}" data-demo-target="ai-web-btn">${state.aiWeb ? 'Web on' : 'Web off'}</span>
          <button type="button" class="ai-search-submit" data-demo-target="ai-search-btn">
            ${state.aiWeb ? 'Web search' : 'Ask'}
          </button>
        </div>
        ${state.aiSearching ? '<div class="ai-searching">Searching web sources…</div>' : ''}
        ${state.aiResult ? `
          <div class="ai-result-box">
            <p class="ai-result-answer">${escapeHtml(state.aiResult.answer)}</p>
            <div class="ai-source-pill">
              <strong>Example source</strong> · ${escapeHtml(state.aiResult.sourceTitle)}
            </div>
            <div class="kb-overlay-actions">
              <button type="button" class="kb-primary-btn" data-demo-target="ai-insert-btn">Insert</button>
            </div>
          </div>
        ` : ''}
      </div>
    `
  }

  if (state.keyboardMode === 'shortcuts') {
    return `
      <div class="kb-shortcuts-popover ${state.keyboardTheme === 'ink' ? 'shortcuts-ink' : 'shortcuts-paper'}">
        <div class="kb-shortcuts-head">
          <strong>Quick shortcuts</strong>
          <span>${icon('rewrite')} Edit</span>
        </div>
        <div class="kb-shortcuts-grid">
          <button type="button" class="shortcut-tile" data-demo-target="shortcut-reminder">${icon('bell')}<span>Reminder</span></button>
          <button type="button" class="shortcut-tile" data-demo-target="shortcut-alarm">${icon('alarm')}<span>Alarm</span></button>
          <div class="shortcut-tile">${icon('context-m', 'icon context-m-mark')}<span>Journal</span><small>Open Monolog</small></div>
        </div>
        <div class="shortcut-note-link">${icon('note-page')}<span>Save a note</span></div>
      </div>
    `
  }

  if (state.keyboardMode === 'shortcut-form' && state.shortcutForm) {
    const f = state.shortcutForm
    return `
      <div class="kb-overlay-card kb-shortcut-form">
        <div class="kb-overlay-head">
          ${icon(f.kind === 'alarm' ? 'alarm' : f.kind === 'note' ? 'mic' : 'bell')}
          <strong>${f.kind === 'alarm' ? 'Alarm reminder' : f.kind === 'note' ? 'Save voice note' : 'New reminder'}</strong>
          <span class="preview-draft-tag">Review</span>
        </div>
        <div class="shortcut-field">
          <small>${f.kind === 'note' ? 'Voice note' : 'Title'}</small>
          <strong>${escapeHtml(f.title)}</strong>
        </div>
        ${f.time ? `
          <div class="shortcut-field shortcut-time-row">
            ${icon('clock')}
            <span>${escapeHtml(f.time)}</span>
          </div>
        ` : ''}
        ${f.voiceTranscript ? `
          <div class="shortcut-voice-box">
            <div class="mini-wave" aria-hidden="true">${'<i></i>'.repeat(18)}</div>
            <p>“${escapeHtml(f.voiceTranscript)}”</p>
          </div>
        ` : ''}
        <button type="button" class="kb-full-primary-btn" data-demo-target="shortcut-save">
          ${f.kind === 'note' ? 'Save note' : f.kind === 'alarm' ? 'Set alarm' : 'Set reminder'}
        </button>
      </div>
    `
  }

  if (state.keyboardMode === 'translate') {
    return `
      <div class="kb-overlay-card kb-translate-bar">
        <div class="kb-overlay-head">
          ${icon('globe')}
          <strong>Translate · English → Spanish</strong>
        </div>
        <div class="translate-preview-row">
          <small>Source: “I’m five minutes away”</small>
          <strong>“Estoy a cinco minutos”</strong>
        </div>
        <div class="kb-overlay-actions">
          <button type="button" class="kb-primary-btn" data-demo-target="translate-apply">Insert translation</button>
        </div>
      </div>
    `
  }

  return ''
}

function renderKeyboard(state) {
  if (!state.keyboardOpen) return ''

  const themeClass = state.keyboardTheme === 'ink' ? 'kb-theme-ink' : 'kb-theme-paper'
  const heightClass = state.keyboardHeight === 'tall' ? 'kb-tall' : state.keyboardHeight === 'short' ? 'kb-short' : ''
  const overlay = renderKeyboardOverlay(state)

  let privacyStrip = ''
  if (state.incognito === 'manual') {
    privacyStrip = `<div class="kb-privacy-strip is-incognito">${icon('incognito')}<span>Incognito</span><time>14:52</time></div>`
  } else if (state.incognito === 'detected') {
    privacyStrip = `<div class="kb-privacy-strip is-incognito is-detected">${icon('incognito')}<span>Incognito</span><small>Sensitive text detected</small></div>`
  } else if (state.incognito === 'protected') {
    privacyStrip = `<div class="kb-privacy-strip is-protected">${icon('lock')}<span>Memory paused for this field</span></div>`
  } else if (state.incognito === 'memory-off') {
    privacyStrip = `<div class="kb-privacy-strip is-off">${icon('shield')}<span>Memory Off · Typed drafts not saved</span></div>`
  }

  if (state.keyboardMode === 'vox') {
    const words = (state.voxTranscript || '').trim().split(/\s+/)
    const lastWord = words.pop()
    return `
      <div class="monolog-keyboard-wrap">
        <div class="vox-shell">
          <div class="vox-panel ${state.voxPaused ? 'vox-is-paused' : ''}">
            <div class="vox-panel-head">
              <button type="button" class="vox-back-btn" data-demo-target="vox-done" aria-label="Return to keyboard">${icon('arrow-left')}</button>
              <strong class="vox-title">VOX</strong>
              <span class="vox-collapse">${icon('chevrons-down')}</span>
              <button type="button" class="kb-m-key" data-demo-target="key-m" aria-label="Monolog context">${icon('context-m', 'icon context-m-mark')}</button>
            </div>
            <div class="vox-status-line"><span class="vox-dot"></span>${escapeHtml(state.voxStatus)}</div>
            <div class="vox-wave-stage">
              <div class="vox-wave" aria-hidden="true">
                ${Array.from({ length: 29 }, (_, i) => {
                  const level = 12 + Math.round(Math.exp(-((i - 14) ** 2) / 80) * (55 + Math.sin(i * 1.4) * 24))
                  return `<i style="--h:${level}%;--d:${(i * -0.057).toFixed(2)}s"></i>`
                }).join('')}
              </div>
              ${state.voxFiller ? `
                <div class="vox-readout vox-filter-event"><s>${escapeHtml(state.voxFiller)}</s><span>Filtered by Vox</span></div>
              ` : `
                <div class="vox-readout">
                  <span class="vox-previous-words" data-vox-context>${escapeHtml(words.slice(-2).join(' '))}</span>
                  <span class="vox-live-word ${lastWord ? '' : 'is-placeholder'}" data-demo-field="voxTranscript">${escapeHtml(lastWord) || 'Speak naturally…'}</span>
                </div>
              `}
            </div>
            <div class="vox-actions-row">
              <button type="button" class="vox-lang-chip" data-demo-target="vox-lang">
                <small>Speech language</small><strong>${escapeHtml(state.voxLanguage)} ⌄</strong>
              </button>
              <button type="button" class="vox-pause-btn" data-demo-target="vox-pause" aria-label="Pause listening">${icon('pause')}</button>
              <span class="vox-sub">Smart Filter on</span>
              <span class="vox-delete" aria-hidden="true">${icon('backspace')}</span>
            </div>
            ${state.voxLanguagesOpen ? `
              <div class="vox-lang-menu">
                ${['English', 'English (India)', 'Hindi', 'Spanish'].map(lang => `<span class="${state.voxLanguage === lang ? 'is-selected' : ''}">${lang}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="android-gesture-bar kb-gesture android-gesture-light"><span></span></div>
        </div>
      </div>
    `
  }

  let centerToolbar = ''
  if (state.rewriteBarOpen) {
    const styles = ['Polish', 'Shorten', 'Friendly', 'Professional']
    centerToolbar = `
      <div class="kb-style-strip">
        ${styles.map(s => `
          <span class="kb-style-chip ${state.activeRewriteStyle === s ? 'is-active' : ''}" data-demo-target="style-${s.toLowerCase()}">${s}</span>
        `).join('')}
      </div>
    `
  } else if (state.suggestionPill) {
    centerToolbar = `
      <button type="button" class="kb-suggestion-pill kind-${escapeHtml(state.suggestionPill.kind)}" data-demo-target="kb-suggestion">
        ${state.suggestionPill.icon ? icon(state.suggestionPill.icon) : ''}
        <span>${escapeHtml(state.suggestionPill.label)}</span>
      </button>
    `
  } else if (state.draftText) {
    centerToolbar = `
      <div class="kb-word-strip">
        <span>the</span>
        <span class="is-bold">let’s</span>
        <span>pitch</span>
        <button type="button" class="kb-rewrite-btn" data-demo-target="kb-rewrite" aria-label="Rewrite">
          ${icon('rewrite')}
        </button>
      </div>
    `
  } else {
    centerToolbar = `
      <div class="kb-suggestion-pill is-idle" data-demo-target="kb-suggestion">
        <span>Ask</span>
      </div>
    `
  }

  let bodyArea = ''
  if (state.keyboardMode === 'clipboard') {
    bodyArea = `
      <div class="kb-drawer">
        <div class="kb-drawer-head"><strong>Clipboard</strong><span>Expires in 1h</span></div>
        <div class="kb-clip-card">
          <span>Innovation Lab, Room B · Main Atrium</span>
          <span class="kb-clip-paste">Paste</span>
        </div>
        <div class="kb-clip-card">
          <span>4:00 PM Campus Pitch Deck</span>
          <span class="kb-clip-paste">Paste</span>
        </div>
      </div>
    `
  } else if (state.keyboardMode === 'gifs' || state.keyboardMode === 'stickers') {
    const isStickers = state.keyboardMode === 'stickers'
    bodyArea = `
      <div class="kb-drawer">
        <div class="kb-media-tabs">
          <span>Emoji</span>
          <span class="${!isStickers ? 'is-active' : ''}">GIFs</span>
          <span class="${isStickers ? 'is-active' : ''}">Stickers</span>
        </div>
        <div class="kb-media-grid">
          ${(isStickers ? FEATURE_STICKER_FIXTURES : FEATURE_GIF_FIXTURES).map(item => `
            <div class="kb-media-tile" style="background:${item.bg || 'linear-gradient(135deg,#ffffff,#e7e1f7)'}">
              <strong>${escapeHtml(item.mark || item.label)}</strong>
              <small>${escapeHtml(item.label)}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `
  } else {
    const row0 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
    const row1 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
    const row2 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    const altRow1 = ['@', '#', '£', '_', '&amp;', '-', '+', '(', ')']
    const altRow2 = ['*', '&quot;', '&#39;', ':', ';', '!', '?']
    const key = (ch, num = '') => {
      const pressed = state.activeKey === ch ? 'is-pressed' : ''
      return `<span class="kb-key ${pressed}" data-kb-key="${ch}">${num ? `<small>${num}</small>` : ''}<span>${ch}</span></span>`
    }
    bodyArea = `
      <div class="kb-keys">
        ${state.swipeTrailWord ? `
          <svg class="kb-swipe-trail" viewBox="0 0 320 130" aria-hidden="true">
            <path d="M188,65 C150,55 110,22 92,22 C130,22 252,65 256,65 C256,65 248,22 248,22" fill="none" stroke="rgba(124,58,237,0.55)" stroke-width="5" stroke-linecap="round" />
            <circle cx="188" cy="65" r="5" fill="#7c3aed" />
            <circle cx="248" cy="22" r="5" fill="#7c3aed" />
          </svg>
        ` : ''}
        <div class="kb-number-row" aria-hidden="true">${row0.map((_, index) => `<span>${(index + 1) % 10}</span>`).join('')}</div>
        <div class="kb-row kb-row-0">
          ${row0.map((ch, idx) => key(ch, String((idx + 1) % 10))).join('')}
        </div>
        <div class="kb-row kb-row-1">
          ${row1.map((ch, i) => key(ch, altRow1[i])).join('')}
        </div>
        <div class="kb-row kb-row-2">
          <span class="kb-key kb-special">${icon('arrow-up')}</span>
          ${row2.map((ch, i) => key(ch, altRow2[i])).join('')}
          <span class="kb-key kb-special ${state.activeKey === 'backspace' ? 'is-pressed' : ''}" data-demo-target="kb-backspace">${icon('backspace')}</span>
        </div>
        <div class="kb-bottom-row">
          <span class="kb-util">?123</span>
          <span class="kb-util kb-emoji-key">${icon('smile')}<span>,</span></span>
          <button type="button" class="kb-spacebar" data-demo-target="kb-space" aria-label="Hold spacebar to open Ask AI">
            <span>English (India)</span>
            ${!state.incognito ? icon('bolt') : ''}
          </button>
          <button type="button" class="kb-period ${state.incognito ? 'is-incognito-glow' : ''}" data-demo-target="kb-period" aria-label="Hold period to toggle Incognito">
            ${icon('incognito')}
            <span>.</span>
          </button>
          <span class="kb-return">${icon('enter')}</span>
        </div>
      </div>
    `
  }

  return `
    <div class="monolog-keyboard-wrap">
      ${overlay}
      <div class="monolog-keyboard ${themeClass} ${heightClass}">
        ${privacyStrip}
        <div class="kb-toolbar">
          <button type="button" class="kb-tool-btn" data-demo-target="kb-tools" aria-label="Keyboard tools">${icon('ellipsis')}</button>
          <div class="kb-toolbar-center">${centerToolbar}</div>
          <button type="button" class="kb-tool-btn" data-demo-target="kb-mic" aria-label="Vox voice">${icon('mic')}</button>
          <button type="button" class="kb-m-key ${state.incognito ? 'is-dim' : ''} ${state.keyboardMode === 'shortcuts' ? 'is-context-open' : ''}" data-demo-target="key-m" aria-label="Monolog m key">
            ${icon('context-m', 'icon context-m-mark')}
          </button>
        </div>
        ${bodyArea}
        <div class="android-gesture-bar kb-gesture"><span></span></div>
      </div>
    </div>
  `
}

export function updatePhoneTyping(viewport, field, value, activeKey) {
  const stack = viewport.lastElementChild
  const text = stack?.querySelector('[data-demo-field="' + field + '"]')
  if (text) {
    if (field === 'voxTranscript') {
      const words = value.trim().split(/\s+/)
      const lastWord = words.pop()
      text.textContent = lastWord || 'Speak naturally…'
      text.classList.toggle('is-placeholder', !lastWord)
      stack.querySelector('[data-vox-context]').textContent = words.slice(-2).join(' ')
    } else {
      text.textContent = value || text.dataset.placeholder || ''
      text.classList.toggle('is-placeholder', !value)
      if (field === 'draftText') {
        const composer = text.parentElement
        composer.classList.toggle('has-draft', Boolean(value))
        composer.querySelectorAll('.draft-pill-badge, .typing-caret').forEach(el => {
          el.hidden = !value
        })
        stack.querySelector('.wa-send-btn')?.classList.toggle('is-ready', Boolean(value))
      }
    }
  }
  stack?.querySelector('.kb-key.is-pressed')?.classList.remove('is-pressed')
  if (activeKey) stack?.querySelector('[data-kb-key="' + activeKey + '"]')?.classList.add('is-pressed')
}

const screenRenderers = {
  launcher: renderLauncher,
  splash: renderSplash,
  monolog: renderMonologApp,
  whatsapp: renderWhatsapp,
  notice: renderNoticeScreen,
  shopping: () => renderShoppingPage(),
  notes: renderNotesScreen,
  capture: renderCaptureScreen,
  'companion-note': renderCompanionNote,
}

function screenKey(state) {
  if (state.screen === 'monolog') {
    if (state.screenshotOpen) return 'capture-viewer'
    return state.monologTab + (state.libraryDetailId ? '-detail' : '')
  }
  if (state.screen === 'companion-note' && state.savedNote) return 'saved-note'
  return state.screen
}

function replaceRegion(region, html) {
  if (region.renderedHtml === html) return false
  region.renderedHtml = html
  region.innerHTML = html
  for (const button of region.querySelectorAll('button')) {
    if (!button.matches('[data-demo-target="whatsapp-notification"], [data-demo-target="journal-source-card"], [data-demo-target="library-back"], [data-demo-target="capture-preview"], [data-demo-target="capture-preview-close"], [data-demo-target="capture-audio"], [data-demo-target="library-pitch-card"], [data-demo-target="library-shopping-card"], [data-demo-target^="tab-"], [data-demo-target^="library-filter-"]')) {
      button.tabIndex = -1
    }
  }
  return true
}

export function renderPhoneState(viewport, timeEl, state, motion = {}) {
  timeEl.textContent = state.time || '3:18'
  const companion = ['monolog', 'companion-note', 'capture'].includes(state.screen)
  const isDark = companion ? state.appearance !== 'paper' : !['notice', 'shopping', 'notes', 'protected'].includes(state.screen)
  timeEl.closest('.phone-status-bar').classList.toggle('is-light-text', isDark)
  viewport.dataset.screen = state.screen
  viewport.dataset.appearance = state.appearance

  const key = screenKey(state)
  const previous = viewport.querySelector('.phone-screen-stack:not(.is-departing)')
  const sameScreen = previous?.dataset.screenKey === key
  let stack = sameScreen ? previous : document.createElement('div')
  if (!sameScreen) {
    stack.className = 'phone-screen-stack'
    stack.dataset.screenKey = key
    stack.innerHTML = '<div class="phone-app-layer"></div><div class="phone-keyboard-layer"></div><div class="phone-feedback-layer"></div>'
  }

  const [app, keyboard, feedback] = stack.children
  const oldThread = app.querySelector('.wa-thread')
  const lastMessage = oldThread?.querySelector('[data-message-id]:last-child')?.dataset.messageId
  const oldScroll = app.querySelector('.monolog-app-scroll')?.scrollTop
  const oldKeyboard = keyboard.firstElementChild
  const previousMode = keyboard.dataset.keyboardMode
  const renderScreen = screenRenderers[state.screen] || renderProtectedOrSettingsScreen
  const appChanged = replaceRegion(app, renderScreen(state))
  const keyboardChanged = replaceRegion(keyboard, renderKeyboard(state))
  keyboard.dataset.keyboardMode = state.keyboardMode

  if (appChanged && oldScroll) app.querySelector('.monolog-app-scroll').scrollTop = oldScroll
  const thread = app.querySelector('.wa-thread')
  if (thread && sameScreen) thread.scrollTop = thread.scrollHeight
  const newest = thread?.querySelector('[data-message-id]:last-child')

  const toast = state.toast
    ? '<div class="phone-toast" role="status">' + icon('check') + '<span>' + escapeHtml(state.toast) + '</span></div>'
    : ''
  const banner = state.transitionBanner
    ? '<div class="phone-transition-banner"><span>' + escapeHtml(state.transitionBanner) + '</span></div>'
    : ''
  const feature = state.featurePill
    ? '<div class="phone-feature-pill mono">' + escapeHtml(state.featurePill) + '</div>'
    : ''
  const notification = state.chatNotification ? renderChatNotification() : ''
  replaceRegion(feedback, feature + toast + banner + notification)

  if (!sameScreen) {
    viewport.querySelector('.is-departing')?.remove()
    if (previous && key === 'launcher' && motion.animate) {
      previous.before(stack)
      previous.classList.add('is-departing')
      previous.inert = true
      previous.setAttribute('aria-hidden', 'true')
      previous.style.zIndex = '2'
      motion.animate(stack, [
        { opacity: .72, transform: 'scale(1.04)' },
        { opacity: 1, transform: 'scale(1)' },
      ], 340)
      motion.animate(previous, [
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', borderRadius: '0px' },
        { opacity: 0, transform: 'translate3d(0,-14px,0) scale(.84)', borderRadius: '26px' },
      ], 340, () => previous.remove())
      return
    }
    viewport.append(stack)
    if (thread) thread.scrollTop = thread.scrollHeight
    if (!previous) return
    if (!motion.animate) {
      previous.remove()
      return
    }

    previous.classList.add('is-departing')
    previous.inert = true
    previous.setAttribute('aria-hidden', 'true')
    const launch = key === 'splash' || previous.dataset.screenKey === 'launcher' || key === 'whatsapp'
    if (launch && motion.origin) {
      const { x, y, width, height } = motion.origin
      const left = Math.max(0, x - width / 2)
      const top = Math.max(0, y - height / 2)
      const right = Math.max(0, viewport.clientWidth - x - width / 2)
      const bottom = Math.max(0, viewport.clientHeight - y - height / 2)
      const statusBar = timeEl.closest('.phone-status-bar')
      if (previous.dataset.screenKey === 'launcher' && !isDark) {
        statusBar.classList.add('is-light-text')
      }
      motion.animate(stack, [
        { clipPath: 'inset(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px round 18px)', opacity: .65 },
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', opacity: 1 },
      ], 510, () => {
        previous.remove()
        if (viewport.dataset.screen === state.screen) {
          statusBar.classList.toggle('is-light-text', isDark)
        }
      })
    } else if (key === 'capture') {
      motion.animate(stack, [
        { opacity: 0, transform: 'translate3d(0,14px,0) scale(.985)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
      ], 300, () => previous.remove())
    } else {
      const offset = key === 'launcher' ? 22 : 12
      motion.animate(stack, [
        { opacity: .15, transform: 'translate3d(0,' + offset + 'px,0) scale(.98)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
      ], 360, () => previous.remove())
    }
    return
  }

  if (motion.animate && newest && lastMessage && newest.dataset.messageId !== lastMessage) {
    motion.animate(newest, [
      { opacity: .25, transform: 'translate(12px, 8px) scale(.95)' },
      { opacity: 1, transform: 'translate(0, 0) scale(1)' },
    ], 300)
  }
  if (motion.animate && keyboardChanged && keyboard.firstElementChild && (!oldKeyboard || previousMode !== state.keyboardMode)) {
    const edge = oldKeyboard ? 12 : 85
    motion.animate(keyboard.firstElementChild, [
      { opacity: .35, transform: 'translateY(' + edge + 'px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], 320)
  }
}
