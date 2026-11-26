import type { Locator, Page } from '@playwright/test';

export type NomChamp = 'nom' | 'prenom' | 'societe' | 'fonction' | 'email' | 'telephone' | 'message';

/** Identifiant de test (id stable) de chaque champ — voir testIdAttribute dans playwright.config.ts */
const ID_TEST: Readonly<Record<NomChamp, string>> = {
  nom: 'form-field-name',
  prenom: 'form-field-field_29a00d8',
  societe: 'form-field-field_452f97a',
  fonction: 'form-field-field_2675a2c',
  email: 'form-field-email',
  telephone: 'form-field-field_7efd3bb',
  message: 'form-field-message',
};

/**
 * Composant « Formulaire de contact ».
 * Priorité des locators : getByTestId (id stables) > getByRole.
 */
export class FormulaireContact {
  readonly racine: Locator;
  readonly boutonEnvoyer: Locator;
  readonly champs: Readonly<Record<NomChamp, Locator>>;

  constructor(page: Page) {
    // Pas d'id sur le formulaire ni sur le bouton : getByRole (locators proposés par Codegen)
    this.racine = page.getByRole('form', { name: 'CONTACT' });
    this.boutonEnvoyer = this.racine.getByRole('button', { name: 'Envoyer votre demande' });
    this.champs = Object.fromEntries(
      Object.entries(ID_TEST).map(([champ, id]) => [champ, this.racine.getByTestId(id)]),
    ) as Record<NomChamp, Locator>;
  }

  // ---------- Actions ----------

  async saisir(champ: NomChamp, valeur: string): Promise<this> {
    await this.champs[champ].fill(valeur);
    return this;
  }

  /** ⚠️ À n'utiliser QUE sur un formulaire invalide : le navigateur bloque alors l'envoi. */
  async cliquerEnvoyer(): Promise<void> {
    await this.boutonEnvoyer.click();
  }

  // ---------- Lectures d'état (les assertions restent dans les tests) ----------

  async valeur(champ: NomChamp): Promise<string> {
    return this.champs[champ].inputValue();
  }

  async longueur(champ: NomChamp): Promise<number> {
    return (await this.valeur(champ)).length;
  }

  /** Validation native du navigateur (required, type, pattern, maxlength). */
  async champEstValide(champ: NomChamp): Promise<boolean> {
    return this.champs[champ].evaluate((el) => (el as HTMLInputElement).checkValidity());
  }

  async messageDeValidation(champ: NomChamp): Promise<string> {
    return this.champs[champ].evaluate((el) => (el as HTMLInputElement).validationMessage);
  }

  async estValide(): Promise<boolean> {
    return this.racine.evaluate((f) => (f as HTMLFormElement).checkValidity());
  }
}
