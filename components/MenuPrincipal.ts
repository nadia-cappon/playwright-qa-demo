import { expect, type Locator, type Page } from '@playwright/test';
import { echapperRegex, libelleExact } from '../utils/texte';

/**
 * Composant « Menu principal » (en-tête), partagé par toutes les pages.
 * Fonctionne sur desktop ET sur mobile : sur mobile, il ouvre d'abord le menu hamburger.
 * → un même test de parcours tourne sur les deux projets sans duplication.
 */
export class MenuPrincipal {
  /** Le site contient deux menus (desktop / mobile) : on garde celui qui est affiché. */
  readonly racine: Locator;
  readonly boutonMobile: Locator;

  constructor(private readonly page: Page) {
    this.racine = page.getByRole('navigation', { name: 'Menu' }).filter({ visible: true }).first();
    // Locator proposé par Codegen (codegen/brut/menu-mobile.spec.ts)
    this.boutonMobile = page.getByRole('button', { name: 'Permuter le menu' }).filter({ visible: true });
  }

  /** Lien de premier niveau par son libellé, insensible à la casse. */
  lien(libelle: string): Locator {
    return this.racine.getByRole('link', { name: libelleExact(libelle) }).first();
  }

  /** Bouton (flèche) qui ouvre le sous-menu d'une rubrique : « Ouvrir Nos solutions ». */
  boutonSousMenu(libelle: string): Locator {
    return this.racine.getByRole('button', { name: new RegExp(echapperRegex(libelle)) });
  }

  /**
   * Lien d'une solution dans un sous-menu ouvert.
   * Chaque solution a DEUX liens : une icône (aria-label, sans texte) et le libellé texte.
   * On cible le lien qui porte le texte visible, celui que lit l'utilisateur (strict mode).
   */
  lienDuSousMenu(sousMenu: Locator, libelle: string): Locator {
    return sousMenu.getByRole('link', { name: new RegExp(`^${echapperRegex(libelle)}`) }).filter({ hasText: libelle });
  }

  async estMobile(): Promise<boolean> {
    return (await this.boutonMobile.count()) > 0;
  }

  /** Ouvre le menu hamburger ; l'attente sur aria-expanded garantit que le menu est prêt. */
  async ouvrirSurMobile(): Promise<void> {
    await this.boutonMobile.first().click();
    await expect(this.boutonMobile.first()).toHaveAttribute('aria-expanded', 'true');
  }

  /** Va vers une rubrique, en ouvrant le menu hamburger si on est sur mobile. */
  async allerA(libelle: string): Promise<void> {
    if (await this.estMobile()) await this.ouvrirSurMobile();
    await this.lien(libelle).click();
  }

  /**
   * Ouvre le sous-menu d'une rubrique comme un visiteur :
   * survol sur desktop, menu hamburger puis flèche sur mobile.
   * @returns le panneau du sous-menu (retrouvé par aria-controls, sans id codé en dur).
   * Le site duplique cet id (menu desktop + menu mobile) : on le cherche DANS le menu affiché.
   */
  async ouvrirSousMenu(libelle: string): Promise<Locator> {
    const bouton = this.boutonSousMenu(libelle);
    if (await this.estMobile()) {
      // Mobile : ouverture au clic, le sous-menu reste ouvert
      await this.ouvrirSurMobile();
      await bouton.click();
      await expect(bouton, `sous-menu « ${libelle} » ouvert`).toHaveAttribute('aria-expanded', 'true');
    } else {
      // Desktop : ouverture au SURVOL. Si la bannière cookies apparaît pendant le survol,
      // sa fermeture déplace la souris et referme le sous-menu : on survole à nouveau.
      await expect(async () => {
        await this.lien(libelle).hover();
        await expect(bouton).toHaveAttribute('aria-expanded', 'true', { timeout: 2_000 });
      }, `sous-menu « ${libelle} » ouvert`).toPass({ timeout: 15_000 });
    }
    const idPanneau = await bouton.getAttribute('aria-controls');
    return this.racine.locator(`[id="${idPanneau}"]`);
  }
}
