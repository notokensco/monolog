const sampleDictation = 'I’ll take the bus and be there by four.'

const sampleAnswers = [
  { match: /\b(study room|library|close|hours)\b/i, answer: 'The study room closes at 8:00 PM. Last entry is at 7:30 PM.', source: 'Riverside Library hours' },
  { match: /\b(coffee|sam)\b/i, answer: 'Coffee with Sam is in the sample journal entry for 15 November.', source: 'Sample journal · 15 November' },
  { match: /\b(hotel|check.in|namba)\b/i, answer: 'Check-in at Hotel Namba is at 3:00 PM.', source: 'Weekend getaway screenshot' },
]

function buildKeyboard(keyboard) {
  const layout = [
    [...'qwertyuiop'],
    [...'asdfghjkl'],
    [...'zxcvbnm'],
    ['.', 'space', 'delete'],
  ]
  for (const keys of layout) {
    const row = document.createElement('div')
    row.className = 'showcase-key-row'
    if (keys.includes('space')) row.classList.add('showcase-key-row-actions')
    for (const key of keys) {
      const button = document.createElement('button')
      button.type = 'button'
      button.dataset.key = key
      button.textContent = key === 'delete' ? '⌫' : key
      button.setAttribute('aria-label', { delete: 'Backspace', space: 'Space', '.': 'Period' }[key] || `Type ${key}`)
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
  let active = 0

  buildKeyboard(keyboard)
  function insertDraft(text, start = draft.selectionStart, end = draft.selectionEnd) {
    const available = draft.maxLength - (draft.value.length - (end - start))
    draft.setRangeText(text.slice(0, available), start, end, 'end')
  }

  keyboard.addEventListener('click', event => {
    const key = event.target.closest('[data-key]')?.dataset.key
    if (!key) return
    if (key === 'delete') {
      const { selectionStart, selectionEnd } = draft
      const lastCharacter = Array.from(draft.value.slice(0, selectionStart)).at(-1)
      const start = selectionStart === selectionEnd ? selectionStart - (lastCharacter?.length || 0) : selectionStart
      insertDraft('', start, selectionEnd)
      return
    }
    insertDraft(key === 'space' ? ' ' : key)
  })

  keyboardDevice.querySelector('[data-draft-clear]').addEventListener('click', () => { draft.value = '' })

  const thread = keyboardDevice.querySelector('.showcase-thread')
  keyboardDevice.querySelector('[data-draft-send]').addEventListener('click', () => {
    const text = draft.value.trim()
    if (!text) return
    const message = document.createElement('p')
    message.className = 'showcase-bubble showcase-bubble-sent'
    message.textContent = text
    thread.append(message)
    draft.value = ''
    const chat = thread.parentElement
    chat.scrollTop += Math.max(0, message.getBoundingClientRect().bottom - chat.getBoundingClientRect().bottom)
  })

  const voxStatus = keyboardDevice.querySelector('[data-vox-status]')
  const wave = keyboardDevice.querySelector('.showcase-wave')
  const transcript = keyboardDevice.querySelector('[data-vox-transcript]')
  const play = keyboardDevice.querySelector('[data-vox-play]')
  const insertTranscript = keyboardDevice.querySelector('[data-vox-insert]')
  let dictationTimer
  for (const [index, height] of [7, 11, 17, 9, 23, 16, 26, 12, 21, 15, 8, 19, 11, 6, 13, 8].entries()) {
    const bar = document.createElement('i')
    bar.style.setProperty('--bar-height', `${height}px`)
    bar.style.setProperty('--bar-delay', `${index * -65}ms`)
    wave.append(bar)
  }

  function completeDictation() {
    clearInterval(dictationTimer)
    transcript.textContent = sampleDictation
    voxStatus.textContent = 'Transcript ready'
    wave.removeAttribute('data-playing')
    insertTranscript.disabled = false
    play.disabled = false
  }

  play.addEventListener('click', () => {
    if (reducedMotion.matches) {
      completeDictation()
      return
    }
    const words = sampleDictation.split(' ')
    let count = 0
    voxStatus.textContent = 'Playing sample…'
    transcript.textContent = ''
    wave.setAttribute('data-playing', '')
    play.disabled = true
    insertTranscript.disabled = true
    dictationTimer = setInterval(() => {
      transcript.textContent = words.slice(0, ++count).join(' ')
      if (count === words.length) completeDictation()
    }, 170)
  })
  insertTranscript.addEventListener('click', () => insertDraft(sampleDictation))

  const ai = keyboardDevice.querySelector('[data-mode="ai"]')
  const answer = ai.querySelector('[data-ai-answer]')
  const source = ai.querySelector('[data-ai-source]')
  const insertAnswer = ai.querySelector('[data-ai-insert]')
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

  const memory = keyboardDevice.querySelector('[data-memory-state]')
  const memoryStatus = keyboardDevice.querySelector('[data-memory-status]')
  const memoryResult = keyboardDevice.querySelector('[data-memory-result]')
  const states = {
    on: 'Sample drafts can be saved.',
    incognito: 'Memory paused while incognito is on.',
    protected: 'Memory paused for this protected field.',
  }
  memory.addEventListener('change', () => {
    memoryStatus.textContent = states[memory.value]
    memoryResult.textContent = ''
  })
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
}
