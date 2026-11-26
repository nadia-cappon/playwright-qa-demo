import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.antenia.com/contact/');
  await page.getByTestId('axeptio_btn_dismiss').click();
  await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Contact' }).click();
  await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Contact' }).click();
  await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Contact' }).click();
  await page.getByRole('button', { name: 'Envoyer votre demande' }).click();
  await page.locator('.elementor-field-type-text.elementor-field-group.elementor-column.elementor-field-group-field_452f97a').click();
});