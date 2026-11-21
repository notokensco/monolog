import '@fontsource-variable/manrope'
import '@fontsource/beth-ellen/400.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/roboto/latin-400.css'
import './styles.css'
import './tos.css'

// Scroll Progress Bar
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress')
  if (!progressBar) return

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    if (totalHeight <= 0) return
    const progress = window.scrollY / totalHeight
    progressBar.style.transform = `scaleX(${progress})`
  }, { passive: true })
}

// Table of Contents Active Link Highlight
function initTocObserver() {
  const tocLinks = document.querySelectorAll('.tos-toc-link')
  const sections = document.querySelectorAll('.tos-section')

  if (!tocLinks.length || !sections.length) return

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active')
          } else {
            link.classList.remove('active')
          }
        })
      }
    })
  }, {
    rootMargin: '-20% 0px -70% 0px'
  })

  sections.forEach(sec => observer.observe(sec))
}

// Copy Email Utility
function initCopyEmail() {
  const btn = document.getElementById('copy-tos-email')
  if (!btn) return

  btn.addEventListener('click', async () => {
    const email = 'monolog@notokens.co'
    try {
      await navigator.clipboard.writeText(email)
      const originalText = btn.innerHTML
      btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg> Copied!`
      setTimeout(() => {
        btn.innerHTML = originalText
      }, 2500)
    } catch {
      window.location.href = `mailto:${email}`
    }
  })
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress()
    initTocObserver()
    initCopyEmail()
  })
} else {
  initScrollProgress()
  initTocObserver()
  initCopyEmail()
}
