const sampleItems = [
  { type: 'Photo', title: 'Riverside Art Walk', detail: 'A photo from the Saturday art walk by the river.', date: '14 Nov' },
  { type: 'Photo', title: 'Coffee with Sam', detail: 'Saved from the afternoon coffee break.', date: '15 Nov' },
  { type: 'Screenshot', title: 'Weekend getaway', detail: 'HND → ITM · 24 May · Hotel Namba · Check-in at 3:00 PM.', date: '13 Nov' },
  { type: 'Voice', title: 'On the way home', detail: 'I took the long way home. Glad I did.', date: '14 Nov' },
  { type: 'Note', title: 'Library study plans', detail: 'Meet at the library at four. Bring the notes.', date: '15 Nov' },
]

const icons = { Photo: 'image', Screenshot: 'copy', Voice: 'mic', Note: 'journal' }

function make(tag, className, text) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text) element.textContent = text
  return element
}

function initLibrary(root) {
  const title = root.querySelector('.journal-device-title h3')
  const add = root.querySelector('[data-library-action="add"]')
  const tools = root.querySelector('.context-device-tools')
  const search = root.querySelector('input[type="search"]')
  const filters = [...root.querySelectorAll('[data-library-filter]')]
  const content = root.querySelector('.context-device-content')
  const items = [...sampleItems]
  let filter = 'All'

  function thumb(item) {
    const tile = make('span', 'context-item-thumb')
    tile.dataset.type = item.type
    tile.setAttribute('aria-hidden', 'true')
    if (item.type === 'Screenshot') {
      tile.append(make('span', 'context-ticket', 'HND → ITM'))
    } else if (item.type === 'Voice') {
      const wave = make('span', 'context-item-wave')
      for (const height of [9, 18, 12, 22, 31, 17, 25, 12, 20, 8]) {
        const bar = make('i')
        bar.style.height = `${height}px`
        wave.append(bar)
      }
      tile.append(wave)
    } else {
      tile.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-${icons[item.type]}"/></svg>`
    }
    return tile
  }

  function clear(heading, browsing = false) {
    content.querySelector('audio')?.pause()
    content.replaceChildren()
    content.scrollTop = 0
    title.textContent = heading
    tools.hidden = !browsing
    add.hidden = !browsing
  }

  function backButton() {
    const button = make('button', 'journal-device-action context-device-back', '‹ Back to Library')
    button.type = 'button'
    button.addEventListener('click', () => {
      showList()
      content.focus({ preventScroll: true })
    })
    return button
  }

  function showList() {
    clear('Context Library', true)
    const query = search.value.trim().toLowerCase()
    const matches = items.filter(item =>
      (filter === 'All' || item.type === filter)
      && `${item.title} ${item.detail}`.toLowerCase().includes(query)
    )
    if (!matches.length) {
      content.append(make('p', 'journal-device-empty', 'No saved items match this view.'))
      return
    }

    const grid = make('div', 'context-items')
    for (const item of matches) {
      const button = make('button', 'context-item')
      button.type = 'button'
      button.append(thumb(item), make('span', 'context-item-title', item.title), make('span', 'journal-device-meta', item.type))
      button.addEventListener('click', () => showDetail(item))
      grid.append(button)
    }
    content.append(grid)
  }

  function showDetail(item) {
    clear('Saved item')
    const detail = make('article', 'journal-device-card context-item-detail')
    const label = { Screenshot: 'Text in this screenshot', Voice: 'Transcript' }[item.type]
    detail.append(thumb(item), make('p', 'journal-device-meta', `${item.type} · ${item.date}`), make('h4', '', item.title))
    if (item.type === 'Voice') {
      const audio = make('audio')
      audio.controls = true
      audio.preload = 'none'
      audio.src = '/audio/context-voice-demo.wav'
      audio.setAttribute('aria-label', 'Play sample voice note')
      detail.append(audio)
    }
    if (label) detail.append(make('strong', 'context-source-label', label))
    detail.append(make('p', '', item.detail))
    content.append(backButton(), detail)
    content.focus({ preventScroll: true })
  }

  add.addEventListener('click', () => {
    clear('New note')
    const form = make('form', 'journal-device-note')
    const label = make('label', '', 'Your library note')
    const field = make('textarea')
    field.required = true
    field.maxLength = 300
    field.placeholder = 'What would you like to keep?'
    label.append(field)
    const save = make('button', 'journal-device-action', 'Save note')
    save.type = 'submit'
    form.append(label, save)
    form.addEventListener('submit', event => {
      event.preventDefault()
      const detail = field.value.trim()
      if (!detail) return
      const item = { type: 'Note', title: 'Your note', detail, date: 'Just now' }
      items.unshift(item)
      showDetail(item)
    })
    content.append(backButton(), form)
    field.focus({ preventScroll: true })
  })

  for (const button of filters) {
    button.addEventListener('click', () => {
      filter = button.dataset.libraryFilter
      for (const choice of filters) choice.setAttribute('aria-pressed', String(choice === button))
      showList()
    })
  }
  search.addEventListener('input', showList)
  showList()
}

export function initContextLibrary() {
  const template = document.querySelector('#context-library-template')
  for (const host of document.querySelectorAll('[data-context-library-demo]')) {
    const library = template.content.firstElementChild.cloneNode(true)
    host.append(library)
    initLibrary(library)
  }
}
