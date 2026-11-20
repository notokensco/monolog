import '@fontsource-variable/manrope'
import '@fontsource/beth-ellen/400.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/roboto/latin-400.css'
import './styles.css'
import './keyboard.css'
import './keyboard-demo.css'
import './hero-keys.css'
import { initHeroKeys } from './hero-keys.js'

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
initHeroKeys(reducedMotion)
const icon = name => '<svg class="icon" aria-hidden="true"><use href="#icon-' + name + '"/></svg>'
for (const svg of document.querySelectorAll('svg')) svg.setAttribute('aria-hidden', 'true')

import { initKeyboardDemo } from './keyboard-demo.js'
initKeyboardDemo()

// Preview tabs support pointer and keyboard input.
const tabs = [...document.querySelectorAll('[data-tab]')]
const panels = [...document.querySelectorAll('.tab-panel')]
function selectTab(id, focus = false) {
  for (const panel of panels) panel.hidden = panel.id !== id
  for (const tab of tabs) {
    const active = tab.dataset.tab === id
    tab.setAttribute('aria-selected', String(active))
    tab.tabIndex = active ? 0 : -1
    if (active && focus) tab.focus()
  }
}
for (const tab of tabs) {
  tab.addEventListener('click', () => selectTab(tab.dataset.tab))
  tab.addEventListener('keydown', event => {
    let next = tabs.indexOf(tab)
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (next + 1) % tabs.length
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (next - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    selectTab(tabs[next].dataset.tab, true)
  })
}
function setTheme(theme, persist = true) {
  document.querySelector('.showcase-stage').dataset.previewTheme = theme
  const image = document.querySelector('#keyboard-preview-image')
  image.src = theme === 'ink' ? '/images/ink-theme-keyboard.png' : '/images/smart-reminder-suggestion-on-monolog-keyboard.png'
  image.alt = 'Monolog ' + (theme === 'ink' ? 'Ink' : 'Paper') + ' keyboard product concept'
  for (const button of document.querySelectorAll('[data-theme]')) button.setAttribute('aria-pressed', String(button.dataset.theme === theme))
  if (persist) { try { localStorage.setItem('monolog-preview-theme', theme) } catch { /* Optional preference. */ } }
}
for (const button of document.querySelectorAll('[data-theme]')) button.addEventListener('click', () => { setTheme(button.dataset.theme); selectTab('tab-paper') })
try { if (localStorage.getItem('monolog-preview-theme') === 'ink') setTheme('ink', false) } catch { /* Paper is the default. */ }

// Native document scrolling drives the horizontal story; wheel input is never trapped.
const storySection = document.querySelector('.possibilities')
const storyTrack = document.querySelector('.story-track')
const storyCards = [...document.querySelectorAll('.story-card')]
const storyButtons = [...document.querySelectorAll('[data-story]')]
const desktopStory = matchMedia('(min-width: 901px)')
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
  for (let index = 0; index < 45; index++) {
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
document.querySelector('#copy-email').addEventListener('click', async event => {
  const label = event.currentTarget.querySelector('span')
  try { await navigator.clipboard.writeText('monolog@notokens.co'); label.textContent = 'Copied. Say hello.' }
  catch { label.textContent = 'monolog@notokens.co' }
})
