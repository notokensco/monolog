import '@fontsource-variable/manrope'
import '@fontsource/beth-ellen/400.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/science-gothic/600.css'
import '@fontsource/roboto/latin-400.css'
import './styles.css'
import './keyboard.css'
import './keyboard-demo.css'
import './hero-keys.css'
import './journal-enhanced.css'
import './journal-phone.css'
import './context-library.css'
import './feature-overview.css'
import './showcase.css'
import './waitlist.css'
import { DotLottie } from '@lottiefiles/dotlottie-web'
import { initHeroKeys } from './hero-keys.js'
import { initJournalPhones } from './journal-phone.js'
import { initContextLibrary } from './context-library.js'
import { initFeatureRail } from './feature-rail.js'
import { initShowcase } from './showcase.js'
import { initWaitlist } from './waitlist.js'
import { initFooterAurora } from './footer-aurora.js'

initWaitlist()

const menuButton = document.querySelector('#menu-toggle')
const mobileMenu = document.querySelector('#mobile-nav')
function closeMenu() { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation') }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true'
  mobileMenu.hidden = !open
  menuButton.setAttribute('aria-expanded', String(open))
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation')
})
mobileMenu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu() })
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu() })
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuButton.focus() } })
matchMedia('(min-width: 1001px)').addEventListener('change', event => { if (event.matches) closeMenu() })

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
initHeroKeys(reducedMotion)
initJournalPhones()
initContextLibrary()
initFeatureRail(reducedMotion)
initShowcase(reducedMotion)

function scrollToSection(section) {
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search)
  section.scrollIntoView({ behavior: 'instant' })
  if (!section.contains(document.activeElement)) {
    if (section.tabIndex < 0) section.tabIndex = -1
    section.focus({ preventScroll: true })
  }
}

function openSectionFromHash() {
  const section = document.getElementById(location.hash.slice(1))
  if (section) scrollToSection(section)
}

openSectionFromHash()
window.addEventListener('hashchange', openSectionFromHash)

window.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = event.target.closest('a[href^="#"]')
  if (!link || link.target || link.hasAttribute('download')) return
  const section = document.getElementById(link.hash.slice(1))
  if (!section) return
  event.preventDefault()
  scrollToSection(section)
})

const ticker = document.querySelector('.word-ticker')
const tickerTrack = ticker?.querySelector('.ticker-track')
const tickerPhrase = tickerTrack?.firstElementChild
if (ticker && tickerTrack && tickerPhrase) {
  function fillTicker() {
    const phraseWidth = tickerPhrase.getBoundingClientRect().width
    if (!phraseWidth) return
    const copies = Math.ceil(ticker.clientWidth / phraseWidth) + 1
    while (tickerTrack.children.length < copies) tickerTrack.append(tickerPhrase.cloneNode(true))
    while (tickerTrack.children.length > copies) tickerTrack.lastElementChild.remove()
    tickerTrack.style.setProperty('--ticker-end', `${-phraseWidth}px`)
  }
  const tickerResize = new ResizeObserver(fillTicker)
  tickerResize.observe(ticker)
  tickerResize.observe(tickerPhrase)
  fillTicker()
}

document.querySelectorAll('.thought-key').forEach((key, index) => {
  const face = key.firstElementChild
  const lift = index % 2 === 0 ? -9 : 7
  let bounce
  key.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return
    bounce?.cancel()
    bounce = face.animate([
      { translate: '0 0' },
      { translate: `0 ${lift}px`, offset: .28, easing: 'ease-out' },
      { translate: `0 ${-lift * .36}px`, offset: .61 },
      { translate: '0 0' },
    ], { duration: 400, easing: 'ease-in-out' })
  })
})

