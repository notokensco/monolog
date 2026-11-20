import { test, expect } from '@playwright/test'

test('individual hero keys load and settle across desktop, tablet and phone layouts', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const [width, height] of [[1440, 1000], [768, 1024], [390, 844], [360, 740]]) {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    const stage = page.locator('.constellation-stage')
    await expect(stage).toHaveClass(/is-visible/)
    await expect.poll(() => stage.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBeTruthy()
    await expect.poll(() => stage.locator('.constellation-key').evaluateAll(keys => keys.every(key => getComputedStyle(key).opacity === '1' && key.getAnimations().every(animation => animation.playState === 'finished')))).toBeTruthy()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
    const mainKey = await page.locator('.key-main-m').boundingBox()
    const copy = await page.locator('.hero-copy').boundingBox()
    if (width <= 700) expect(mainKey.y).toBeGreaterThanOrEqual(copy.y + copy.height)
    await page.screenshot({ path: `test-results/hero-popcorn-${width}.png`, animations: 'disabled' })
    if (width === 390) await page.locator('.hero').screenshot({ path: 'test-results/hero-popcorn-mobile-section.png', animations: 'disabled' })
  }
  expect(errors).toEqual([])
})

test('keys wait offscreen and pop once when visitors return to the hero', async ({ page }) => {
  await page.goto('/#journal')
  const stage = page.locator('.constellation-stage')
  await expect(page.locator('#journal')).toBeInViewport()
  await expect(stage).toHaveClass(/is-preparing/)
  expect(await stage.locator('.constellation-key').first().evaluate(key => getComputedStyle(key).opacity)).toBe('0')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(stage).toHaveClass(/is-visible/)
  await expect.poll(() => stage.locator('.constellation-key').evaluateAll(keys => keys.every(key => key.getAnimations().every(animation => animation.playState === 'finished')))).toBeTruthy()
  await page.locator('#journal').scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  expect(await stage.locator('.constellation-key').evaluateAll(keys => keys.every(key => key.getAnimations().every(animation => animation.playState === 'finished')))).toBeTruthy()
})

test('every hero sculpture presses and springs back with mouse and touch', async ({ page, browser, baseURL }) => {
  async function checkPresses(screen, touch = false) {
    await screen.goto('/')
    const keys = screen.getByRole('button', { name: /^Press / })
    await expect(keys).toHaveCount(8)
    await expect.poll(() => keys.evaluateAll(nodes => nodes.every(key =>
      getComputedStyle(key).opacity === '1' && key.getAnimations().every(animation => animation.playState === 'finished')
    ))).toBe(true)
    for (const key of await keys.all()) {
      if (touch) await key.tap()
      else await key.click()
      const travel = await key.locator('img').evaluate(sculpture => {
        const frames = sculpture.getAnimations().flatMap(animation => animation.effect.getKeyframes())
        return frames.filter(frame => frame.translate).map(frame => Number.parseFloat(frame.translate.split(' ').at(-1)))
      })
      expect(travel.some(offset => offset > 0)).toBe(true)
      expect(travel.some(offset => offset < 0)).toBe(true)
    }
    return keys
  }

  const keys = await checkPresses(page)
  await keys.first().press('Enter')
  await expect.poll(() => keys.first().locator('img').evaluate(sculpture =>
    sculpture.getAnimations().some(animation => animation.effect.getKeyframes().some(frame => frame.translate))
  )).toBe(true)

  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  try {
    await checkPresses(await context.newPage(), true)
  } finally {
    await context.close()
  }
})

test('reduced motion and JavaScript disabled both keep the full artwork visible', async ({ page, browser, baseURL }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(await page.locator('.constellation-key').evaluateAll(keys => keys.every(key => getComputedStyle(key).opacity === '1' && key.getAnimations().length === 0))).toBeTruthy()
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const staticPage = await context.newPage()
  await staticPage.goto('/')
  expect(await staticPage.locator('.constellation-key img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0 && getComputedStyle(image.parentElement).opacity === '1'))).toBeTruthy()
  await context.close()
})
