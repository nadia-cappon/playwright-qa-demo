import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.antenia.com/');
  await expect(page.getByRole('link').nth(1)).toBeVisible();
  await page.getByTestId('axeptio_btn_dismiss').click();
  await page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-title-2183').click();
  await page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-title-2183').click();
  await page.getByRole('navigation', { name: 'Menu' }).getByText('Assurance IARD').click();
  await page.getByRole('link', { name: 'demander une démo' }).first().click();
  await expect(page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-content-2183')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-content-2183')).toBeVisible();
  await page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-content-2183').click();
  await expect(page.getByRole('button', { name: 'Envoyer votre demande' })).toBeVisible();
  await page.getByRole('link').nth(1).click();
  await expect(page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-content-2182')).toBeVisible();
  await page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-content-2182').click();
  await expect(page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-content-2182')).toBeVisible();
  await page.getByRole('navigation', { name: 'Menu' }).getByTestId('e-n-menu-content-2182').click();
  await page.getByRole('link', { name: 'Découvrir nos logiciels' }).click();
  await expect(page.getByTestId('apply-sec-hero')).toContainText('Découvrir nos logiciels');
});