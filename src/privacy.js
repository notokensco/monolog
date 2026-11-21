import '@fontsource-variable/manrope'
import '@fontsource/beth-ellen/400.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/roboto/latin-400.css'
import './styles.css'
import './privacy.css'

// Interactive Privacy State Simulator
const stateData = {
  'memory-off': {
    title: 'Memory Off — Pure Keyboard Baseline',
    desc: 'Monolog operates as a familiar, high-performance Android keyboard. No keystrokes are logged, no text is committed to the local Room database, and local AI creates zero memory records. Complete offline typing with zero trace.',
    db: 'DISCONNECTED / IDLE',
    dbClass: 'val-neutral',
    ai: 'STANDBY (NO PROCESSING)',
    aiClass: 'val-neutral',
    buffer: 'IMMEDIATE FLUSH',
    bufferClass: 'val-green',
    cloud: 'BLOCKED (ZERO CALLS)',
    cloudClass: 'val-green',
    shield: 'STANDARD KEYBOARD',
    shieldClass: 'val-neutral',
    pill: 'State: Memory Off',
    pillClass: 'val-neutral'
  },
  'memory-on': {
    title: 'Memory On — Consensual Encrypted Journaling',
    desc: 'With explicit consent, eligible non-sensitive drafts contribute to your personal journal. Data is stored directly on your phone in an encrypted SQLite Room database secured by Android Keystore AES-256-GCM. On-device Gemma AI assists locally without silent uploads.',
    db: 'ENCRYPTED (AES-256-GCM)',
    dbClass: 'val-green',
    ai: 'ACTIVE (ON-DEVICE NPU)',
    aiClass: 'val-purple',
    buffer: 'FILTERED DRAFTS ONLY',
    bufferClass: 'val-purple',
    cloud: 'EXPLICIT OPT-IN PER QUERY',
    cloudClass: 'val-yellow',
    shield: 'ACTIVE PROTECTION',
    shieldClass: 'val-green',
    pill: 'State: Memory On (Consensual)',
    pillClass: 'val-green'
  },
  'incognito': {
    title: 'Manual Incognito — 15-Minute Complete Pause',
    desc: 'Activated instantly by holding the period (.) key or selecting Incognito from the keyboard menu. Displays the hat-and-glasses icon with an active countdown. Memory capture, contextual suggestions, and local learning are halted entirely until resumed.',
    db: 'TEMPORARILY FROZEN',
    dbClass: 'val-yellow',
    ai: 'PROCESSING HALTED',
    aiClass: 'val-yellow',
    buffer: 'ZERO CAPTURE (EPHEMERAL)',
    bufferClass: 'val-green',
    cloud: 'BLOCKED',
    cloudClass: 'val-green',
    shield: 'INCOGNITO ACTIVE',
    shieldClass: 'val-yellow',
    pill: 'State: Manual Incognito (15m)',
    pillClass: 'val-yellow'
  },
  'protected': {
    title: 'Protected Input — Automatic Hardware-Level Shield',
    desc: 'Triggered automatically in password/PIN/OTP fields, banking apps, and user-excluded apps. Cannot be overridden, bypassed, or expired by a timer. Context capture, Vox voice dictation, predictions, and cloud AI are strictly disabled.',
    db: 'STRICT BYPASS (NEVER STORED)',
    dbClass: 'val-red',
    ai: 'DISABLED FOR FIELD',
    aiClass: 'val-red',
    buffer: 'NULL BUFFER (NO PREDICT)',
    bufferClass: 'val-red',
    cloud: 'STRICTLY PROHIBITED',
    cloudClass: 'val-red',
    shield: 'HARDWARE SHIELD ENGAGED',
    shieldClass: 'val-red',
    pill: 'State: Protected Field (Banking/PIN)',
    pillClass: 'val-red'
  }
}

function initPrivacySimulator() {
  const tabs = document.querySelectorAll('.state-tab-btn')
  const titleEl = document.getElementById('sim-title')
  const descEl = document.getElementById('sim-desc')
  const dbEl = document.getElementById('sim-db')
  const aiEl = document.getElementById('sim-ai')
  const bufferEl = document.getElementById('sim-buffer')
  const cloudEl = document.getElementById('sim-cloud')
  const shieldEl = document.getElementById('sim-shield')
  const pillEl = document.getElementById('sim-pill')

  if (!tabs.length || !titleEl) return

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const stateKey = tab.dataset.state
      const data = stateData[stateKey]
      if (!data) return

      tabs.forEach(t => t.setAttribute('aria-selected', 'false'))
      tab.setAttribute('aria-selected', 'true')

      titleEl.textContent = data.title
      descEl.textContent = data.desc

      dbEl.textContent = data.db
      dbEl.className = `sim-field-val ${data.dbClass}`

      aiEl.textContent = data.ai
      aiEl.className = `sim-field-val ${data.aiClass}`

      bufferEl.textContent = data.buffer
      bufferEl.className = `sim-field-val ${data.bufferClass}`

      cloudEl.textContent = data.cloud
      cloudEl.className = `sim-field-val ${data.cloudClass}`

      shieldEl.textContent = data.shield
      shieldEl.className = `sim-field-val ${data.shieldClass}`

      pillEl.textContent = data.pill
      pillEl.className = `sim-preview-status-pill tag-badge ${data.pillClass}`
    })
  })
}

// Scroll Progress Indicator
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress')
  if (!progressBar) return

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    if (totalHeight <= 0) return
    const progress = window.scrollY / totalHeight
    progressBar.style.transform = `scaleX(${progress})`
  }, { passive: true })
}

// Table of Contents Active Link Highlight
function initTocObserver() {
  const tocLinks = document.querySelectorAll('.privacy-toc-link')
  const sections = document.querySelectorAll('.privacy-section')

  if (!tocLinks.length || !sections.length) return

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active')
          } else {
            link.classList.remove('active')
          }
        })
      }
    })
  }, {
    rootMargin: '-20% 0px -70% 0px'
  })

  sections.forEach(sec => observer.observe(sec))
}

// Copy Email Utility
function initCopyEmail() {
  const btn = document.getElementById('copy-privacy-email')
  if (!btn) return

  btn.addEventListener('click', async () => {
    const email = 'monolog@notokens.co'
    try {
      await navigator.clipboard.writeText(email)
      const originalText = btn.innerHTML
      btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg> Copied!`
      setTimeout(() => {
        btn.innerHTML = originalText
      }, 2500)
    } catch {
      window.location.href = `mailto:${email}`
    }
  })
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initPrivacySimulator()
    initScrollProgress()
    initTocObserver()
    initCopyEmail()
  })
} else {
  initPrivacySimulator()
  initScrollProgress()
  initTocObserver()
  initCopyEmail()
}
