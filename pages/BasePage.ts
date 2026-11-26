import { expect, type Locator, type Page } from '@playwright/test';
import { MenuPrincipal } from '../components/MenuPrincipal';
import { WidgetAccessibilite } from '../components/WidgetAccessibilite';
import { BASE_URL } from '../data/environnement';
import { echapperRegex } from '../utils/texte';

/**
 * Socle de toutes les pages (Page Object Model + composants).
 * - Composition : chaque page CONTIENT le menu et le widget d'accessibilité.
 * - Chaque page décrit comment la reconnaître (URL, titre, élément clé) :
 *   c'est ce que vérifie l'assertion personnalisée expect(page).toEtreAffichee().
 * - Les assertions de résultat restent dans les tests.
 */
export abstract class BasePage {
  /** Chemin relatif à baseURL, ex. '/contact/' */
  abstract readonly chemin: string;
  /** Titre d'onglet attendu */
  abstract readonly titreAttendu: RegExp;

  readonly menu: MenuPrincipal;
  readonly widgetAccessibilite: WidgetAccessibilite;
  /** Lien du logo vers l'accueil, dans l'en-tête */
  readonly lienLogo: Locator;
  /**
   * Image du logo. Elle n'a pas de texte alternatif (ANO-04) : getByRole('img', { name })
   * est impossible, on la repère donc comme l'image du lien vers l'accueil.
   */
  readonly logo: Locator;
  readonly titrePrincipal: Locator;
  readonly racineHtml: Locator;
  readonly corps: Locator;

  constructor(readonly page: Page) {
    this.menu = new MenuPrincipal(page);
    this.widgetAccessibilite = new WidgetAccessibilite(page);
    // Remplace le fragile getByRole('link').nth(1) enregistré par Codegen
    this.lienLogo = page
      .locator(`[data-elementor-type="header"] a[href="${BASE_URL}/"]`)
      .filter({ visible: true })
      .first();
    this.logo = this.lienLogo.locator('img');
    this.titrePrincipal = page.getByRole('heading', { level: 1 });
    this.racineHtml = page.locator('html');
    this.corps = page.locator('body');
  }

  /** URL complète attendue (paramètres de requête et ancre tolérés). */
  get urlAttendue(): RegExp {
    return new RegExp(`^${echapperRegex(new URL(this.chemin, BASE_URL).href)}([?#].*)?$`);
  }

  /** Élément qui prouve que la page est utilisable (par défaut : le titre H1). */
  get elementCle(): Locator {
    return this.titrePrincipal.first();
  }

  /** Ouvre la page comme un vrai visiteur. Précondition : elle répond sans erreur HTTP. */
  async ouvrir(): Promise<this> {
    const reponse = await this.page.goto(this.chemin);
    expect(reponse?.status(), `statut HTTP de ${this.chemin}`).toBeLessThan(400);
    await this.simulerPresenceVisiteur();
    return this;
  }


  async recharger(): Promise<this> {
    await this.page.reload();
    await this.simulerPresenceVisiteur();
    return this;
  }

  /** Revient à l'accueil en cliquant sur le logo, comme un visiteur. */
  async revenirAlAccueilParLeLogo(): Promise<void> {
    await this.lienLogo.click();
  }

  /**
   * Le site retarde certains scripts (menus déroulants, widget d'accessibilité) jusqu'à la
   * première action d'un visiteur (souris, défilement). On reproduit ce comportement réel.
   */
  private async simulerPresenceVisiteur(): Promise<void> {
    await this.page.mouse.move(100, 200);
    await this.page.mouse.wheel(0, 50);
    await this.page.mouse.wheel(0, -50);
  }
}
