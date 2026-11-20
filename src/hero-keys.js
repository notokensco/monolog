// Observe the artwork itself: on phones it can begin below the fold.
export function initHeroKeys(reducedMotion) {
  const stage = document.querySelector('.constellation-stage')
  if (!stage || reducedMotion.matches || !('IntersectionObserver' in window)) return

  stage.classList.add('is-preparing')
  const ready = Promise.allSettled([...stage.querySelectorAll('img')].map(image => image.decode()))
  let started = false
  let onscreen = false
  let imagesReady = false
  const destination = document.getElementById(location.hash.slice(1))
  // A fragment can smooth-scroll past the hero on its initial trip down the page.
  // In that case, arm the entrance only after the artwork first leaves view.
  let armed = !destination || destination.contains(stage) || stage.closest('.hero').contains(destination)

  function reveal() {
    if (started) return
    started = true
    stage.classList.remove('is-preparing')
    stage.classList.add('is-visible')
    observer.disconnect()
    reducedMotion.removeEventListener('change', onMotionChange)
  }

  function onMotionChange() {
    if (reducedMotion.matches) reveal()
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      onscreen = entry.isIntersecting && entry.intersectionRatio >= .15
      if (!onscreen) armed = true
      else if (armed && imagesReady) reveal()
    }
  }, { threshold: .15 })
  ready.then(() => {
    imagesReady = true
    if (onscreen && armed) reveal()
  })

  reducedMotion.addEventListener('change', onMotionChange)
  // Initial fragment navigation happens at load; don't consume the entrance
  // while the browser is still placing a visitor at a lower section.
  const observe = () => requestAnimationFrame(() => {
    if (!started) observer.observe(stage)
  })
  if (document.readyState === 'complete') observe()
  else window.addEventListener('load', observe, { once: true })
}
