import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['Pixel 7'],
});

test('test', async ({ page }) => {
  await page.goto('https://www.antenia.com/');
  await page.getByRole('button', { name: 'Permuter le menu' }).click();
  await page.getByRole('button', { name: 'Non merci - Fermer sans' }).click();
  await page.getByText('Prenez le contrôle de vos').click();
  await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Contact' }).click();
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
  await expect(page.getByRole('button', { name: 'Envoyer votre demande' })).toBeVisible();
});