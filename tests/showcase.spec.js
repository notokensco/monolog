import { test, expect } from '@playwright/test'

test('production loads original artwork, local fonts, valid links and the requested wording', async ({ page, request }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A keyboard.')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('24px "Beth Ellen"'))).toBeTruthy()
  const images = await page.locator('img').evaluateAll(elements => elements.map(image => image.getAttribute('src')))
  for (const src of new Set(images)) {
    const response = await request.get(src)
    expect(response.ok(), src).toBeTruthy()
    expect(response.headers()['content-type']).toContain('image/')
  }
  const badLinks = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')).filter(href => !document.getElementById(href.slice(1))))
  expect(badLinks).toEqual([])
  const emails = await page.locator('a[href^="mailto:"]').evaluateAll(links => links.map(link => link.getAttribute('href').split('?')[0]))
  expect([...new Set(emails)]).toEqual(['mailto:monolog@notokens.co'])
  await expect(page.locator('body')).not.toContainText(/Gboard|SwiftKey|hello@notokens/)
  await expect(page.locator('summary').first()).toContainText('How does Monolog differ from its competitors?')
  expect(errors).toEqual([])
  await page.screenshot({ path: 'test-results/redesign-desktop-hero.png' })
})

test('playground keys, shift, deletion, punctuation and local voice preview work', async ({ page }) => {
  await page.goto('/#playground')
  await page.getByRole('button', { name: 'Clear demo text' }).click()
  const input = page.getByRole('textbox', { name: 'Try typing a thought' })
  await page.getByRole('button', { name: 'Type h', exact: true }).click()
  await page.getByRole('button', { name: 'Type i', exact: true }).click()
  await expect(input).toHaveValue('hi')
  await page.getByRole('button', { name: 'Insert a space' }).click()
  await page.getByRole('button', { name: 'Toggle uppercase' }).click()
  await page.getByRole('button', { name: 'Type a', exact: true }).click()
  await expect(input).toHaveValue('hi A')
  await page.getByRole('button', { name: 'Delete the previous character' }).click()
  await expect(input).toHaveValue('hi ')
  await input.fill('hello world')
  await page.getByRole('button', { name: 'Polish this thought' }).click()
  await expect(input).toHaveValue('Hello world.')
  await page.getByRole('button', { name: 'Play a voice typing demo' }).click()
  await expect(input).toHaveValue("Hey, let's take the long way home.", { timeout: 5000 })
  await page.getByRole('button', { name: 'Preview a journal memory' }).click()
  await expect(page.locator('#demo-feedback')).toContainText('Nothing is saved in this demo.')
  await page.reload()
  await expect(input).toHaveValue("Let's meet at the library at four.")
})

test('five accessible product tabs and both theme previews work', async ({ page }) => {
  await page.goto('/#showcase')
  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveCount(5)
  for (const tab of await tabs.all()) {
    await tab.click()
    await expect(tab).toHaveAttribute('aria-selected', 'true')
    const image = page.getByRole('tabpanel').locator('img')
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBeTruthy()
  }
  await tabs.last().focus()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.first()).toBeFocused()
  await page.locator('#theme-btn-ink').click()
  await expect(page.locator('.showcase-stage')).toHaveAttribute('data-preview-theme', 'ink')
  await expect(page.locator('#keyboard-preview-image')).toHaveAttribute('src', '/images/ink-theme-keyboard.png')
  await page.reload()
  await expect(page.locator('#theme-btn-ink')).toHaveAttribute('aria-pressed', 'true')
  await page.locator('#theme-btn-paper').click()
  await expect(page.locator('.showcase-stage')).toHaveAttribute('data-preview-theme', 'paper')
})

test('incognito illustration and annual pricing communicate their state', async ({ page }) => {
  await page.goto('/#privacy')
  await page.getByRole('button', { name: 'Preview incognito mode' }).click()
  await expect(page.locator('#privacy-status')).toHaveText('Memory paused. A moment for you.')
  await expect(page.locator('#privacy-toggle')).toHaveAttribute('aria-pressed', 'true')
  await page.locator('#privacy-toggle').click()
  await expect(page.locator('#privacy-toggle')).toHaveAttribute('aria-pressed', 'false')
  await page.getByRole('button', { name: /Yearly/ }).click()
  await expect(page.locator('#pro-price')).toHaveText('₹3,372')
  await expect(page.locator('#billing-note')).toContainText('₹281/month, billed yearly. Save ₹216')
  await expect(page.locator('#pro-contact')).toHaveAttribute('href', /monolog@notokens.co.*Yearly/)
  await page.getByRole('button', { name: 'Monthly', exact: true }).click()
  await expect(page.locator('#pro-price')).toHaveText('₹299')
})

