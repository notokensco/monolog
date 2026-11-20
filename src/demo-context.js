export function initDemoContext(container, { isPrivate, showFront, onOpen, onShortcut }) {
  const find = selector => container.querySelector(selector)
  const key = find('#memory-key')
  const draft = find('#demo-input')
  const panel = find('#demo-context-panel')
  const title = find('#demo-context-title')
  const shortcuts = find('#demo-context-shortcuts')
  const form = find('#demo-context-note')
  const field = find('#demo-note-input')
  const detail = find('#demo-context-detail')
  const toast = find('#demo-memory-cue')
  let note = ''
  let press
  let held = false
  let cueTimer
  let draftTimer
  let lastDetail

  function close() {
    panel.hidden = true
    key.setAttribute('aria-expanded', 'false')
  }

  function show(titleText, view) {
    if (isPrivate()) return
    onOpen()
    find('#demo-panel').hidden = true
    title.textContent = titleText
    shortcuts.hidden = view !== shortcuts
    form.hidden = view !== form
    detail.hidden = view !== detail
    panel.hidden = false
    key.setAttribute('aria-expanded', 'true')
  }

  function showShortcuts(focus = false) {
    show('Quick shortcuts', shortcuts)
    if (focus && !panel.hidden) shortcuts.querySelector('button').focus({ preventScroll: true })
  }

  function showNote() {
    field.value = note
    show('Add a note', form)
    if (!panel.hidden) field.focus({ preventScroll: true })
  }

  function hideCue() {
    clearTimeout(cueTimer)
    toast.hidden = true
    key.classList.remove('context-key-memorised')
  }

  function cue(text = 'Memorised in this demo') {
    if (isPrivate()) return
    hideCue()
    toast.querySelector('span').textContent = text
    toast.hidden = false
    key.classList.add('context-key-memorised')
    cueTimer = setTimeout(hideCue, 1850)
  }

  function cancelDraftCue() {
    clearTimeout(draftTimer)
    hideCue()
  }

  draft.addEventListener('input', () => {
    clearTimeout(draftTimer)
    if (!draft.value.trim()) lastDetail = undefined
    if (isPrivate()) return
    const text = draft.value.toLowerCase()
    const topic = text.match(/\b(exam|appointment|meeting|deadline)\b/)?.[0]
    const time = text.match(/\b(?:1[0-2]|[1-9])(?::[0-5]\d)?\s*(?:am|pm)\b/)?.[0]
    const important = topic && time ? `${topic} ${time}`
      : text.length > 20 && text.match(/\b(important|remember)\b/)?.[0]
    if (important && important !== lastDetail) {
      draftTimer = setTimeout(() => {
        if (isPrivate()) return
        lastDetail = important
        cue()
      }, 680)
    }
  })

  function cancelPress() {
    clearTimeout(press?.timer)
    press = undefined
  }

  function activateShortcuts() {
    key.dispatchEvent(new Event('demo-context-interaction', { bubbles: true }))
    showShortcuts(true)
  }

  key.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return
    key.dispatchEvent(new Event('demo-context-interaction', { bubbles: true }))
    cancelPress()
    held = false
    press = {
      x: event.clientX,
      y: event.clientY,
      timer: setTimeout(() => {
        held = true
        activateShortcuts()
      }, 470),
    }
  })
  key.addEventListener('pointermove', event => {
    if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) cancelPress()
  })
  for (const event of ['pointerup', 'pointercancel', 'pointerleave', 'lostpointercapture']) {
    key.addEventListener(event, cancelPress)
  }
  key.addEventListener('contextmenu', event => {
    event.preventDefault()
    if (event.button === 2 || event.pointerType === 'touch') {
      cancelPress()
      if (!held) activateShortcuts()
      held = true
    }
  })
  key.addEventListener('click', event => {
    if (event.detail === 0) activateShortcuts()
    else if (!held) {
      if (panel.hidden || shortcuts.hidden) showShortcuts()
      else close()
    }
    held = false
  })

  find('#demo-context-close').addEventListener('click', () => {
    close()
    key.focus({ preventScroll: true })
  })
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      close()
      key.focus({ preventScroll: true })
    }
  })
  function openShortcut(action) {
    if (!action || isPrivate()) return
    if (action === 'Shortcuts') {
      showShortcuts(true)
      return
    }
    if (action === 'Note') {
      showNote()
      return
    }
    detail.textContent = onShortcut(action)
    show(`${action} preview`, detail)
    find('#demo-context-close').focus({ preventScroll: true })
  }

  shortcuts.addEventListener('click', event => {
    const action = event.target.closest('[data-context-action]')?.dataset.contextAction
    if (action === 'Journal') {
      key.dispatchEvent(new Event('demo-context-interaction', { bubbles: true }))
      close()
      return
    }
    openShortcut(action)
  })
  document.querySelectorAll('[data-open-demo-context]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      key.dispatchEvent(new Event('demo-context-interaction', { bubbles: true }))
      showFront()
      openShortcut(link.dataset.openDemoContext)
    })
  })
  form.addEventListener('submit', event => {
    event.preventDefault()
    if (isPrivate() || !field.value.trim()) return
    note = field.value.trim()
    close()
    cue('Note saved in this demo')
    key.focus({ preventScroll: true })
  })

  return { showShortcuts, close, cue, cancelDraftCue, noteTarget: () => !panel.hidden && !form.hidden ? field : null }
}
