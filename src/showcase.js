const sampleDictation = 'I’ll take the bus and be there by four.'
const unfilteredDictation = 'I’ll take the, uh, bus and be there by four.'
const voxLanguages = ['English', 'English (India)', 'Hindi', 'Spanish']

const sampleAnswers = [
  { match: /\b(study room|library|close|hours)\b/i, answer: 'The study room closes at 8:00 PM. Last entry is at 7:30 PM.', source: 'Riverside Library hours' },
  { match: /\b(coffee|sam)\b/i, answer: 'Coffee with Sam is in the sample journal entry for 15 November.', source: 'Sample journal · 15 November' },
  { match: /\b(hotel|check.in|namba)\b/i, answer: 'Check-in at Hotel Namba is at 3:00 PM.', source: 'Weekend getaway screenshot' },
]

function buildKeyboard(keyboard, { symbols = false, shifted = false, incognito = false, aiActive = false } = {}) {
  const row0 = symbols
    ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(k => ({ ch: k }))
    : [
        ['q', '1'], ['w', '2'], ['e', '3'], ['r', '4'], ['t', '5'],
        ['y', '6'], ['u', '7'], ['i', '8'], ['o', '9'], ['p', '0'],
      ].map(([ch, sub]) => ({ ch, sub }))
  const row1 = symbols
    ? ['@', '#', '£', '_', '&', '-', '+', '(', ')'].map(ch => ({ ch }))
    : [
        ['a', '@'], ['s', '#'], ['d', '£'], ['f', '_'], ['g', '&'],
        ['h', '-'], ['j', '+'], ['k', '('], ['l', ')'],
      ].map(([ch, sub]) => ({ ch, sub }))
  const row2Letters = symbols
    ? ['*', '"', "'", ':', ';', '!', '?'].map(ch => ({ ch }))
    : [
        ['z', '*'], ['x', '"'], ['c', "'"], ['v', ':'], ['b', ';'], ['n', '!'], ['m', '?'],
      ].map(([ch, sub]) => ({ ch, sub }))

  const rows = [
    { className: 'showcase-key-row', keys: row0 },
    { className: 'showcase-key-row showcase-key-row-mid', keys: row1 },
    {
      className: 'showcase-key-row',
      keys: [{ ch: 'shift', icon: 'shift' }, ...row2Letters, { ch: 'delete', icon: 'backspace' }],
    },
    {
      className: 'showcase-key-row showcase-key-row-actions',
      keys: [
        { ch: 'symbols', label: symbols ? 'ABC' : '?123' },
        { ch: ',', icon: 'smile' },
        { ch: 'space', label: aiActive ? 'AI Ask' : 'English', bolt: !incognito },
        { ch: '.', icon: 'incognito' },
        { ch: 'enter', icon: aiActive ? 'arrow' : 'enter' },
      ],
    },
  ]

  const glyphSvg = name => ({
    shift: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 4 14h5v6h6v-6h5L12 4z"/></svg>',
    backspace: '<svg class="icon" aria-hidden="true"><use href="#icon-backspace"/></svg>',
    enter: '<svg class="icon" aria-hidden="true"><use href="#icon-enter"/></svg>',
    arrow: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    smile: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14a4.5 4.5 0 0 0 8 0"/><circle cx="9" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r=".8" fill="currentColor" stroke="none"/></svg><span class="sc-punct">,</span>',
    incognito: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 11 2-7 3 2 3-2 2 7z" fill="currentColor" stroke="none"/><path d="M4 12h16M10 17h4"/><circle cx="7.5" cy="17" r="3"/><circle cx="16.5" cy="17" r="3"/></svg><span class="sc-punct">.</span>',
    bolt: '<svg class="icon sc-bolt" viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-8 12h6l-1 8 9-13h-7l1-7Z"/></svg>',
  }[name] || '')

  keyboard.replaceChildren()
  for (const rowDef of rows) {
    const row = document.createElement('div')
    row.className = rowDef.className
    for (const item of rowDef.keys) {
      const button = document.createElement('button')
      button.type = 'button'
      button.dataset.key = item.ch
      const isAlpha = item.ch.length === 1 && /[a-z]/.test(item.ch)
      const face = item.label ?? (isAlpha && shifted ? item.ch.toUpperCase() : item.ch)
      if (item.ch === 'space' && aiActive) button.classList.add('is-ai-active')
      if (item.ch === '.' && incognito) button.classList.add('is-incognito-glow')
      if (item.ch === 'shift') button.setAttribute('aria-pressed', String(shifted))
      if (item.sub) {
        const sub = document.createElement('span')
        sub.className = 'sc-key-sub'
        sub.textContent = item.sub
        button.append(sub)
      }
      if (item.icon) {
        button.innerHTML = glyphSvg(item.icon)
      } else {
        button.append(face)
        if (item.bolt) button.insertAdjacentHTML('beforeend', glyphSvg('bolt'))
      }
      button.setAttribute('aria-label', {
        delete: 'Backspace',
        space: 'Space',
        shift: 'Shift',
        symbols: symbols ? 'Letters' : 'Symbols',
        enter: 'Enter',
        '.': 'Period',
        ',': 'Comma',
      }[item.ch] || `Type ${item.ch}`)
      row.append(button)
    }
    keyboard.append(row)
  }
}

