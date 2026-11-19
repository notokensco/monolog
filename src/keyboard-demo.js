// Monolog Interactive Keyboard Demo

export function initKeyboardDemo() {
  const container = document.querySelector('#keyboard-demo')
  if (!container) return

  const input = document.querySelector('#demo-input')
  const demoKeyboard = document.querySelector('#demo-keyboard')
  const surface = document.querySelector('.keyboard-surface')
  const feedback = document.querySelector('#demo-feedback')
  const reminderSuggestion = document.querySelector('#reminder-suggestion')
  const reminderSpan = reminderSuggestion ? reminderSuggestion.querySelector('span') : null
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
  const voxWave = document.querySelector('#demo-voice-wave')
  const demoPanel = document.querySelector('#demo-panel')
  const demoPanelTitle = document.querySelector('#demo-panel-title')
  const demoPanelBody = document.querySelector('#demo-panel-body')
  const autoplayBtn = document.querySelector('#demo-autoplay')
  const tourStatus = document.querySelector('#tour-status')
  const restoreDraftBtn = document.querySelector('#restore-draft')
  const resumeTourBtn = document.querySelector('#resume-tour')
  const presetButtons = [...document.querySelectorAll('[data-preset]')]
  const themeButtons = [...document.querySelectorAll('[data-demo-theme]')]

  let isShifted = false
  let isSymbols = false
  let isIncognito = false
  let isVoxActive = false
  let tourTimer = null
  let isTourRunning = false
  const defaultDraft = "Let's meet at the library at four."

  // 1. Set explicit accessible names expected by end-to-end tests
  if (spaceKey) spaceKey.setAttribute('aria-label', 'Insert a space')
  if (polishBtn) polishBtn.setAttribute('aria-label', 'Polish this thought')
  if (periodKey) periodKey.setAttribute('aria-label', 'Type a period')
  if (memoryKey) memoryKey.setAttribute('aria-label', 'Preview a journal memory')
  if (reminderSuggestion) reminderSuggestion.setAttribute('aria-label', 'Preview the 5 PM exam reminder')

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
      keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(k => ({ letter: k }))
    },
    {
      className: 'keyboard-row row-2',
      special: true,
      keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(k => ({ letter: k }))
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
        }
        content += `<span class="key-glyph">${isShifted ? k.letter.toUpperCase() : k.letter}</span>`
        btn.innerHTML = content

        btn.addEventListener('click', () => {
          stopTour()
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
          stopTour()
          deleteChar()
        })
        rowEl.appendChild(backspaceBtn)
      }

      demoKeyboard.appendChild(rowEl)
    })
  }

  function toggleShift() {
    stopTour()
    isShifted = !isShifted
    const shiftBtn = document.querySelector('#shift-key')
    if (shiftBtn) shiftBtn.setAttribute('aria-pressed', String(isShifted))
    if (demoKeyboard) demoKeyboard.classList.toggle('uppercase', isShifted)
    document.querySelectorAll('.key-glyph').forEach(glyph => {
      glyph.textContent = isShifted ? glyph.textContent.toUpperCase() : glyph.textContent.toLowerCase()
    })
  }

  function toggleSymbols() {
    stopTour()
    isSymbols = !isSymbols
    if (symbolsKey) {
      symbolsKey.setAttribute('aria-pressed', String(isSymbols))
      symbolsKey.textContent = isSymbols ? 'ABC' : '?123'
      symbolsKey.setAttribute('aria-label', isSymbols ? 'Switch to letters' : 'Switch to numbers and symbols')
    }
    renderKeyboard()
  }

  function insertText(str) {
    if (!input) return
    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? input.value.length
    const val = input.value
    input.value = val.slice(0, start) + str + val.slice(end)
    const newPos = start + str.length
    input.setSelectionRange(newPos, newPos)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  function deleteChar() {
    if (!input) return
    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? input.value.length
    const val = input.value
    if (start !== end) {
      input.value = val.slice(0, start) + val.slice(end)
      input.setSelectionRange(start, start)
    } else if (start > 0) {
      input.value = val.slice(0, start - 1) + val.slice(start)
      input.setSelectionRange(start - 1, start - 1)
    }
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  // 3. Attach Bottom Controls
  if (spaceKey) {
    spaceKey.addEventListener('click', () => {
      stopTour()
      insertText(' ')
    })
  }

  if (periodKey) {
    periodKey.addEventListener('click', () => {
      stopTour()
      insertText('.')
    })
  }

  const returnKey = document.querySelector('#return-key')
  if (returnKey) {
    returnKey.addEventListener('click', () => {
      stopTour()
      insertText('\n')
    })
  }

  if (symbolsKey) {
    symbolsKey.addEventListener('click', toggleSymbols)
  }

  // 4. Polish Thought Action
  if (polishBtn) {
    polishBtn.addEventListener('click', () => {
      stopTour()
      if (!input) return
      let text = input.value.trim()
      if (text) {
        text = text.charAt(0).toUpperCase() + text.slice(1)
        if (!/[.!?]$/.test(text)) text += '.'
        input.value = text
      }
    })
  }

  // 5. Memory Key Feedback
  if (memoryKey) {
    memoryKey.addEventListener('click', () => {
      stopTour()
      if (feedback) {
        feedback.hidden = false
        const span = feedback.querySelector('span')
        if (span) span.textContent = 'Nothing is saved in this demo.'
      }
    })
  }

  // 6. Reminder Suggestion
  if (reminderSuggestion) {
    reminderSuggestion.addEventListener('click', () => {
      stopTour()
      if (feedback) {
        feedback.hidden = false
        const span = feedback.querySelector('span')
        if (span) span.textContent = 'Nothing is scheduled here.'
      }
    })
  }

  // 7. Incognito Toggle
  if (incognitoBtn) {
    incognitoBtn.addEventListener('click', () => {
      stopTour()
      isIncognito = !isIncognito
      incognitoBtn.setAttribute('aria-pressed', String(isIncognito))
      if (surface) surface.classList.toggle('keyboard-incognito-on', isIncognito)
      if (reminderSpan) {
        reminderSpan.textContent = isIncognito ? 'Memory paused' : 'Set 5 PM exam reminder'
      }
    })
  }

  // 8. Emoji Picker
  if (emojiKey && emojiTray) {
    emojiKey.addEventListener('click', () => {
      stopTour()
      const isOpen = !emojiTray.hidden
      emojiTray.hidden = isOpen
      emojiKey.setAttribute('aria-expanded', String(!isOpen))
    })

    emojiTray.querySelectorAll('[data-emoji]').forEach(btn => {
      btn.addEventListener('click', () => {
        stopTour()
        insertText(btn.dataset.emoji)
        emojiTray.hidden = true
        emojiKey.setAttribute('aria-expanded', 'false')
      })
    })
  }

  // 9. Voice Toggle / Demo
  if (voiceToggle) {
    voiceToggle.addEventListener('click', () => {
      stopTour()
      if (!input) return
      input.value = "Hey, let's take the long way home."
    })
  }

  // Toolbar Mic opens Vox stage
  if (keyboardMic) {
    keyboardMic.addEventListener('click', () => {
      stopTour()
      startVoxMode("Hey, let's take the long way home.")
    })
  }

  // 10. Clear Text
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      stopTour()
      if (input) {
        input.value = ''
        input.focus()
      }
    })
  }

  // 11. Vox Mode Stage
  function startVoxMode(transcript = "Hey, let's take the long way home.") {
    isVoxActive = true
    if (voxStage) voxStage.hidden = false
    if (demoKeyboard) demoKeyboard.hidden = true
    if (voxTranscript) voxTranscript.textContent = transcript

    // Setup waveform bars
    if (voxWave && !voxWave.hasChildNodes()) {
      for (let i = 0; i < 30; i++) {
        const bar = document.createElement('i')
        bar.style.setProperty('--h', `${15 + Math.random() * 75}%`)
        bar.style.setProperty('--d', `${(i * -0.08).toFixed(2)}s`)
        voxWave.appendChild(bar)
      }
    }
  }

  function stopVoxMode(applyTranscript = false) {
    isVoxActive = false
    if (voxStage) voxStage.hidden = true
    if (demoKeyboard) demoKeyboard.hidden = false
    if (applyTranscript && voxTranscript && input) {
      input.value = voxTranscript.textContent || input.value
    }
  }

  const voxDoneBtn = document.querySelector('[data-demo-action="vox-done"]')
  if (voxDoneBtn) {
    voxDoneBtn.addEventListener('click', () => stopVoxMode(true))
  }

  const voxPauseBtn = document.querySelector('#vox-pause')
  if (voxPauseBtn) {
    voxPauseBtn.addEventListener('click', () => {
      const statusEl = document.querySelector('#vox-status')
      if (statusEl) {
        statusEl.textContent = statusEl.textContent === 'Paused' ? 'Listening…' : 'Paused'
      }
    })
  }

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

  // 13. Tour & Presets
  const presets = {
    typing: {
      status: 'Everyday typing with proactive suggestions.',
      action: () => {
        stopVoxMode(false)
        if (demoPanel) demoPanel.hidden = true
        if (input) input.value = defaultDraft
      }
    },
    vox: {
      status: 'Vox voice mode — continuous speech, natural punctuation.',
      action: () => {
        if (demoPanel) demoPanel.hidden = true
        startVoxMode("Hey, let's take the long way home.")
      }
    },
    ai: {
      status: 'Floating AI panel summons answers without leaving the chat.',
      action: () => {
        stopVoxMode(false)
        if (demoPanel) {
          demoPanel.hidden = false
          if (demoPanelTitle) demoPanelTitle.textContent = 'Monolog AI'
          if (demoPanelBody) {
            demoPanelBody.innerHTML = '<h5>Pack light. Bring the essentials.</h5><p>Water, a light layer, and snacks. Always snacks.</p><span class="source-tag">Sample answer · Cited</span>'
          }
        }
      }
    },
    context: {
      status: 'Tap the m key to capture screen context and notes.',
      action: () => {
        stopVoxMode(false)
        if (demoPanel) {
          demoPanel.hidden = false
          if (demoPanelTitle) demoPanelTitle.textContent = 'Context Capture'
          if (demoPanelBody) {
            demoPanelBody.innerHTML = '<p>Screenshot & note saved to your private Context Library.</p>'
          }
        }
      }
    },
    reminder: {
      status: 'Proactive reminder pill surfaces right in your suggestion ribbon.',
      action: () => {
        stopVoxMode(false)
        if (demoPanel) demoPanel.hidden = true
        if (reminderSuggestion) {
          reminderSuggestion.focus()
        }
      }
    },
    privacy: {
      status: 'Manual incognito pauses learning for 15 minutes.',
      action: () => {
        stopVoxMode(false)
        if (demoPanel) demoPanel.hidden = true
        if (incognitoBtn) incognitoBtn.click()
      }
    },
    journal: {
      status: 'Your day, remembered in an ambient personal chronicle.',
      action: () => {
        stopVoxMode(false)
        if (demoPanel) {
          demoPanel.hidden = false
          if (demoPanelTitle) demoPanelTitle.textContent = 'Daily Journal'
          if (demoPanelBody) {
            demoPanelBody.innerHTML = '<p>“Took the long way home. Glad I did.”</p><span class="source-tag">Evening reflection</span>'
          }
        }
      }
    }
  }

  function selectPreset(name) {
    presetButtons.forEach(btn => {
      const active = btn.dataset.preset === name
      btn.setAttribute('aria-pressed', String(active))
    })
    const preset = presets[name]
    if (preset) {
      if (tourStatus) tourStatus.textContent = preset.status
      preset.action()
    }
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      stopTour()
      selectPreset(btn.dataset.preset)
    })
  })

  function stopTour() {
    if (tourTimer) {
      clearTimeout(tourTimer)
      tourTimer = null
    }
    isTourRunning = false
    if (autoplayBtn) {
      autoplayBtn.setAttribute('aria-pressed', 'false')
      autoplayBtn.textContent = 'Resume tour'
    }
    if (resumeTourBtn) resumeTourBtn.hidden = false
    if (restoreDraftBtn) restoreDraftBtn.hidden = false
  }

  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', () => {
      if (isTourRunning) {
        stopTour()
      } else {
        isTourRunning = true
        autoplayBtn.setAttribute('aria-pressed', 'true')
        autoplayBtn.textContent = 'Pause tour'
        if (resumeTourBtn) resumeTourBtn.hidden = true
        runTourStep(0)
      }
    })
  }

  if (resumeTourBtn) {
    resumeTourBtn.addEventListener('click', () => {
      isTourRunning = true
      if (autoplayBtn) {
        autoplayBtn.setAttribute('aria-pressed', 'true')
        autoplayBtn.textContent = 'Pause tour'
      }
      resumeTourBtn.hidden = true
      runTourStep(0)
    })
  }

  if (restoreDraftBtn) {
    restoreDraftBtn.addEventListener('click', () => {
      if (input) input.value = defaultDraft
      restoreDraftBtn.hidden = true
    })
  }

  const presetKeys = Object.keys(presets)
  function runTourStep(index) {
    if (!isTourRunning) return
    const key = presetKeys[index % presetKeys.length]
    selectPreset(key)
    tourTimer = setTimeout(() => {
      runTourStep(index + 1)
    }, 4500)
  }

  // 14. Theme Switcher for Keyboard Area
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.demoTheme
      themeButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)))
      if (container) container.dataset.theme = theme
    })
  })

  // Initial render
  renderKeyboard()
}