const androidMascot = document.querySelector('.android-mascot')
const androidEyes = [...androidMascot.querySelectorAll('.android-eye')]
let blink = []
function blinkAndroid() {
  if (reducedMotion.matches) return
  blink.forEach(animation => animation.cancel())
  blink = androidEyes.map(eye => eye.animate([
    { transform: 'scaleY(1)' },
    { transform: 'scaleY(.08)', offset: .19 },
    { transform: 'scaleY(1)', offset: .37 },
    { transform: 'scaleY(1)', offset: .56 },
    { transform: 'scaleY(.08)', offset: .73 },
    { transform: 'scaleY(1)' },
  ], { duration: 480, easing: 'ease-in-out' }))
}
androidMascot.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'touch') blinkAndroid()
})
androidMascot.addEventListener('click', blinkAndroid)

const icon = name => '<svg class="icon" aria-hidden="true"><use href="#icon-' + name + '"/></svg>'
for (const svg of document.querySelectorAll('svg')) svg.setAttribute('aria-hidden', 'true')

import { initKeyboardDemo } from './keyboard-demo.js'
initKeyboardDemo()

// Native document scrolling drives the horizontal story; wheel input is never trapped.
const storySection = document.querySelector('.possibilities')
const storyTrack = document.querySelector('.story-track')
const storyCards = [...document.querySelectorAll('.story-card')]
const storyButtons = [...document.querySelectorAll('[data-story]')]
const desktopStory = matchMedia('(min-width: 901px)')
const footerKeyboard = document.querySelector('.footer-keyboard')
const footerKeys = footerKeyboard ? [...footerKeyboard.children] : []
const footerKeyOffsets = [
  [-115, -4],
  [-175, 3],
  [-135, -2.5],
  [-195, 4.5],
  [-92, -1.2],
  [-168, 3.5],
  [-125, -3],
]
let ticking = false
function updateScroll() {
  ticking = false
  const scrollable = document.documentElement.scrollHeight - innerHeight
  document.querySelector('.scroll-progress').style.transform = 'scaleX(' + (scrollable > 0 ? scrollY / scrollable : 0) + ')'
  const rect = storySection.getBoundingClientRect()
  const distance = Math.max(1, storySection.offsetHeight - innerHeight + 80)
  const progress = Math.min(1, Math.max(0, (80 - rect.top) / distance))
  if (desktopStory.matches && !reducedMotion.matches) {
    const travel = storyTrack.scrollWidth - storyTrack.parentElement.clientWidth
    storyTrack.style.transform = 'translate3d(' + (-progress * travel) + 'px, 0, 0)'
    const active = Math.round(progress * 2)
    storyButtons.forEach((button, index) => {
      button.classList.toggle('active', index === active)
      button.setAttribute('aria-pressed', String(index === active))
    })
    document.querySelector('.story-progress span').style.transform = 'scaleX(' + Math.max(.05, progress) + ')'
  } else storyTrack.style.transform = ''
  if (!reducedMotion.matches && scrollY < 1100) document.querySelector('.hero-art').style.transform = 'translate3d(0, ' + Math.min(100, scrollY * .12) + 'px, 0)'
  if (footerKeyboard) {
    if (reducedMotion.matches) {
      footerKeys.forEach(key => { key.style.transform = '' })
    } else {
      const kbRect = footerKeyboard.getBoundingClientRect()
      const detach = Math.max(0, Math.min(1, (kbRect.bottom - innerHeight * 0.88) / (innerHeight * 0.55)))
      const eased = detach * detach
      footerKeys.forEach((key, index) => {
        const [lift, tilt] = footerKeyOffsets[index] || [-120, 0]
        key.style.transform = eased > 0.002
          ? `translate3d(0, ${(lift * eased).toFixed(1)}px, 0) rotate(${(tilt * eased).toFixed(2)}deg)`
          : ''
      })
    }
  }
}
function requestScroll() { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll) } }
addEventListener('scroll', requestScroll, { passive: true })
addEventListener('resize', requestScroll)
reducedMotion.addEventListener('change', requestScroll)
storyButtons.forEach((button, index) => button.addEventListener('click', () => {
  if (desktopStory.matches && !reducedMotion.matches) {
    const top = storySection.getBoundingClientRect().top + scrollY
    const distance = storySection.offsetHeight - innerHeight + 80
    window.scrollTo({ top: top - 80 + distance * (index / 2), behavior: 'smooth' })
  } else storyCards[index].scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' })
}))
updateScroll()
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
}, { threshold: .1 })
document.documentElement.classList.add('motion-ready')
document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
document.querySelectorAll('.waveform').forEach(waveform => {
  const count = Number(waveform.dataset.bars) || 45
  for (let index = 0; index < count; index++) {
    const bar = document.createElement('i')
    bar.style.setProperty('--height', (15 + Math.abs(Math.sin(index * 1.7) * Math.sin(index * .28)) * 85) + '%')
    bar.style.setProperty('--delay', (index * -.09) + 's')
    waveform.append(bar)
  }
})

