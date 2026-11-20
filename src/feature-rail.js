export function initFeatureRail(reducedMotion) {
  const section = document.querySelector('.feature-overview')
  const rail = section.querySelector('.feature-rail')
  const track = rail.firstElementChild
  const controls = section.querySelector('.feature-rail-controls')
  const toggle = controls.querySelector('[data-feature-pause]')
  const toggleLabel = toggle.querySelector('span')
  const toggleIcon = toggle.querySelector('use')
  let paused = false
  let inView = false
  let hovering = false
  let frame
  let previousTime
  let position = 0

  function cardStep() {
    return track.children[1].offsetLeft - track.firstElementChild.offsetLeft
  }

  function move(time) {
    if (previousTime !== undefined) position += Math.min(time - previousTime, 40) * .034
    previousTime = time
    const step = cardStep()
    if (position >= step && rail.scrollWidth - rail.clientWidth >= step) {
      track.append(track.firstElementChild)
      position -= step
    }
    rail.scrollLeft = position
    frame = requestAnimationFrame(move)
  }

  function sync() {
    if (!paused && !reducedMotion.matches && inView && !document.hidden
      && !hovering && !rail.contains(document.activeElement)) {
      if (frame !== undefined) return
      position = rail.scrollLeft
      previousTime = undefined
      frame = requestAnimationFrame(move)
      return
    }
    cancelAnimationFrame(frame)
    frame = undefined
  }

  function setPaused(next) {
    paused = next
    toggleLabel.textContent = paused ? 'Play' : 'Pause'
    toggleIcon.setAttribute('href', paused ? '#icon-play' : '#icon-pause')
    sync()
  }

  function updateMotion() {
    toggle.hidden = reducedMotion.matches
    sync()
  }

  controls.hidden = false
  toggle.addEventListener('click', () => setPaused(!paused))
  for (const button of controls.querySelectorAll('[data-feature-step]')) {
    button.addEventListener('click', () => {
      setPaused(true)
      rail.scrollBy({ left: cardStep() * Number(button.dataset.featureStep), behavior: reducedMotion.matches ? 'instant' : 'smooth' })
    })
  }

  rail.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return
    hovering = true
    sync()
  })
  rail.addEventListener('pointerleave', () => {
    hovering = false
    sync()
  })
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') setPaused(true)
  })
  rail.addEventListener('wheel', event => {
    if (event.deltaX || event.shiftKey) setPaused(true)
  }, { passive: true })
  rail.addEventListener('focusin', sync)
  rail.addEventListener('focusout', () => queueMicrotask(sync))
  document.addEventListener('visibilitychange', sync)
  reducedMotion.addEventListener('change', updateMotion)
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    sync()
  }).observe(rail)
  updateMotion()
}
