// Monolog Interactive Keyboard Demo
import { initPhoneFinish, initPhoneModel } from './phone-model.js'
import { initDemoPlayback } from './demo-playback.js'
import { initDemoContext } from './demo-context.js'

export function initKeyboardDemo() {
  const container = document.querySelector('#keyboard-demo')
  if (!container) return

  const input = document.querySelector('#demo-input')
  const demoKeyboard = document.querySelector('#demo-keyboard')
  const surface = document.querySelector('.keyboard-surface')
  const feedback = document.querySelector('#demo-feedback')
  const suggestion = document.querySelector('#keyboard-suggestion')
  const suggestionLabel = suggestion.querySelector('span')
  const suggestionIcon = suggestion.querySelector('use')
  const polishBtn = document.querySelector('#polish-button')
  const spaceKey = document.querySelector('#space-key')
  const periodKey = document.querySelector('#period-key')
  const memoryKey = document.querySelector('#memory-key')
  const clearBtn = document.querySelector('#clear-demo')
  const voiceToggle = document.querySelector('#voice-toggle')
  const keyboardMic = document.querySelector('#keyboard-mic')
  const symbolsKey = document.querySelector('#symbols-key')
  const emojiKey = document.querySelector('#emoji-key')
  const emojiTray = document.querySelector('#emoji-tray')
  const incognitoBtn = document.querySelector('#keyboard-incognito')
  const voxStage = document.querySelector('#vox-stage')
  const voxTranscript = document.querySelector('#vox-transcript')
  const voxStatus = document.querySelector('#vox-status')
  const demoPanel = document.querySelector('#demo-panel')
  const incognitoStrip = document.querySelector('#demo-incognito-strip')
  const bordersButtons = [...container.querySelectorAll('[data-demo-borders]')]
  const compactButton = container.querySelector('[data-demo-compact]')
  const layoutButtons = [...container.querySelectorAll('[data-demo-layout]')]
  const voxLangButton = container.querySelector('[data-demo-action="language"]')
  const { showFront, followDemo, setDemoPose } = initPhoneModel(container)

  const voxLanguages = ['English', 'English (India)', 'Hindi', 'Spanish']
  let voxLangIndex = 0
  let isShifted = false
  let isSymbols = false
  let privacy = 'off'
  let upcoming

  // 2. Keyboard Key Layouts
  const letterRows = [
    {
      className: 'keyboard-row row-0',
      keys: [
        { letter: 'q', num: '1' },
        { letter: 'w', num: '2' },
        { letter: 'e', num: '3' },
        { letter: 'r', num: '4' },
        { letter: 't', num: '5' },
        { letter: 'y', num: '6' },
        { letter: 'u', num: '7' },
        { letter: 'i', num: '8' },
        { letter: 'o', num: '9' },
        { letter: 'p', num: '0' }
      ]
    },
    {
      className: 'keyboard-row row-1',
      keys: [
        { letter: 'a', sub: '@' },
        { letter: 's', sub: '#' },
        { letter: 'd', sub: '£' },
        { letter: 'f', sub: '_' },
        { letter: 'g', sub: '&' },
        { letter: 'h', sub: '-' },
        { letter: 'j', sub: '+' },
        { letter: 'k', sub: '(' },
        { letter: 'l', sub: ')' },
      ]
    },
    {
      className: 'keyboard-row row-2',
      special: true,
      keys: [
        { letter: 'z', sub: '*' },
        { letter: 'x', sub: '"' },
        { letter: 'c', sub: "'" },
        { letter: 'v', sub: ':' },
        { letter: 'b', sub: ';' },
        { letter: 'n', sub: '!' },
        { letter: 'm', sub: '?' },
      ]
    }
  ]

  const symbolRows = [
    {
      className: 'keyboard-row row-0',
      keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(k => ({ letter: k, num: k }))
    },
    {
      className: 'keyboard-row row-1',
      keys: ['@', '#', '$', '%', '&', '-', '+', '(', ')', '/'].map(k => ({ letter: k }))
    },
    {
      className: 'keyboard-row row-2',
      special: true,
      keys: ['*', '"', "'", ':', ';', '!', '?'].map(k => ({ letter: k }))
    }
  ]

  function renderKeyboard() {
    if (!demoKeyboard) return
    demoKeyboard.innerHTML = ''
    demoKeyboard.classList.toggle('symbols-mode', isSymbols)
    demoKeyboard.classList.toggle('uppercase', isShifted)

    const activeRows = isSymbols ? symbolRows : letterRows

    activeRows.forEach((rowDef, index) => {
      const rowEl = document.createElement('div')
      rowEl.className = rowDef.className

      // Row 2 Shift Button
      if (rowDef.special) {
        const shiftBtn = document.createElement('button')
        shiftBtn.className = 'letter-key shift-key'
        shiftBtn.id = 'shift-key'
        shiftBtn.type = 'button'
        shiftBtn.setAttribute('aria-label', isSymbols ? 'More symbols' : 'Toggle uppercase')
        shiftBtn.setAttribute('aria-pressed', String(isShifted))
        shiftBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4 4 14h5v6h6v-6h5L12 4z"/></svg>'
        shiftBtn.addEventListener('click', toggleShift)
        rowEl.appendChild(shiftBtn)
      }

      rowDef.keys.forEach(k => {
        const btn = document.createElement('button')
        btn.className = 'letter-key'
        btn.dataset.letter = k.letter
        btn.type = 'button'
        btn.setAttribute('aria-label', `Type ${k.letter}`)

        let content = ''
        if (k.num) {
          content += `<span class="key-number">${k.num}</span>`
        } else if (k.sub) {
          content += `<span class="key-sub">${k.sub}</span>`
        }
        content += `<span class="key-glyph">${isShifted ? k.letter.toUpperCase() : k.letter}</span>`
        btn.innerHTML = content

        btn.addEventListener('click', () => {
          const char = isShifted ? k.letter.toUpperCase() : k.letter
          insertText(char)
        })

        rowEl.appendChild(btn)
      })

      // Row 2 Backspace Button
      if (rowDef.special) {
        const backspaceBtn = document.createElement('button')
        backspaceBtn.className = 'letter-key backspace-key'
        backspaceBtn.id = 'backspace-key'
        backspaceBtn.type = 'button'
        backspaceBtn.setAttribute('aria-label', 'Delete the previous character')
        backspaceBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><use href="#icon-backspace"/></svg>'
        backspaceBtn.addEventListener('click', () => {
          deleteChar()
        })
        rowEl.appendChild(backspaceBtn)
      }

      demoKeyboard.appendChild(rowEl)
    })
  }

  function toggleShift() {
    isShifted = !isShifted
    const shiftBtn = document.querySelector('#shift-key')
    if (shiftBtn) shiftBtn.setAttribute('aria-pressed', String(isShifted))
    if (demoKeyboard) demoKeyboard.classList.toggle('uppercase', isShifted)
    document.querySelectorAll('.key-glyph').forEach(glyph => {
      glyph.textContent = isShifted ? glyph.textContent.toUpperCase() : glyph.textContent.toLowerCase()
    })
  }

  function toggleSymbols() {
    isSymbols = !isSymbols
    if (symbolsKey) {
      symbolsKey.setAttribute('aria-pressed', String(isSymbols))
      symbolsKey.textContent = isSymbols ? 'ABC' : '?123'
      symbolsKey.setAttribute('aria-label', isSymbols ? 'Switch to letters' : 'Switch to numbers and symbols')
    }
    renderKeyboard()
  }

  function insertText(str) {
    const field = context.noteTarget() ?? input
    const start = field.selectionStart
    const end = field.selectionEnd
    const available = Math.max(0, field.maxLength - field.value.length + end - start)
    field.setRangeText(str.slice(0, available), start, end, 'end')
    field.dispatchEvent(new Event('input', { bubbles: true }))
  }

  function deleteChar() {
    const field = context.noteTarget() ?? input
    const start = field.selectionStart
    const end = field.selectionEnd
    if (start === end && start === 0) return
    const previous = Array.from(field.value.slice(0, start)).at(-1)?.length ?? 1
    field.setRangeText('', start === end ? start - previous : start, end, 'end')
    field.dispatchEvent(new Event('input', { bubbles: true }))
  }

  // 3. Attach Bottom Controls
  if (spaceKey) {
    spaceKey.addEventListener('click', () => {
      insertText(' ')
    })
  }

  if (periodKey) {
    periodKey.addEventListener('click', () => {
      insertText('.')
    })
  }

  const returnKey = document.querySelector('#return-key')
  if (returnKey) {
    returnKey.addEventListener('click', () => {
      insertText('\n')
    })
  }

  if (symbolsKey) {
    symbolsKey.addEventListener('click', toggleSymbols)
  }

  // 4. Polish Thought Action
  if (polishBtn) {
    polishBtn.addEventListener('click', () => {
      if (!input) return
      let text = input.value.trim()
      if (text) {
        text = text.replace(/^lets\b/i, "let's").replace(/\bim\b/g, "I'm").replace(/\bi\b/g, 'I')
        text = text.charAt(0).toUpperCase() + text.slice(1)
        if (!/[.!?]$/.test(text)) text += '.'
        input.value = text
        refreshSuggestion()
      }
    })
  }

  function setUpcoming(event) {
    upcoming = event
    refreshSuggestion()
  }

  function refreshSuggestion() {
    const text = input.value.trim()
    const time = text.match(/\b(1[0-2]|[1-9])(?::[0-5]\d)?\s*(AM|PM)\b/i)?.[0]
    let kind = 'ai'
    let label = 'Ask'
    let icon
    if (privacy !== 'off') {
      kind = 'privacy'
      label = privacy === 'manual' ? 'Memory paused · Incognito' : 'Memory paused · Protected'
      icon = 'lock'
    } else if (!voxStage.hidden) {
      kind = 'vox'
      label = 'VOX'
      icon = 'mic'
    } else if (time && /\b(remind\w*|exam|alarm|meeting|appointment)\b/i.test(text)) {
      kind = 'schedule'
      const action = /\balarm\b/i.test(text) ? 'alarm' : 'reminder'
      label = `Set ${time.toUpperCase()} ${action}`
      icon = 'clock'
    } else if (/\?$|^(?:search|look up|find)\b/i.test(text)) {
      label = 'Search with AI'
    } else if (text.length >= 12 && (/^[a-z]/.test(text) || !/[.!?]$/.test(text))) {
      kind = 'rewrite'
      label = 'Rewrite this draft'
    } else if (upcoming) {
      kind = 'upcoming'
      label = `${upcoming.label} · ${upcoming.time}`
      icon = 'clock'
    }
    suggestion.dataset.suggestion = kind
    suggestion.toggleAttribute('data-idle', label === 'Ask')
    if (suggestionLabel.textContent !== label) suggestionLabel.textContent = label
    suggestionIcon.parentElement.toggleAttribute('hidden', !icon)
    if (icon) suggestionIcon.setAttribute('href', `#icon-${icon}`)
    suggestion.disabled = kind === 'privacy' || kind === 'vox'
  }

  suggestion.addEventListener('click', () => {
    const kind = suggestion.dataset.suggestion
    if (kind === 'rewrite') {
      polishBtn.click()
    } else if (kind === 'schedule') {
      feedback.querySelector('span').textContent = 'Nothing is scheduled here.'
      feedback.hidden = false
    } else if (kind === 'ai' || kind === 'upcoming') {
      context.close()
      demoPanel.querySelector('#demo-panel-title').textContent = kind === 'ai' ? 'AI Ask' : 'Coming up'
      const body = demoPanel.querySelector('#demo-panel-body')
      if (kind === 'ai') {
        const question = input.value.trim() || 'Ask or search…'
        body.innerHTML = `
          <div class="ai-query-box"><span>🔍</span><span></span></div>
          <div class="ai-mode-toggles">
            <span class="ai-chip is-on">Personal on</span>
            <span class="ai-chip">Web on</span>
          </div>
          <p class="ai-result-answer">Demo search preview. Your question stays in this tab.</p>
          <span class="source-tag">Personal + Web · Sample</span>
        `
        body.querySelector('.ai-query-box span:last-child').textContent = question
      } else {
        const query = document.createElement('h5')
        query.textContent = upcoming.label
        const note = document.createElement('p')
        note.textContent = `${upcoming.time} · Demo preview`
        body.replaceChildren(query, note)
      }
      demoPanel.hidden = false
    }
  })

  input.addEventListener('input', refreshSuggestion)

  function setPrivacy(mode) {
    privacy = mode
    surface.dataset.privacy = mode
    incognitoBtn.setAttribute('aria-pressed', String(mode === 'manual'))
    memoryKey.disabled = mode !== 'off'
    polishBtn.hidden = mode !== 'off'
    if (incognitoStrip) {
      incognitoStrip.hidden = mode === 'off'
      const label = incognitoStrip.querySelector('[data-incognito-label]')
      const timer = incognitoStrip.querySelector('[data-incognito-timer]')
      if (label) label.textContent = mode === 'protected' ? 'Memory paused for this field' : 'Incognito'
      if (timer) timer.hidden = mode === 'protected'
    }
    if (mode !== 'off') {
      context.close()
      context.cancelDraftCue()
    }
    refreshSuggestion()
  }

  function setKeyBorders(enabled) {
    container.dataset.keyBorders = String(enabled)
    for (const button of bordersButtons) button.setAttribute('aria-pressed', String(enabled))
    if (compactButton) {
      compactButton.hidden = !enabled
      if (!enabled) {
        container.dataset.compactKeys = 'false'
        compactButton.setAttribute('aria-pressed', 'false')
      }
    }
  }

  for (const button of bordersButtons) {
    button.addEventListener('click', () => setKeyBorders(container.dataset.keyBorders !== 'true'))
  }
  if (compactButton) {
    compactButton.addEventListener('click', () => {
      const next = container.dataset.compactKeys !== 'true'
      container.dataset.compactKeys = String(next)
      compactButton.setAttribute('aria-pressed', String(next))
    })
  }
  for (const button of layoutButtons) {
    button.addEventListener('click', () => {
      const next = button.dataset.demoLayout
      container.dataset.layout = next
      for (const option of layoutButtons) option.setAttribute('aria-pressed', String(option === button))
    })
  }
  if (voxLangButton) {
    voxLangButton.addEventListener('click', () => {
      voxLangIndex = (voxLangIndex + 1) % voxLanguages.length
      const label = voxLanguages[voxLangIndex]
      const strong = voxLangButton.querySelector('strong')
      if (strong) strong.textContent = `${label} ⌄`
    })
  }

  incognitoBtn.addEventListener('click', () => setPrivacy(privacy === 'manual' ? 'off' : 'manual'))

  // 8. Emoji Picker
  if (emojiKey && emojiTray) {
    emojiKey.addEventListener('click', () => {
      const isOpen = !emojiTray.hidden
      emojiTray.hidden = isOpen
      emojiKey.setAttribute('aria-expanded', String(!isOpen))
    })

    emojiTray.querySelectorAll('[data-emoji]').forEach(btn => {
      btn.addEventListener('click', () => {
        insertText(btn.dataset.emoji)
        emojiTray.hidden = true
        emojiKey.setAttribute('aria-expanded', 'false')
      })
    })
  }

  // 9. Voice Toggle / Demo
  if (voiceToggle) {
    voiceToggle.addEventListener('click', () => {
      if (!input) return
      input.value = "Hey, let's take the long way home."
      refreshSuggestion()
    })
  }

  // Toolbar Mic opens Vox stage
  if (keyboardMic) {
    keyboardMic.addEventListener('click', () => {
      startVoxMode("Hey, let's take the long way home.")
    })
  }

  // 10. Clear Text
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) {
        input.value = ''
        refreshSuggestion()
        input.focus()
      }
    })
  }

  // 11. Vox Mode Stage
  function startVoxMode(transcript = "Hey, let's take the long way home.") {
    context.close()
    closeTools()
    if (voxStage) voxStage.hidden = false
    if (demoKeyboard) demoKeyboard.hidden = true
    if (voxTranscript) voxTranscript.textContent = transcript
    surface.dataset.vox = 'listening'
    voxStatus.textContent = 'Listening…'
    updateVoxPause(false)
    refreshSuggestion()
  }

  function stopVoxMode(applyTranscript = false) {
    if (voxStage) voxStage.hidden = true
    if (demoKeyboard) demoKeyboard.hidden = false
    delete surface.dataset.vox
    if (applyTranscript && voxTranscript && input) {
      input.value = voxTranscript.textContent || input.value
    }
    refreshSuggestion()
  }

  const voxDoneBtn = document.querySelector('[data-demo-action="vox-done"]')
  if (voxDoneBtn) {
    voxDoneBtn.addEventListener('click', () => stopVoxMode(true))
  }

  const voxPauseBtn = document.querySelector('#vox-pause')
  function updateVoxPause(paused) {
    voxPauseBtn.setAttribute('aria-label', paused ? 'Resume Vox voice demo' : 'Pause Vox voice demo')
    voxPauseBtn.querySelector('use').setAttribute('href', paused ? '#icon-play' : '#icon-pause')
  }
  if (voxPauseBtn) {
    voxPauseBtn.addEventListener('click', () => {
      const paused = surface.dataset.vox !== 'paused'
      surface.dataset.vox = paused ? 'paused' : 'listening'
      voxStatus.textContent = paused ? 'Paused' : 'Listening…'
      updateVoxPause(paused)
    })
  }

  const toolsToggle = container.querySelector('#keyboard-tools')
  const toolbox = container.querySelector('#demo-toolbox')
  const clipboard = container.querySelector('#demo-clipboard-tools')
  const settings = container.querySelector('#demo-settings-tools')
  const paste = container.querySelector('#demo-paste-draft')
  let copiedDraft = ''

  function closeTools() {
    toolbox.hidden = true
    toolsToggle.setAttribute('aria-expanded', 'false')
    clipboard.hidden = true
    settings.hidden = true
  }

  toolsToggle.addEventListener('click', () => {
    if (!toolbox.hidden) {
      closeTools()
      return
    }
    stopVoxMode()
    emojiTray.hidden = true
    emojiKey.setAttribute('aria-expanded', 'false')
    toolbox.hidden = false
    toolsToggle.setAttribute('aria-expanded', 'true')
  })
  toolbox.addEventListener('click', event => {
    const action = event.target.closest('[data-keyboard-tool]')?.dataset.keyboardTool
    if (!action) return
    clipboard.hidden = action !== 'clipboard'
    settings.hidden = action !== 'settings'
    if (action === 'privacy' || action === 'emoji') {
      closeTools()
      const control = action === 'privacy' ? incognitoBtn : emojiKey
      control.focus({ preventScroll: true })
      control.click()
    }
  })
  container.querySelector('#demo-copy-draft').addEventListener('click', () => {
    copiedDraft = input.value
    paste.disabled = !copiedDraft
  })
  paste.addEventListener('click', () => {
    closeTools()
    insertText(copiedDraft)
    input.focus({ preventScroll: true })
  })
  surface.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !toolbox.hidden) {
      closeTools()
      toolsToggle.focus()
    }
  })

  // 12. Floating Panel
  const panelCloseBtn = document.querySelector('[data-demo-action="close-panel"]')
  if (panelCloseBtn) {
    panelCloseBtn.addEventListener('click', () => {
      if (demoPanel) demoPanel.hidden = true
    })
  }

  const panelExpandBtn = document.querySelector('#demo-panel-expand')
  if (panelExpandBtn) {
    panelExpandBtn.addEventListener('click', () => {
      const isExpanded = panelExpandBtn.getAttribute('aria-pressed') === 'true'
      panelExpandBtn.setAttribute('aria-pressed', String(!isExpanded))
      if (demoPanel) demoPanel.classList.toggle('is-expanded', !isExpanded)
    })
  }

  initPhoneFinish(container)

  const context = initDemoContext(container, {
    isPrivate: () => privacy !== 'off',
    showFront,
    onOpen() {
      closeTools()
      if (!voxStage.hidden) stopVoxMode()
    },
    onShortcut(action) {
      const time = action === 'Alarm' ? '7:00 AM tomorrow' : '5:00 PM today'
      setUpcoming({ label: action, time })
      return `${action} for ${time} · Demo preview`
    },
  })

  renderKeyboard()
  refreshSuggestion()
  initDemoPlayback(container, {
    followDemo, setDemoPose, context, setUpcoming, setPrivacy, startVoxMode, stopVoxMode, closeTools, refreshSuggestion,
  })
}
