import { expect as baseExpect } from '@playwright/test';
import type { BasePage } from '../pages/BasePage';

/**
 * Assertion personnalisée : expect(unePage).toEtreAffichee()
 * Vérifie en une ligne qu'une page est bien chargée et utilisable :
 *   1. URL attendue   2. titre d'onglet attendu   3. élément clé visible
 * Évite de répéter ces 3 assertions après chaque ouverture ou navigation.
 */
export const expect = baseExpect.extend({
  async toEtreAffichee(pageObjet: BasePage, options?: { timeout?: number }) {
    const nom = 'toEtreAffichee';
    const description = `${pageObjet.constructor.name} (${pageObjet.chemin})`;
    try {
      await baseExpect(pageObjet.page, 'URL attendue').toHaveURL(pageObjet.urlAttendue, options);
      await baseExpect(pageObjet.page, 'titre attendu').toHaveTitle(pageObjet.titreAttendu, options);
      await baseExpect(pageObjet.elementCle, 'élément clé visible').toBeVisible(options);
      return { pass: true, name: nom, message: () => `${description} est affichée` };
    } catch (erreur) {
      return {
        pass: false,
        name: nom,
        message: () => `${description} n'est pas affichée :\n${(erreur as Error).message}`,
      };
    }
  },
});
