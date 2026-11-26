export function initDemoPlayback(container, {
  followDemo, setDemoPose, context, setUpcoming, setPrivacy, startVoxMode, stopVoxMode, closeTools, refreshSuggestion,
}) {
  const find = selector => container.querySelector(selector)
  const stage = find('.demo-phone-stage')
  const front = find('#demo-phone-front')
  const toggle = find('#demo-autoplay')
  const input = find('#demo-input')
  const draftLabel = find('.demo-header .mono')
  const messages = find('#demo-chat-messages')
  const app = find('#demo-app-content')
  const avatar = find('.chat-avatar')
  const title = find('#demo-chat-person')
  const caption = find('#demo-chat-caption')
  const panel = find('#demo-panel')
  const panelTitle = find('#demo-panel-title')
  const panelBody = find('#demo-panel-body')
  const expand = find('#demo-panel-expand')
  const suggestion = find('#keyboard-suggestion')
  const transcript = find('#vox-transcript')
  const voxStatus = find('#vox-status')
  const voxSubtitle = find('.vox-subtitle')
  const feedback = find('#demo-feedback')
  const emoji = find('#emoji-key')
  const emojiTray = find('#emoji-tray')
  const initialMessages = [...messages.children]
  const normalPlaceholder = input.placeholder
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const originalVoxSubtitle = voxSubtitle.textContent
  let enabled = !motion.matches
  let visible = false
  let sequence
  let timer
  let delay = 1800
  let draft
  let highlighted
  let messageMinute = 42

  function highlight(key) {
    highlighted?.classList.remove('demo-action-pressed')
    highlighted = key
    highlighted?.classList.add('demo-action-pressed')
  }

  function closePanel() {
    panel.hidden = true
    panel.classList.remove('is-expanded')
    expand.setAttribute('aria-pressed', 'false')
  }

  function resetChat() {
    avatar.textContent = 'S'
    title.textContent = 'Sam'
    caption.textContent = 'Your messages · Demo'
    draftLabel.textContent = 'Your draft'
    input.placeholder = normalPlaceholder
    app.hidden = true
    app.replaceChildren()
    messages.hidden = false
    messages.replaceChildren(...initialMessages)
    messages.scrollTop = 0
  }

  function resetScreen() {
    resetChat()
    closePanel()
    closeTools()
    context.close()
    context.cancelDraftCue()
    highlight()
    stopVoxMode()
    setPrivacy('off')
    voxStatus.textContent = 'Listening…'
    voxSubtitle.textContent = originalVoxSubtitle
    feedback.hidden = true
    emojiTray.hidden = true
    emoji.setAttribute('aria-expanded', 'false')
  }

  function addOwnMessage(text) {
    const bubble = document.createElement('p')
    bubble.className = 'chat-bubble chat-bubble-user'
    bubble.textContent = text
    const time = document.createElement('small')
    time.className = 'chat-message-time'
    time.textContent = `9:${messageMinute++}`
    bubble.append(time)
    messages.append(bubble)
    messages.scrollTop = messages.scrollHeight
  }

  // Panel and app markup below comes from the fixed local script.
  function card(name, content) {
    panelTitle.textContent = name
    panelBody.innerHTML = content
    panel.hidden = false
  }

  function openApp(name, detail, mark, content) {
    closePanel()
    avatar.textContent = mark
    title.textContent = name
    caption.textContent = detail
    messages.hidden = true
    app.innerHTML = content
    app.hidden = false
  }

  function* type(text, field = input, value = '') {
    for (const character of text) {
      value += character
      if (field === input) {
        field.value = value
        refreshSuggestion()
        const key = character === ' ' ? find('#space-key')
          : find(`[data-letter="${CSS.escape(character.toLowerCase())}"]`)
        highlight(motion.matches ? null : key)
      } else {
        field.textContent = value
      }
      if (!motion.matches) yield character === ' ' ? 80 : 31
    }
    highlight()
  }

  function send() {
    addOwnMessage(input.value)
    input.value = ''
    refreshSuggestion()
  }

  function* playback() {
    while (true) {
      resetScreen()
      messageMinute = 42
      setUpcoming()
      setDemoPose('typing')
      input.value = ''
      yield* type('lets meet at library')
      card('Rewrite suggestion', '<h5>Make it clearer</h5><p>Let’s meet at the library.</p>')
      yield* type(' around four', input, input.value)
      card('Rewrite suggestion', '<h5>Make it clearer</h5><p>Let’s meet at the library around four.</p>')
      yield 1900
      highlight(suggestion)
      yield 200
      input.value = 'Let’s meet at the library around four.'
      highlight()
      refreshSuggestion()
      closePanel()
      yield 700
      highlight()
      send()
      yield 1300
      yield* type('Exam at 5 PM today')
      context.cue()
      setDemoPose('action')
      highlight(suggestion)
      yield 800
      card('Reminder set', '<h5>Exam</h5><p>Today at 5:00 PM</p><span class="source-tag">Demo reminder</span>')
      setUpcoming({ label: 'Exam', time: '5:00 PM' })
      yield 1800
      highlight()
      input.value = ''
      refreshSuggestion()
      closePanel()
      yield 1150
      setDemoPose('typing')
      yield* type('Alarm at 7 AM tomorrow')
      setDemoPose('action')
      highlight(find('#memory-key'))
      context.showShortcuts()
      yield 1200
      highlight()
      context.close()
      card('New alarm', '<h5 class="demo-alarm-time">7:00 AM</h5><p>Tomorrow · Set alarm</p>')
      yield 1100
      card('Alarm set', '<h5>7:00 AM</h5><p>Tomorrow · One time</p><span class="source-tag">Demo alarm</span>')
      setUpcoming({ label: 'Alarm', time: '7:00 AM' })
      yield 1900
      closePanel()
      input.value = ''
      refreshSuggestion()
      yield 850
      setDemoPose('typing')
      yield* type('When does the Riverside Library study room close?')
      highlight(suggestion)
      yield 1050
      card('AI Ask', '<h5>Web search</h5><p>When does the Riverside Library study room close?</p><span class="source-tag">Searching demo sources…</span>')
      yield 1750
      highlight()
      setDemoPose('reading')
      card('AI Ask', '<h5>The study room closes at 8 PM.</h5><p>Last entry is at 7:30 PM.</p><span class="source-tag">1 · Riverside Library hours (sample)</span>')
      yield 2400
      closePanel()
      input.value = 'It closes at 8 PM. Last entry is at 7:30.'
      refreshSuggestion()
      yield 800
      send()
      yield 1000

      openApp('Pine Bank', 'Demo browser', 'P',
        '<div class="demo-bank-address">Secure sign-in · pine-bank.example</div><h4>Welcome back</h4><p>Protected field · memory paused automatically</p>')
      setPrivacy('protected')
      setDemoPose('private')
      input.value = ''
      draftLabel.textContent = 'Password'
      input.placeholder = 'Demo password'
      yield 900
      yield* type('••••••')
      yield 2450

      resetChat()
      input.value = ''
      openApp('Private note', 'Demo notes', 'N',
        '<span class="demo-app-kicker">Personal draft</span><h4>Just for me</h4><p>Manual incognito · 15 minutes</p>')
      setPrivacy('manual')
      highlight(find('#keyboard-incognito'))
      yield 850
      yield* type('Keep this just between us.')
      yield 1800

      resetScreen()
      input.value = ''
      refreshSuggestion()
      setDemoPose('vox')
      yield 1000
      highlight(find('#keyboard-mic'))
      yield 400
      highlight()
      startVoxMode('')
      yield 550
      yield* type('Umm, I’ll, uhh, take the bus and be there by four', transcript)
      yield 1000
      transcript.textContent = 'I’ll take the bus and be there by four.'
      find('.keyboard-surface').dataset.vox = 'refined'
      voxStatus.textContent = 'Transcript ready'
      voxSubtitle.textContent = 'Filler words removed · Punctuation added'
      yield 2100
      stopVoxMode(true)
      yield 900
      send()
      yield 1100
      highlight(find('#memory-key'))
      card('Context capture', '<h5>Study plans</h5><p>Saved your own bus and library note to the preview Context Library.</p>')
      yield 1800
      highlight()
      card('Journal preview', '<h5>Today’s study plans</h5><p>Based on your saved notes and reminder for the 5 PM exam.</p><span class="source-tag">Sample daily memory</span>')
      yield 2400
      card('Monthly recap', '<h5>Small plans, kept</h5><p>Your saved plans for studying at the library and taking the bus.</p><span class="source-tag">Sample recap · Review before export</span>')
      yield 2500
    }
  }

  function syncPlayback() {
    const action = enabled ? 'Pause demo' : 'Play demo'
    if (toggle.textContent !== action) toggle.textContent = action
    const shouldPlay = enabled && visible && !document.hidden && stage.dataset.phoneSide === 'front'
    if (!shouldPlay) {
      clearTimeout(timer)
      timer = undefined
    } else if (timer === undefined) {
      timer = setTimeout(advance, delay)
    }
  }

  function advance() {
    timer = undefined
    if (!sequence) {
      draft = { text: input.value, start: input.selectionStart, end: input.selectionEnd }
      sequence = playback()
    }
    delay = sequence.next().value
    syncPlayback()
  }

  function takeOver() {
    if (sequence) {
      resetScreen()
      input.value = draft.text
      input.setSelectionRange(draft.start, draft.end)
      refreshSuggestion()
      sequence = undefined
      delay = 1800
    }
    enabled = false
    syncPlayback()
  }

  front.addEventListener('click', event => {
    const button = event.target.closest('button')
    if (button?.id === 'vox-pause' && sequence) {
      enabled = voxStatus.textContent === 'Paused'
      syncPlayback()
    } else if (button) {
      takeOver()
    }
  }, { capture: true })
  front.addEventListener('demo-context-interaction', takeOver)
  input.addEventListener('focus', takeOver)
  input.addEventListener('beforeinput', takeOver)
  toggle.addEventListener('click', () => {
    enabled = !enabled
    if (enabled) followDemo()
    syncPlayback()
  })
  new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= .35
    syncPlayback()
  }, { threshold: .35 }).observe(stage)
  new MutationObserver(syncPlayback).observe(stage, { attributes: true, attributeFilter: ['data-phone-side'] })
  document.addEventListener('visibilitychange', syncPlayback)
  syncPlayback()
}
