import { test, expect } from '@playwright/test'

test('demo page loads directly on /demo, keeps phone fixed, and runs full 14-scene story via arrows and buttons', async ({ page }) => {
  const errors = []
  page.on('pageerror', err => errors.push(err.message))

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/demo')
  await expect(page.getByText('Interactive demo')).toBeVisible()
  await expect(page.locator('#demo-progress')).toHaveText('01 / 14')
  await expect(page.locator('#demo-scene-title')).toHaveText('Android home screen')
  await expect(page.locator('#phone-viewport')).toContainText('Monolog')
  await expect(page.locator('#phone-viewport')).toContainText('WhatsApp')
  await expect(page.locator('#speaker-notes-panel')).toBeHidden()

  // Reload directly on /demo to verify refresh works
  await page.reload()
  await expect(page.locator('#demo-progress')).toHaveText('01 / 14')

  const phoneBox0 = await page.locator('#demo-phone-stage').boundingBox()

  // Step through all 14 scenes with Right Arrow
  const expectedTitles = [
    'Android home screen',
    'Open Monolog',
    'Open WhatsApp',
    'Polish and send a reply',
    'Dictate with Vox',
    'Set a reminder from the keyboard',
    'Ask AI while the chat stays open',
    'Capture context from Vox',
    'Write a journal note',
    'Use Incognito',
    'Find the saved detail',
    'Ask the journal and show the source',
    'Save a product while shopping',
    'Close on Today',
  ]

  for (let i = 0; i < expectedTitles.length; i++) {
    await expect(page.locator('#demo-progress')).toHaveText(`${String(i + 1).padStart(2, '0')} / 14`)
    await expect(page.locator('#demo-scene-title')).toHaveText(expectedTitles[i])

    const box = await page.locator('#demo-phone-stage').boundingBox()
    expect(Math.abs(box.x - phoneBox0.x)).toBeLessThan(1.5)
    expect(Math.abs(box.y - phoneBox0.y)).toBeLessThan(1.5)
    expect(Math.abs(box.width - phoneBox0.width)).toBeLessThan(1.5)
    expect(Math.abs(box.height - phoneBox0.height)).toBeLessThan(1.5)

    if (i === 5) {
      // Scene 6: reminder command must stay out of sent chat bubbles
      await expect(page.locator('.wa-outgoing')).toHaveCount(2)
      await expect(page.locator('#phone-viewport')).not.toContainText('Remind me to rehearse')
      await expect(page.locator('#phone-viewport')).toContainText('Reminder set · Today, 3:30 PM')
    }
    if (i === 6) {
      // Scene 7: AI insert leaves reply in draft for review
      await expect(page.locator('.wa-input-pill')).toContainText('Finalist check-in opens at 3:15 PM in Hall 2.')
    }
    if (i === 10) {
      // Scene 11: Library shows Room B capture and excludes incognito note
      await expect(page.locator('#phone-viewport')).toContainText('Judging moved to Demo Bay B')
      await expect(page.locator('#phone-viewport')).toContainText('They moved judging to Demo Bay B. Bring the HDMI adapter.')
      await expect(page.locator('#phone-viewport')).not.toContainText('worried I’ll rush the first minute')
    }
    if (i === 11) {
      // Scene 12: Journal answer, source card, and grounded recap
      await expect(page.locator('#phone-viewport')).toContainText('Demo Bay B in Hall 2. Judging starts at 4:00 PM.')
      await expect(page.locator('#phone-viewport')).toContainText('You set a 3:30 PM rehearsal reminder, saved the move to Demo Bay B, and wrote the pitch opening.')
      await expect(page.locator('#phone-viewport')).not.toContainText('worried I’ll rush the first minute')
      await expect(page.locator('#phone-viewport')).not.toContainText('Can we do one run-through')
    }
    if (i === 12) {
      await expect(page.locator('#phone-viewport')).toContainText('Spare USB-C hub')
      await expect(page.locator('#phone-viewport')).toContainText('₹2,499')
    }
    if (i === 13) {
      await expect(page.locator('#demo-finish-actions')).toBeVisible()
    }

    if (i < expectedTitles.length - 1) {
      await page.keyboard.press('ArrowRight')
    }
  }

  // Step backward with Left Arrow and verify state restoration
  await page.keyboard.press('ArrowLeft') // 13
  await expect(page.locator('#demo-progress')).toHaveText('13 / 14')
  await page.keyboard.press('ArrowLeft') // 12
  await page.keyboard.press('ArrowLeft') // 11
  await page.keyboard.press('ArrowLeft') // 10
  await expect(page.locator('#phone-viewport')).toContainText('Sensitive text detected')
  await expect(page.locator('#phone-viewport')).toContainText('My password is ••••••')

  // Verify stepping back over Send (04 -> 03) removes sent bubble, and Next button replays cleanly
  await page.getByRole('button', { name: 'Scenes' }).click()
  await page.locator('[data-jump-story="3"]').click() // 04
  await expect(page.locator('.wa-outgoing')).toHaveCount(1)
  await page.getByRole('button', { name: 'Previous scene' }).click() // 03
  await expect(page.locator('.wa-outgoing')).toHaveCount(0)
  await page.getByRole('button', { name: 'Next scene' }).click() // 04
  await expect(page.locator('.wa-outgoing')).toHaveCount(1)

  // Verify Restart
  await page.getByRole('button', { name: 'Restart' }).first().click()
  await expect(page.locator('#demo-progress')).toHaveText('01 / 14')
  await expect(page.locator('#demo-scene-title')).toHaveText('Android home screen')

  // Verify Speaker Notes toggle
  await page.getByRole('button', { name: 'Speaker notes' }).click()
  await expect(page.locator('#speaker-notes-panel')).toBeVisible()
  await expect(page.locator('#speaker-cue-text')).toContainText('hour before judging')

  // Verify Browse Features flow
  await page.getByRole('button', { name: 'Browse features' }).click()
  await page.locator('[data-jump-feature="0"]').click()
  await expect(page.locator('#demo-progress')).toHaveText('F1 / 07')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#demo-progress')).toHaveText('F2 / 07')
  await page.getByRole('button', { name: 'Browse features' }).click()
  await page.getByRole('button', { name: 'Back to pitch walkthrough' }).click()
  await expect(page.locator('#demo-progress')).toHaveText('01 / 14')

  expect(errors).toEqual([])
})

test('demo handles rapid arrow presses without duplicate messages and places nav below phone on mobile', async ({ page }) => {
  await page.goto('/demo')
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('ArrowRight')
  }
  await expect(page.locator('#demo-progress')).toHaveText('07 / 14')
  // Wait long enough for Scene 7 animation to complete cleanly
  await expect(page.locator('.wa-input-pill')).toContainText('Finalist check-in opens at 3:15 PM in Hall 2.', { timeout: 22000 })
  await expect(page.locator('.wa-outgoing')).toHaveCount(2)

  // Step back to 05 and replay 06
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#demo-progress')).toHaveText('05 / 14')
  await expect(page.locator('.wa-outgoing')).toHaveCount(2)

  // Mobile layout checks (390px and 320px)
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    const phoneBox = await page.locator('#demo-phone-stage').boundingBox()
    const navBox = await page.locator('.demo-nav-col').boundingBox()
    expect(navBox.y).toBeGreaterThanOrEqual(phoneBox.y + phoneBox.height - 2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
})
