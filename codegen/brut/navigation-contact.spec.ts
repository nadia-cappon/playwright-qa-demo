import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.antenia.com/');
  await page.getByRole('link').nth(1).click();
  await page.getByRole('button', { name: 'OK pour moi - Accepter les' }).click();
  await page.getByRole('link', { name: 'Découvrir nos logiciels' }).click();
  await page.getByRole('link', { name: 'NEO Partner Un portail dédi' }).click();
  await page.getByRole('navigation', { name: 'Menu' }).locator('#e-n-menu-title-2187').click();
  await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Contact' }).click();
  await page.getByRole('button', { name: 'Envoyer votre demande' }).click();
  await expect(page.getByRole('form', { name: 'CONTACT' }).getByRole('button')).toContainText('Envoyer votre demande');
  await page.getByRole('button', { name: 'Envoyer votre demande' }).click();
  await page.locator('.elementor-field-type-text.elementor-field-group.elementor-column.elementor-field-group-field_452f97a').click();
  await expect(page.getByRole('navigation', { name: 'Menu' }).getByLabel('Fermer Nos solutions Ouvrir')).toBeVisible();
  await page.getByRole('navigation', { name: 'Menu' }).getByLabel('Fermer Nos solutions Ouvrir').click();
  await page.getByRole('button', { name: 'Envoyer votre demande' }).click();
  await page.locator('.elementor-field-type-text.elementor-field-group.elementor-column.elementor-field-group-field_452f97a').click();
  await page.getByRole('link').nth(1).click();
});