const privacyButton = document.querySelector('#privacy-toggle')
privacyButton.addEventListener('click', () => {
  const active = privacyButton.getAttribute('aria-pressed') !== 'true'
  privacyButton.setAttribute('aria-pressed', String(active))
  privacyButton.closest('.privacy').classList.toggle('incognito-active', active)
  document.querySelector('#privacy-key-label').textContent = active ? 'incognito is on' : 'go incognito'
  document.querySelector('#privacy-status').textContent = active ? 'Memory paused. A moment for you.' : 'Your call. Always.'
  document.querySelector('#privacy-description').textContent = active ? 'In Monolog, this pauses capture. Here, it is simply a preview.' : 'Give the key a tap. See how a little space feels.'
})
for (const button of document.querySelectorAll('[data-billing]')) button.addEventListener('click', () => {
  const yearly = button.dataset.billing === 'yearly'
  for (const option of document.querySelectorAll('[data-billing]')) option.setAttribute('aria-pressed', String(option === button))
  document.querySelector('#pro-price').textContent = yearly ? '₹3,372' : '₹299'
  document.querySelector('#pro-period').textContent = yearly ? 'per year' : 'per month'
  document.querySelector('#billing-note').textContent = yearly ? '₹281/month, billed yearly. Save ₹216 a year (about 6%).' : 'Proposed monthly launch price. No payment is taken here.'
  document.querySelector('#pro-contact').href = 'mailto:monolog@notokens.co?subject=Monolog%20Pro%20' + (yearly ? 'Yearly' : 'Monthly')
})

document.querySelector('#copy-email').addEventListener('click', async event => {
  const label = event.currentTarget.querySelector('span')
  try { await navigator.clipboard.writeText('monolog@notokens.co'); label.textContent = 'Copied. Say hello.' }
  catch { label.textContent = 'monolog@notokens.co' }
})

const notokensCanvas = document.querySelector('#notokens-lottie')
if (notokensCanvas) {
  DotLottie.setWasmUrl('/wasm/dotlottie-player.wasm')
  let notokensPlayer = null
  const startNotokensLottie = () => {
    if (reducedMotion.matches || notokensPlayer) return
    notokensPlayer = new DotLottie({
      canvas: notokensCanvas,
      src: '/animations/notokens-logo.lottie',
      autoplay: true,
      loop: true,
      layout: { fit: 'contain', align: [0.5, 0.5] },
      renderConfig: { autoResize: true },
    })
    notokensPlayer.addEventListener('load', () => {
      notokensCanvas.classList.add('is-ready')
      notokensCanvas.parentElement?.classList.add('is-lottie-ready')
    })
  }
  startNotokensLottie()
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      notokensPlayer?.pause()
      notokensCanvas.classList.remove('is-ready')
      notokensCanvas.parentElement?.classList.remove('is-lottie-ready')
    } else if (notokensPlayer) {
      notokensCanvas.classList.add('is-ready')
      notokensCanvas.parentElement?.classList.add('is-lottie-ready')
      notokensPlayer.play()
    } else {
      startNotokensLottie()
    }
  })
}

initFooterAurora(reducedMotion)
