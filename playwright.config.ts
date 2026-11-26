import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './data/environnement';

/**
 * Site de PRODUCTION : on reste poli (2 workers maximum, 1 en CI)
 * et aucun formulaire n'est envoyé (voir fixtures/fixtures.ts).
 */
export default defineConfig({
  testDir: './tests',
  // Les scripts bruts de Codegen (codegen/brut/) ne sont jamais exécutés.

  // Hook global (avant toute la suite) : critère d'entrée « site accessible »
  globalSetup: './global-setup.ts',

  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: BASE_URL,
    locale: 'fr-FR',
    // Le site n'expose pas de data-testid : getByTestId() s'appuie sur les id STABLES
    // des champs (ex. getByTestId('form-field-email') → [id="form-field-email"]).
    testIdAttribute: 'id',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
      // Seul le parcours utilisateur est rejoué sur mobile (menu hamburger)
      testMatch: /01-parcours-prospect\.spec\.ts/,
    },
  ],
});
