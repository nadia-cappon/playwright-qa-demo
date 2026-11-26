import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.antenia.com/');
  await page.getByTestId('axeptio_btn_dismiss').click();
  await page.getByRole('button', { name: 'Options d\'accessibilité' }).click();
  await page.getByRole('checkbox', { name: 'Niveaux de gris' }).click();
  await page.getByRole('radio', { name: 'Contraste élevé' }).click();
  await page.getByRole('radio', { name: 'Contraste clair' }).click();
  await page.getByRole('radio', { name: 'Contraste sombre' }).click();
});