import { test as base } from '@playwright/test';
import { expect } from './assertions';
import { AccueilPage } from '../pages/AccueilPage';
import { AssuranceIardPage } from '../pages/AssuranceIardPage';
import { DemoPage } from '../pages/DemoPage';
import { ContactPage } from '../pages/ContactPage';
import type { FormulaireContact } from '../components/FormulaireContact';

type Pages = {
  accueilPage: AccueilPage;
  assuranceIardPage: AssuranceIardPage;
  demoPage: DemoPage;
  contactPage: ContactPage;
  /** Raccourci vers le composant formulaire de la page Contact. */
  formulaireContact: FormulaireContact;
};

type Automatiques = {
  /** URLs des soumissions bloquées (doit rester vide). */
  gardeReseau: string[];
  banniereCookies: void;
};

export const test = base.extend<Pages & Automatiques>({
  /**
   * GARDE RÉSEAU (site de production)
   * Bloque toute requête POST du formulaire de contact, et fait échouer le test
   * si une seule a été tentée. Vérifiable dans le Trace Viewer, onglet Réseau.
   */
  gardeReseau: [
    async ({ page }, use) => {
      const tentatives: string[] = [];
      await page.route('**/*', async (route) => {
        const requete = route.request();
        if (requete.method() === 'POST' && (requete.postData() ?? '').includes('form_fields')) {
          tentatives.push(requete.url());
          await route.abort('blockedbyclient');
          return;
        }
        await route.fallback();
      });
      await use(tentatives);
      expect(tentatives, 'Aucune soumission du formulaire ne doit partir (site de production)').toEqual([]);
    },
    { auto: true },
  ],

  /**
   * BANNIÈRE COOKIES (Axeptio) : service TIERS, hors périmètre de test.
   * Elle apparaît en différé, s'anime et referme les menus ou le widget ouverts quand on la ferme :
   * on bloque son chargement dans le navigateur de test (aucun cookie n'est accepté).
   */
  banniereCookies: [
    async ({ page }, use) => {
      await page.route(/axept/i, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],

  accueilPage: async ({ page }, use) => use(new AccueilPage(page)),
  assuranceIardPage: async ({ page }, use) => use(new AssuranceIardPage(page)),
  demoPage: async ({ page }, use) => use(new DemoPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  formulaireContact: async ({ contactPage }, use) => use(contactPage.formulaire),
});

export { expect };