export function initShowcase(reducedMotion) {
  const showcase = document.querySelector('#showcase')
  const stage = showcase.querySelector('.showcase-stage')
  const keyboardDevice = stage.querySelector('.showcase-device')
  const draft = keyboardDevice.querySelector('textarea')
  const keyboard = keyboardDevice.querySelector('.showcase-keyboard')
  const modes = [...keyboardDevice.querySelectorAll('[data-mode]')]
  const tabs = [...showcase.querySelectorAll('[role="tab"]')]
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')))
  const themes = [...showcase.querySelectorAll('[data-preview-theme-choice]')]
  const borderBtn = showcase.querySelector('[data-preview-borders]')
  const compactBtn = showcase.querySelector('[data-preview-compact]')
  const layoutBtns = [...showcase.querySelectorAll('[data-preview-layout]')]
  const incognitoStrip = keyboardDevice.querySelector('[data-sc-incognito-strip]')
  const incognitoStripText = keyboardDevice.querySelector('[data-sc-strip-text]')
  const incognitoStripTime = keyboardDevice.querySelector('[data-sc-strip-time]')
  const kbHeader = keyboardDevice.querySelector('[data-sc-kb-header]')
  const scSuggestion = keyboardDevice.querySelector('[data-sc-suggestion]')
  const scMKey = keyboardDevice.querySelector('[data-sc-m-key]')
  const scShortcuts = keyboardDevice.querySelector('[data-sc-shortcuts]')
  const scShortcutNote = keyboardDevice.querySelector('[data-sc-shortcut-note]')
  const chatHeader = keyboardDevice.querySelector('[data-sc-chat-header]')
  const peer = keyboardDevice.querySelector('[data-sc-peer]')
  const peerSub = keyboardDevice.querySelector('[data-sc-peer-sub]')
  const bankBanner = keyboardDevice.querySelector('[data-sc-bank-banner]')
  let active = 0
  let shifted = false
  let symbols = false
  let voxLangIdx = 0
  let smartFilter = true
  let aiPersonal = true
  let aiWeb = false

  const memory = keyboardDevice.querySelector('[data-memory-state]')
  const memButtons = [...keyboardDevice.querySelectorAll('[data-sc-mem-btn]')]

  function syncKeyboard() {
    const mode = panels[active]?.dataset.typingPanel || 'typing'
    const isPrivate = mode === 'incognito' ? memory.value !== 'on' : false
    const aiActive = mode === 'ai'
    const voxActive = mode === 'vox'
    keyboard.hidden = voxActive
    kbHeader.hidden = voxActive
    if (voxActive) scShortcuts.hidden = true
    incognitoStrip.hidden = !isPrivate
    if (isPrivate) {
      incognitoStripText.textContent = memory.value === 'protected' ? 'Memory paused for this field' : 'Incognito'
      incognitoStripTime.hidden = memory.value === 'protected'
      incognitoStripTime.textContent = '14:58'
    }
    scMKey.disabled = isPrivate
    const protectedBank = mode === 'incognito' && memory.value === 'protected'
    bankBanner.hidden = !protectedBank
    thread.hidden = protectedBank
    peer.textContent = protectedBank ? 'Pine Bank' : 'Sam'
    peerSub.textContent = protectedBank ? 'Protected field · Password' : 'WhatsApp · Demo conversation'
    chatHeader.dataset.bank = String(protectedBank)
    if (isPrivate) scSuggestion.textContent = 'Memory paused · Protected'
    else if (/\b5\s*pm|exam\b/i.test(draft.value)) scSuggestion.textContent = '⏰ Set 5 PM reminder'
    else scSuggestion.textContent = draft.value.trim() ? 'Rewrite · Polish draft' : 'let’s · four · Rewrite'

    buildKeyboard(keyboard, { symbols, shifted, incognito: isPrivate, aiActive })
  }

  function insertDraft(text, start = draft.selectionStart, end = draft.selectionEnd) {
    const available = draft.maxLength - (draft.value.length - (end - start))
    draft.setRangeText(text.slice(0, available), start, end, 'end')
    syncKeyboard()
  }

  keyboard.addEventListener('click', event => {
    const key = event.target.closest('[data-key]')?.dataset.key
    if (!key) return
    if (key === 'shift') {
      shifted = !shifted
      syncKeyboard()
      return
    }
    if (key === 'symbols') {
      symbols = !symbols
      syncKeyboard()
      return
    }
    if (key === 'enter') {
      if (panels[active]?.dataset.typingPanel === 'ai') ai.requestSubmit()
      else keyboardDevice.querySelector('[data-draft-send]').click()
      return
    }
    if (key === 'delete') {
      const { selectionStart, selectionEnd } = draft
      const lastCharacter = Array.from(draft.value.slice(0, selectionStart)).at(-1)
      const start = selectionStart === selectionEnd ? selectionStart - (lastCharacter?.length || 0) : selectionStart
      insertDraft('', start, selectionEnd)
      return
    }
    const isAlpha = key.length === 1 && /[a-z]/.test(key)
    const ch = key === 'space' ? ' ' : isAlpha && shifted ? key.toUpperCase() : key
    insertDraft(ch)
  })

  draft.addEventListener('input', syncKeyboard)
  keyboardDevice.querySelector('[data-draft-clear]').addEventListener('click', () => {
    draft.value = ''
    syncKeyboard()
  })

  const thread = keyboardDevice.querySelector('.showcase-thread')
  keyboardDevice.querySelector('[data-draft-send]').addEventListener('click', () => {
    const text = draft.value.trim()
    if (!text) return
    const message = document.createElement('p')
    message.className = 'showcase-bubble showcase-bubble-sent'
    message.textContent = text
    thread.append(message)
    draft.value = ''
    syncKeyboard()
    const chat = thread.parentElement
    chat.scrollTop += Math.max(0, message.getBoundingClientRect().bottom - chat.getBoundingClientRect().bottom)
  })

  scSuggestion.addEventListener('click', () => {
    if (!draft.value.trim()) draft.value = 'let’s meet at library at 5 pm'
    else draft.value = draft.value.charAt(0).toUpperCase() + draft.value.slice(1).replace(/\bim\b/g, "I'm")
    if (!/[.!?]$/.test(draft.value)) draft.value += '.'
    syncKeyboard()
  })
  keyboardDevice.querySelector('[data-sc-open-vox]').addEventListener('click', () => selectTab(1))
  keyboardDevice.querySelector('[data-sc-vox-back]').addEventListener('click', () => selectTab(0))
  scMKey.addEventListener('click', () => { scShortcuts.hidden = !scShortcuts.hidden })
  scShortcuts.addEventListener('click', event => {
    const chosen = event.target.closest('[data-sc-shortcut]')?.dataset.scShortcut
    if (chosen) scShortcutNote.textContent = `${chosen} · Saved privately`
  })

  const voxStatus = keyboardDevice.querySelector('[data-vox-status]')
  const wave = keyboardDevice.querySelector('.showcase-wave')
  const transcript = keyboardDevice.querySelector('[data-vox-transcript]')
  const play = keyboardDevice.querySelector('[data-vox-play]')
  const insertTranscript = keyboardDevice.querySelector('[data-vox-insert]')
  const voxLangBtn = keyboardDevice.querySelector('[data-sc-vox-lang]')
  const voxLangName = keyboardDevice.querySelector('[data-sc-vox-lang-name]')
  const voxFilterBtn = keyboardDevice.querySelector('[data-sc-vox-filter]')
  let dictationTimer
  for (const [index, height] of [7, 11, 17, 9, 23, 16, 26, 12, 21, 15, 8, 19, 11, 6, 13, 8, 16, 10].entries()) {
    const bar = document.createElement('i')
    bar.style.setProperty('--bar-height', `${height}px`)
    bar.style.setProperty('--bar-delay', `${index * -65}ms`)
    wave.append(bar)
  }

  function activeDictation() {
    return smartFilter ? sampleDictation : unfilteredDictation
  }

  function completeDictation() {
    clearInterval(dictationTimer)
    transcript.textContent = activeDictation()
    voxStatus.textContent = 'Transcript ready'
    wave.removeAttribute('data-playing')
    insertTranscript.disabled = false
    play.disabled = false
  }

  play.addEventListener('click', () => {
    const targetText = activeDictation()
    if (reducedMotion.matches) {
      completeDictation()
      return
    }
    const words = targetText.split(' ')
    let count = 0
    voxStatus.textContent = 'Listening…'
    transcript.textContent = ''
    wave.setAttribute('data-playing', '')
    play.disabled = true
    insertTranscript.disabled = true
    dictationTimer = setInterval(() => {
      transcript.textContent = words.slice(0, ++count).join(' ')
      if (count === words.length) completeDictation()
    }, 170)
  })
  insertTranscript.addEventListener('click', () => insertDraft(activeDictation()))
  voxLangBtn.addEventListener('click', () => {
    voxLangIdx = (voxLangIdx + 1) % voxLanguages.length
    voxLangName.textContent = `${voxLanguages[voxLangIdx]} ⌄`
  })
  voxFilterBtn.addEventListener('click', () => {
    smartFilter = !smartFilter
    voxFilterBtn.setAttribute('aria-pressed', String(smartFilter))
    if (!insertTranscript.disabled) transcript.textContent = activeDictation()
  })

  const ai = keyboardDevice.querySelector('[data-mode="ai"]')
  const answer = ai.querySelector('[data-ai-answer]')
  const source = ai.querySelector('[data-ai-source]')
  const insertAnswer = ai.querySelector('[data-ai-insert]')
  const aiModeLabel = ai.querySelector('[data-ai-mode-label]')
  const aiPersonalBtn = ai.querySelector('[data-ai-toggle="personal"]')
  const aiWebBtn = ai.querySelector('[data-ai-toggle="web"]')

  function syncAiModes() {
    aiPersonalBtn.setAttribute('aria-pressed', String(aiPersonal))
    aiWebBtn.setAttribute('aria-pressed', String(aiWeb))
    aiWebBtn.textContent = aiWeb ? 'Web on · Safe' : 'Web off'
    aiModeLabel.textContent = aiWeb ? 'Personal + Web search' : aiPersonal ? 'Personal · Offline' : 'AI Ask'
  }
  aiPersonalBtn.addEventListener('click', () => { aiPersonal = !aiPersonal; syncAiModes() })
  aiWebBtn.addEventListener('click', () => { aiWeb = !aiWeb; syncAiModes() })
  ai.querySelectorAll('[data-ai-prompt]').forEach(chip => {
    chip.addEventListener('click', () => {
      ai.elements.question.value = chip.dataset.aiPrompt
      ai.requestSubmit()
    })
  })
  ai.addEventListener('submit', event => {
    event.preventDefault()
    const question = ai.elements.question.value.trim()
    const result = sampleAnswers.find(sample => sample.match.test(question))
    answer.textContent = result?.answer || 'No sample matches. Try asking about library hours, coffee with Sam, or hotel check-in.'
    source.hidden = !result
    source.textContent = result ? `Sample source · ${result.source}` : ''
    insertAnswer.disabled = !result
  })
  ai.addEventListener('input', () => {
    answer.textContent = ''
    source.hidden = true
    insertAnswer.disabled = true
  })
  insertAnswer.addEventListener('click', () => insertDraft(answer.textContent))

  const memoryStatus = keyboardDevice.querySelector('[data-memory-status]')
  const memoryResult = keyboardDevice.querySelector('[data-memory-result]')
  const states = {
    on: 'Sample drafts can be saved.',
    incognito: 'Memory paused while incognito is on.',
    protected: 'Memory paused for this protected field.',
  }
  function updateMemoryUI() {
    memoryStatus.textContent = states[memory.value]
    memoryResult.textContent = ''
    for (const btn of memButtons) btn.setAttribute('aria-pressed', String(btn.dataset.scMemBtn === memory.value))
    syncKeyboard()
  }
  memory.addEventListener('change', updateMemoryUI)
  for (const btn of memButtons) {
    btn.addEventListener('click', () => {
      memory.value = btn.dataset.scMemBtn
      updateMemoryUI()
    })
  }
  keyboardDevice.querySelector('[data-memory-save]').addEventListener('click', () => {
    const note = draft.value.trim()
    memoryResult.textContent = memory.value !== 'on'
      ? 'Sample draft skipped.'
      : note ? `Saved in this preview: ${note}` : 'Write a sample draft first.'
  })

  function selectTab(index, focus = false) {
    if (play.disabled) completeDictation()
    for (const audio of panels[active].querySelectorAll('audio')) audio.pause()
    active = index
    tabs.forEach((tab, position) => {
      const selected = position === index
      tab.setAttribute('aria-selected', String(selected))
      tab.tabIndex = selected ? 0 : -1
      panels[position].hidden = !selected
    })
    const panel = panels[index]
    if (panel.dataset.typingPanel) {
      panel.append(keyboardDevice)
      for (const mode of modes) mode.hidden = mode.dataset.mode !== panel.dataset.typingPanel
      syncKeyboard()
    }
    if (focus) tabs[index].focus()
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(index))
    tab.addEventListener('keydown', event => {
      const destinations = {
        ArrowRight: index + 1, ArrowDown: index + 1,
        ArrowLeft: index - 1, ArrowUp: index - 1,
        Home: 0, End: tabs.length - 1,
      }
      if (!(event.key in destinations)) return
      event.preventDefault()
      selectTab((destinations[event.key] + tabs.length) % tabs.length, true)
    })
  })

  function openLinkedTab(hash) {
    const index = tabs.findIndex(tab => `#${tab.id}` === hash)
    if (index >= 0 && index !== active) selectTab(index)
  }
  addEventListener('hashchange', () => openLinkedTab(location.hash))
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#preview-"]')
    if (link && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      openLinkedTab(link.hash)
    }
  })
  openLinkedTab(location.hash)

  for (const theme of themes) {
    theme.addEventListener('click', () => {
      stage.dataset.previewTheme = theme.dataset.previewThemeChoice
      for (const option of themes) option.setAttribute('aria-pressed', String(option === theme))
    })
  }
  borderBtn?.addEventListener('click', () => {
    const on = stage.dataset.previewBorders !== 'true'
    stage.dataset.previewBorders = String(on)
    borderBtn.setAttribute('aria-pressed', String(on))
    compactBtn.hidden = !on
    if (!on) {
      stage.dataset.previewCompact = 'false'
      compactBtn.setAttribute('aria-pressed', 'false')
    }
  })
  compactBtn?.addEventListener('click', () => {
    const on = stage.dataset.previewCompact !== 'true'
    stage.dataset.previewCompact = String(on)
    compactBtn.setAttribute('aria-pressed', String(on))
  })
  for (const btn of layoutBtns) {
    btn.addEventListener('click', () => {
      stage.dataset.previewLayout = btn.dataset.previewLayout
      for (const option of layoutBtns) option.setAttribute('aria-pressed', String(option === btn))
    })
  }

  syncAiModes()
  syncKeyboard()
}
