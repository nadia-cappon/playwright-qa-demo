import { defineConfig } from '@playwright/test';
import configDeBase from './playwright.config';

/**
 * Configuration de DÉMONSTRATION (entretien, présentation).
 * Ralentit chaque action du navigateur au lieu d'ajouter des waitForTimeout dans les tests :
 * les tests restent rapides et fiables en CI, et lisibles en démo.
 *
 * Utilisation :  npm run demo        (navigateur visible, ralenti)
 *                npm run demo:ui     (UI Mode, ralenti)
 */
export default defineConfig(configDeBase, {
  workers: 1, // un seul navigateur à la fois, pour suivre à l'écran
  timeout: 180_000, // les actions ralenties prennent plus de temps (3 min par test)
  use: {
    headless: false,
    launchOptions: {
      slowMo: Number(process.env.SLOWMO ?? 800), // pause de 800 ms entre chaque action
    },
  },
});