test('native scroll reveals all three desktop feature chapters', async ({ page }) => {
  await page.goto('/')
  const info = await page.locator('#possibilities').evaluate(section => ({ top: section.offsetTop, height: section.offsetHeight }))
  const distance = info.height - 1000 + 80
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), info.top - 80 + distance * .5)
  await expect.poll(() => page.locator('[data-story="1"]').getAttribute('aria-pressed')).toBe('true')
  await expect(page.locator('#ai-panel')).toBeInViewport({ ratio: .7 })
  await page.screenshot({ path: 'test-results/redesign-floating-ai.png' })
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), info.top - 80 + distance)
  await expect(page.locator('#actions')).toBeInViewport({ ratio: .7 })
})

test('mobile navigation, FAQ, and layouts fit compact and wide screens', async ({ page }) => {
  await page.goto('/')
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth), 'page overflow at ' + width).toBeLessThanOrEqual(width)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  const menu = page.getByRole('button', { name: 'Open navigation' })
  await menu.click()
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Pricing' }).click()
  await expect(page).toHaveURL(/#pricing$/)
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await menu.click()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await page.locator('summary').first().click()
  await expect(page.locator('details').first()).toHaveAttribute('open', '')
  await page.goto('/')
  await page.screenshot({ path: 'test-results/redesign-mobile-hero.png' })
})

test('artwork, playable keyboard and journal look complete at desktop and mobile sizes', async ({ page }) => {
  await page.goto('/')
  for (const [id, filename] of [['playground', 'keyboard'], ['journal', 'journal'], ['privacy', 'privacy'], ['showcase', 'showcase'], ['contact', 'contact']]) {
    await page.locator('#' + id).scrollIntoViewIfNeeded()
    await page.waitForTimeout(1100)
    await page.screenshot({ path: 'test-results/redesign-desktop-' + filename + '.png' })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  for (const [selector, filename] of [['.keyboard-demo', 'keyboard'], ['#vox', 'vox'], ['.journal-art', 'journal'], ['.showcase-stage', 'showcase']]) {
    await page.locator(selector).scrollIntoViewIfNeeded()
    await page.waitForTimeout(1100)
    await page.screenshot({ path: 'test-results/redesign-mobile-' + filename + '.png' })
  }
})

test('reduced motion keeps all feature chapters readable without pinning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(await page.locator('.possibilities-sticky').evaluate(element => getComputedStyle(element).position)).toBe('relative')
  for (const id of ['vox', 'ai-panel', 'actions']) {
    await page.locator('#' + id).scrollIntoViewIfNeeded()
    await expect(page.locator('#' + id)).toBeInViewport()
  }
})

test('keyboard matches the borderless reference and its utility controls work', async ({ page }) => {
  await page.goto('/#playground')
  const surface = page.locator('.keyboard-surface')
  await surface.scrollIntoViewIfNeeded()
  await expect(page.locator('.key-number')).toHaveText(['1','2','3','4','5','6','7','8','9','0'])
  await expect(page.locator('#space-key')).toHaveText('English')
  await expect(page.locator('.reminder-suggestion')).toContainText('Set 5 PM exam reminder')
  const appearance = await page.locator('[data-letter="q"]').evaluate(key => {
    const style = getComputedStyle(key)
    return { background: style.backgroundColor, shadow: style.boxShadow, border: style.borderTopWidth }
  })
  expect(appearance).toEqual({ background: 'rgba(0, 0, 0, 0)', shadow: 'none', border: '0px' })
  await page.getByRole('button', { name: 'Clear demo text' }).click()
  await page.getByRole('button', { name: 'Switch to numbers and symbols' }).click()
  await page.getByRole('button', { name: 'Type 1', exact: true }).click()
  await page.getByRole('button', { name: 'Type @', exact: true }).click()
  await page.getByRole('button', { name: 'Type a period', exact: true }).click()
  await expect(page.locator('#demo-input')).toHaveValue('1@.')
  await page.getByRole('button', { name: 'Switch to letters' }).click()
  await page.getByRole('button', { name: 'Choose an emoji' }).click()
  await page.getByRole('button', { name: 'Insert smiling emoji' }).click()
  await expect(page.locator('#demo-input')).toHaveValue('1@.😊')
  await expect(page.locator('#emoji-tray')).toBeHidden()
  await page.getByRole('button', { name: 'Toggle keyboard incognito preview' }).click()
  await expect(page.locator('.reminder-suggestion')).toContainText('Memory paused')
  await page.getByRole('button', { name: 'Toggle keyboard incognito preview' }).click()
  await page.getByRole('button', { name: 'Preview the 5 PM exam reminder' }).click()
  await expect(page.locator('#demo-feedback')).toContainText('Nothing is scheduled here.')
  await page.locator('#demo-feedback').evaluate(element => { element.hidden = true })
  await surface.screenshot({ path: 'test-results/keyboard-enlarged.png' })
  await surface.evaluate(element => { element.style.width = '294px'; element.style.marginInline = 'auto' })
  await surface.screenshot({ path: 'test-results/keyboard-reference-scale.png' })
})
