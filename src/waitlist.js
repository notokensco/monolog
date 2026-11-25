export function initWaitlist() {
  const waitlist = document.querySelector('#waitlist')
  const heroNote = document.querySelector('.hero-note')
  const mobileSlot = document.querySelector('.waitlist-mobile')
  const mobile = matchMedia('(max-width: 700px)')
  const form = waitlist.querySelector('form')
  const email = form.elements.email
  const button = form.querySelector('button')
  const status = form.querySelector('[role="status"]')
  const retryMessage = 'We couldn’t save your signup. Please try again.'

  function placeWaitlist() {
    const focused = waitlist.contains(document.activeElement) ? document.activeElement : null
    if (mobile.matches) {
      mobileSlot.hidden = false
      mobileSlot.append(waitlist)
    } else {
      heroNote.before(waitlist)
      mobileSlot.hidden = true
    }
    focused?.focus({ preventScroll: true })
  }

  placeWaitlist()
  if (location.hash === '#waitlist') waitlist.scrollIntoView({ behavior: 'instant' })
  mobile.addEventListener('change', placeWaitlist)
  button.disabled = false

  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (button.disabled) return

    button.disabled = true
    email.readOnly = true
    status.removeAttribute('data-error')
    status.textContent = 'Joining the waitlist…'

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value }),
        signal: AbortSignal.timeout(15000),
      })
      const result = await response.json()
      if (!response.ok || result?.ok !== true) {
        status.setAttribute('data-error', '')
        status.textContent = typeof result?.message === 'string' ? result.message : retryMessage
        return
      }

      email.value = ''
      status.textContent = 'You’re on the list. We’ll email you about the Android launch.'
    } catch {
      status.setAttribute('data-error', '')
      status.textContent = retryMessage
    } finally {
      button.disabled = false
      email.readOnly = false
    }
  })
}
