const sampleDays = [
  {
    date: '2026-11-15', title: 'A focused day',
    summary: 'Study plans, coffee with Sam, and an evening reminder.',
    sources: [
      ['Note', 'Library study plans', 'Meet at the library at four. Bring the notes.'],
      ['Photo', 'Coffee with Sam', 'A photo saved from the afternoon coffee break.'],
      ['Reminder', 'Call Amma', '6:00 PM'],
    ],
  },
  {
    date: '2026-11-14', title: 'Small moments, kept',
    summary: 'An art walk, a voice note, and time to slow down.',
    sources: [
      ['Photo', 'Riverside art walk', 'A photo saved during the Saturday art walk.'],
      ['Voice', 'On the way home', 'I took the long way home. Glad I did.'],
    ],
  },
  {
    date: '2026-11-13', title: 'A little progress',
    summary: 'A finished outline and a short walk after class.',
    sources: [['Note', 'Project outline', 'The first outline is ready to share.']],
  },
  {
    date: '2026-10-28', title: 'Making room',
    summary: 'An evening set aside to write and reset.',
    sources: [['Note', 'Evening reflection', 'Write down what went well this week.']],
  },
]

const sampleToday = sampleDays[0].date
const dayFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', weekday: 'short', timeZone: 'UTC' })
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })

