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

test('reduced motion and JavaScript disabled both keep the full artwork visible', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(await page.locator('.constellation-key').evaluateAll(keys => keys.every(key => getComputedStyle(key).opacity === '1' && key.getAnimations().length === 0))).toBeTruthy()
  const context = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await context.newPage()
  await staticPage.goto('http://127.0.0.1:4173/')
  expect(await staticPage.locator('.constellation-key img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0 && getComputedStyle(image.parentElement).opacity === '1'))).toBeTruthy()
  await context.close()
})
