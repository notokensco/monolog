
export function initMonologWeb(reducedMotion) {
  const root = document.querySelector('.web-workspace')
  if (!root) return
  const content = root.querySelector('[data-web-content]')
  const navigation = [...root.querySelectorAll('[data-web-page]')]
  const notes = [
    { title: 'Quiet morning desk notes', body: 'Pick up the library hold and bring a notebook to meet Sam.', kind: 'Notes', date: '26 November', image: '/images/today-dashboard-mockup.jpg' },
    { title: 'Riverside art walk', body: 'A coffee stop with Sam after the walk.', kind: 'Photos', date: '25 November', image: '/images/journal-timeline-mockup.jpg' },
    { title: 'A thought on the way home', body: 'Make time for the small things this week.', kind: 'Audio Notes', date: '24 November', image: '' },
  ]
  const reminders = ['Take an evening walk']
  let page = 'today'
  let view = 'Timeline'
  let filter = 'All'
  let draft = ''
  let query = ''

  function node(tag, className, text) {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (text) element.textContent = text
    return element
  }

  function button(text, action, value, className = 'web-action') {
    const element = node('button', className, text)
    element.type = 'button'
    element.dataset.webAction = action
    if (value !== undefined) element.dataset.value = value
    return element
  }

  function card(title, text) {
    const element = node('article', 'web-card web-entry')
    element.append(node('h4', '', title))
    if (text) element.append(node('p', '', text))
    return element
  }

  function search(placeholder) {
    const input = node('input', 'web-preview-search')
    input.type = 'search'
    input.placeholder = placeholder
    input.setAttribute('aria-label', placeholder)
    input.value = query
    input.addEventListener('input', () => {
      query = input.value
      renderResults()
    })
    content.append(input)
  }

  function toolbar(items, action, selected) {
    const group = node('div', 'web-toolbar')
    for (const item of items) {
      const option = button(item, action, item, '')
      option.setAttribute('aria-pressed', String(item === selected))
      group.append(option)
    }
    content.append(group)
  }

  function renderResults() {
    const results = content.querySelector('[data-web-results]')
    if (!results) return
    results.replaceChildren()
    const matches = notes.filter(note =>
      (filter === 'All' || note.kind === filter) &&
      (note.title + ' ' + note.body).toLowerCase().includes(query.toLowerCase())
    )
    if (!matches.length) {
      results.append(node('p', '', 'No sample notes match this search.'))
      return
    }
    if (page === 'journal' && view === 'Calendar') {
      const calendar = node('div', 'web-calendar')
      for (let day = 1; day <= 30; day++) {
        calendar.append(button(String(day), 'day', String(day), ''))
      }
      results.append(calendar)
      return
    }
    const gallery = page === 'library' || view === 'Gallery'
    results.className = gallery ? 'web-library-grid' : ''
    for (const note of matches) {
      const item = card(note.title, note.body)
      if (gallery && note.image) {
        const image = node('img')
        image.src = note.image
        image.alt = note.title
        item.prepend(image)
      }
      item.prepend(node('small', '', note.date + ' · ' + note.kind))
      item.append(button('Open note', 'open', String(notes.indexOf(note)), 'web-link'))
      results.append(item)
    }
  }

  function results() {
    const element = node('div')
    element.dataset.webResults = ''
    content.append(element)
    renderResults()
  }

  function render() {
    content.replaceChildren()
    navigation.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.webPage === page)))
    if (page === 'today') {
      const hero = node('header', 'web-hero')
      hero.append(node('h3', '', 'Good evening'), node('p', '', 'Your side of the day.'))
      content.append(hero)
      search('Search notes and captures…')
      const layout = node('div', 'web-today-layout')
      const journal = card('Today’s journal', 'A little space for today’s thoughts.')
      const field = node('textarea')
      field.value = draft
      field.placeholder = 'Write down today’s thoughts, progress, or reminders…'
      field.setAttribute('aria-label', 'Today’s preview draft')
      field.addEventListener('input', () => { draft = field.value })
      journal.append(field, button('Save as journal note', 'save-draft'))
      const tiles = node('div', 'web-tiles')
      for (const [title, text, destination] of [
        ['Reminders', reminders[0] || 'Nothing coming up', 'reminders'],
        ['Recent memory', notes[0].title, 'journal'],
        ['Context library', 'Notes, photos, and saved moments', 'library'],
      ]) {
        const tile = card(title, text)
        tile.append(button('View ' + title.toLowerCase(), 'navigate', destination, 'web-link'))
        tiles.append(tile)
      }
      layout.append(journal, tiles)
      content.append(layout, node('h4', '', 'Today’s entries & moments'))
      results()
    } else if (page === 'journal') {
      content.append(node('h3', '', 'Journal'))
      toolbar(['Timeline', 'Calendar', 'Gallery'], 'view', view)
      search('Search journal…')
      results()
    } else if (page === 'library') {
      content.append(node('h3', '', 'Context Library'), node('p', '', 'Notes, photos, and moments you’ve saved.'))
      search('Search the library…')
      toolbar(['All', 'Photos', 'Notes', 'Audio Notes'], 'filter', filter)
      results()
    } else {
      content.append(node('h3', '', 'Reminders'), button('+ Add reminder', 'reminder'))
      reminders.forEach((text, index) => {
        const item = card(text, 'Tomorrow · 6:30 PM')
        item.append(button('Done', 'done', String(index)))
        content.append(item)
      })
      if (!reminders.length) content.append(node('p', '', 'All caught up. Add a reminder when you need one.'))
    }
    const status = node('p', 'web-preview-notice')
    status.setAttribute('role', 'status')
    content.append(status)
  }

  function navigate(destination) {
    page = destination
    query = ''
    filter = 'All'
    render()
    content.scrollTop = 0
  }

  function editor(reminder = false, note = null) {
    const form = node('form', 'web-note-form web-card')
    form.append(node('h3', '', reminder ? 'New reminder' : note ? note.title : 'New note'))
    const label = node('label', '', reminder ? 'Reminder' : 'Title')
    const title = node('input')
    title.required = true
    title.maxLength = 100
    title.value = note?.title || ''
    label.append(title)
    form.append(label)
    const bodyLabel = node('label', '', 'Your note')
    const body = node('textarea')
    body.value = note?.body || ''
    body.maxLength = 2000
    bodyLabel.append(body)
    if (!reminder) form.append(bodyLabel)
    const save = button('Save', 'submit')
    save.type = 'submit'
    form.append(save, button('Cancel', 'cancel'))
    form.addEventListener('submit', event => {
      event.preventDefault()
      if (!title.value.trim()) return
      if (reminder) reminders.push(title.value.trim())
      else if (note) Object.assign(note, { title: title.value.trim(), body: body.value })
      else notes.unshift({ title: title.value.trim(), body: body.value, kind: 'Notes', date: '26 November', image: '' })
      render()
      content.querySelector('[role="status"]').textContent = 'Saved in this preview.'
    })
    content.replaceChildren(form)
    title.focus({ preventScroll: true })
  }

  root.addEventListener('click', event => {
    const target = event.target.closest('button')
    if (!target) return
    if (target.dataset.webPage) { navigate(target.dataset.webPage); return }
    const { webAction: action, value } = target.dataset
    if (action === 'navigate') navigate(value)
    if (action === 'view') { view = value; render() }
    if (action === 'filter') { filter = value; render() }
    if (action === 'new') editor()
    if (action === 'reminder') editor(true)
    if (action === 'open') editor(false, notes[Number(value)])
    if (action === 'cancel') render()
    if (action === 'done') { reminders.splice(Number(value), 1); render() }
    if (action === 'day') {
      view = 'Timeline'
      render()
      content.querySelector('[role="status"]').textContent = 'Showing sample journal entries for November.'
    }
    if (action === 'save-draft') {
      if (!draft.trim()) {
        content.querySelector('[role="status"]').textContent = 'Write a thought before saving.'
        return
      }
      notes.unshift({ title: 'Today’s note', body: draft.trim(), kind: 'Notes', date: '26 November', image: '' })
      draft = ''
      render()
      content.querySelector('[role="status"]').textContent = 'Saved in this preview. Find it in Journal or Library.'
    }
  })
  render()

  if (!reducedMotion.matches) {
    const figure = root.closest('figure')
    figure.classList.add('web-entering')
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        figure.classList.add('web-entered')
        observer.disconnect()
      }
    }, { threshold: .15 })
    observer.observe(figure)
  }
}