function element(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

function action(label, name, value) {
  const button = element('button', 'journal-device-action', label)
  button.type = 'button'
  button.dataset.journalAction = name
  if (value) button.dataset.value = value
  return button
}

function dateLabel(date) {
  return date === sampleToday ? '15 Nov · Today' : dayFormat.format(new Date(date))
}

function searchable(day) {
  return [day.title, day.summary, day.date, dateLabel(day.date), ...day.sources.flat()].join(' ').toLowerCase()
}

function initPreview(root) {
  const days = sampleDays.map(day => ({ ...day, sources: [...day.sources] }))
  const content = root.querySelector('.journal-device-content')
  const title = root.querySelector('.journal-device-title h3')
  const controls = root.querySelector('.journal-device-controls')
  const monthLabel = root.querySelector('[data-journal-month]')
  const views = [...root.querySelectorAll('[data-journal-view]')]
  const nav = [...root.querySelectorAll('[data-journal-page]')]
  const searchToggle = root.querySelector('[data-journal-action="search"]')
  const searchPanel = root.querySelector('.journal-device-search')
  const search = searchPanel.querySelector('input')
  const ask = root.querySelector('.journal-device-ask')
  let page = 'Journal'
  let view = 'Timeline'
  let month = new Date('2026-11-01')
  let searchOpen = false
  let detail = null

  function card(label, heading, description) {
    const node = element('article', 'journal-device-card')
    node.append(element('p', 'journal-device-meta', label), element('h4', '', heading), element('p', '', description))
    return node
  }

  function dayCard(day) {
    const node = card(dateLabel(day.date), day.title, day.summary)
    const tags = element('div', 'journal-device-tags')
    for (const kind of new Set(day.sources.map(([type]) => type))) {
      tags.append(element('span', '', kind))
    }
    node.append(tags, action('View day →', 'day', day.date))
    return node
  }

  function sourceCards(items, photoOnly = false) {
    const list = element('div', photoOnly ? 'journal-device-gallery' : 'journal-device-list')
    for (const day of items) {
      for (const [type, label, description] of day.sources) {
        if (photoOnly && type !== 'Photo') continue
        const node = card(type, label, photoOnly ? dateLabel(day.date) : description)
        node.append(action('View day →', 'day', day.date))
        list.append(node)
      }
    }
    return list.childElementCount ? list : empty('No saved items match this view.')
  }

  function empty(message) {
    return element('p', 'journal-device-empty', message)
  }

  function calendar(items) {
    const grid = element('div', 'journal-device-calendar')
    for (const name of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      grid.append(element('span', 'journal-device-meta', name))
    }
    const year = month.getUTCFullYear()
    const index = month.getUTCMonth()
    const offset = (month.getUTCDay() + 6) % 7
    const total = new Date(Date.UTC(year, index + 1, 0)).getUTCDate()
    for (let slot = 0; slot < offset; slot++) grid.append(element('span'))
    for (let day = 1; day <= total; day++) {
      const date = new Date(Date.UTC(year, index, day)).toISOString().slice(0, 10)
      const entry = items.find(item => item.date === date)
      if (!entry) {
        grid.append(element('span', '', String(day)))
        continue
      }
      const button = action(String(day), 'day', date)
      button.setAttribute('aria-label', `Open ${dateLabel(date)} — ${entry.title}`)
      grid.append(button)
    }
    return grid
  }

  function renderJournal() {
    const query = search.value.trim().toLowerCase()
    const prefix = month.toISOString().slice(0, 7)
    const items = days.filter(day => day.date.startsWith(prefix) && searchable(day).includes(query))
    if (view === 'Calendar') content.append(calendar(items))
    else if (view === 'Gallery') content.append(sourceCards(items, true))
    else if (items.length) {
      const timeline = element('div', 'journal-device-timeline')
      timeline.append(...items.map(dayCard))
      content.append(timeline)
    } else content.append(empty('No entries match this month.'))
  }

  function renderDetail() {
    content.append(action('‹ Back', 'back'))
    if (detail.kind === 'day') {
      const day = days.find(item => item.date === detail.date)
      content.append(card(dateLabel(day.date), day.title, day.summary))
      for (const [type, label, description] of day.sources) {
        content.append(card(type, label, description))
      }
      return
    }
    if (detail.kind === 'note') {
      const form = element('form', 'journal-device-note')
      const label = element('label', '', 'Your note')
      const field = element('textarea')
      field.name = 'note'
      field.maxLength = 300
      field.required = true
      field.placeholder = 'What would you like to keep?'
      const save = element('button', 'journal-device-action', 'Save note')
      save.type = 'submit'
      label.append(field)
      form.append(element('p', 'journal-device-meta', dateLabel(sampleToday)), label, save)
      content.append(form)
      return
    }

    const terms = detail.question.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter(term => term.length > 2) ?? []
    const matches = days
      .map(day => ({ day, score: terms.filter(term => searchable(day).includes(term)).length }))
      .filter(result => result.score)
      .sort((first, second) => second.score - first.score)
    content.append(element('p', 'journal-device-meta', `Matches for “${detail.question}”`))
    content.append(...(matches.length ? matches.map(({ day }) => dayCard(day)) : [empty('No sample entries match this question.')]))
  }

  function render(focusContent = false) {
    const journal = page === 'Journal' && !detail
    controls.hidden = !journal
    searchToggle.hidden = !journal
    searchPanel.hidden = !journal || !searchOpen
    searchToggle.setAttribute('aria-pressed', String(searchOpen))
    title.textContent = detail ? { day: 'Day view', note: 'New note', answers: 'Your days' }[detail.kind] : page
    monthLabel.textContent = monthFormat.format(month)
    for (const button of views) button.setAttribute('aria-pressed', String(button.dataset.journalView === view))
    for (const button of nav) button.setAttribute('aria-pressed', String(button.dataset.journalPage === page))
    content.replaceChildren()

    if (detail) renderDetail()
    else if (journal) renderJournal()
    else if (page === 'Library') content.append(sourceCards(days))
    else {
      const today = card('24° · Partly cloudy', 'Your day, remembered.', 'A sample view of your journal and reminders.')
      today.append(action('Continue writing', 'note'))
      content.append(today, card('Reminder', 'Call Amma', '6:00 PM today'), dayCard(days[0]))
    }

    content.scrollTop = 0
    if (focusContent) (content.querySelector('textarea') ?? content).focus({ preventScroll: true })
  }

  root.addEventListener('click', event => {
    const button = event.target.closest('button')
    if (!button) return
    const { journalView, journalPage, journalAction, value } = button.dataset
    if (journalView) view = journalView
    else if (journalPage) {
      page = journalPage
      detail = null
    } else if (journalAction === 'search') {
      searchOpen = !searchOpen
      if (!searchOpen) search.value = ''
    } else if (journalAction === 'previous' || journalAction === 'next') {
      const offset = journalAction === 'previous' ? -1 : 1
      month = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + offset, 1))
    } else if (journalAction === 'day') detail = { kind: 'day', date: value }
    else if (journalAction === 'note') detail = { kind: 'note' }
    else if (journalAction === 'back') detail = null
    else return

    render(['day', 'note', 'back'].includes(journalAction))
    if (journalAction === 'search' && searchOpen) search.focus({ preventScroll: true })
  })

  search.addEventListener('input', () => render())
  root.addEventListener('submit', event => {
    event.preventDefault()
    const data = new FormData(event.target)
    if (event.target === ask) {
      const question = data.get('question').trim()
      if (!question) return
      detail = { kind: 'answers', question }
    } else {
      const note = data.get('note').trim()
      if (!note) return
      days[0].sources.push(['Note', 'Your note', note])
      detail = { kind: 'day', date: sampleToday }
    }
    render(true)
  })

  render()
}

export function initJournalPhones() {
  const template = document.querySelector('#journal-demo-template')
  for (const root of document.querySelectorAll('[data-journal-demo]')) {
    root.append(template.content.cloneNode(true))
    initPreview(root)
  }
}
