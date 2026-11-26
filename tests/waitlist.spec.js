import { expect, test } from '@playwright/test'

test('early access links lead to the same signup form in the appropriate layout', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const waitlist = page.getByRole('region', { name: 'Get in early' })
  const email = waitlist.getByRole('textbox', { name: 'Email address' })
  const earlyAccess = page.getByRole('link', { name: 'Get in early' })

  await expect(page.locator('.hero-copy > #waitlist')).toBeVisible()
  await earlyAccess.click()
  await expect(page).toHaveURL('/')
  await expect(waitlist).toBeInViewport()
  await email.fill('draft@example.com')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('#pricing + .waitlist-mobile > #waitlist')).toBeVisible()
  await expect(email).toHaveValue('draft@example.com')
  await earlyAccess.click()
  await expect(waitlist).toBeInViewport()
  await expect(page.locator('.hero #waitlist')).toHaveCount(0)

  await page.goto('/#waitlist')
  await expect(waitlist).toBeInViewport()

  await page.mouse.wheel(0, -100000)
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(page.locator('.hero-copy > #waitlist')).toBeVisible()
  expect(await page.evaluate(() => scrollY)).toBe(0)
  await expect(page).toHaveURL('/')

  await page.evaluate(() => { location.hash = '#pricing' })
  await expect(page.locator('#pricing')).toBeInViewport()
  await expect(page).toHaveURL('/')
  await page.getByRole('contentinfo').getByRole('link', { name: 'Monolog home' }).click()
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  await expect(page).toHaveURL('/')
})

test('waitlist keeps the email after a failed signup and confirms a successful retry', async ({ page }) => {
  let requests = 0
  await page.route('**/api/waitlist', async route => {
    expect(route.request().method()).toBe('POST')
    expect(route.request().postDataJSON()).toEqual({ email: 'reader@example.com' })
    requests++
    if (requests === 1) {
      await route.fulfill({ status: 503, json: { ok: false, message: 'Signups are temporarily unavailable.' } })
    } else {
      await route.fulfill({ json: { ok: true } })
    }
  })
  await page.goto('/')
  const waitlist = page.locator('#waitlist')
  const email = waitlist.getByRole('textbox', { name: 'Email address' })
  const submit = waitlist.getByRole('button', { name: 'Join the waitlist' })
  const status = waitlist.getByRole('status')

  await email.fill('invalid')
  await submit.click()
  await expect(email).toBeFocused()
  expect(requests).toBe(0)

  await email.fill('reader@example.com')
  await submit.click()
  await expect(status).toHaveText('Signups are temporarily unavailable.')
  await expect(email).toHaveValue('reader@example.com')
  await submit.click()
  await expect(status).toContainText('You’re on the list.')
  await expect(email).toHaveValue('')
  expect(requests).toBe(2)
})
