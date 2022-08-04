import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('h1');
  await expect(page.locator('h1')).toContainText('NYC Showtimes Today!');
})

test('page title test', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('title');
  await expect(page.locator('title')).toContainText('NYC Showtimes');
})

test('background img visible test', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('img');
  await expect(page.locator('img')).toBeVisible();
})

test('background img src link test', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('img');
  await expect(page.locator('img')).toHaveAttribute('src', 'https://images.pexels.com/photos/2906882/pexels-photo-2906882.jpeg?cs=srgb&dl=pexels-anas-hinde-2906882.jpg&fm=jpg')
})

test('showtime text test', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('img');
  await expect(page.locator('p')).toBeVisible()
})