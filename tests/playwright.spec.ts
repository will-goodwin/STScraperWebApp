import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('h1');
  await expect(page.locator('h1')).toContainText('NYC');
})

test('ifc test', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.name');
  await expect(page.locator('.name')).toContainText('IFC');
})