# Codegen : avant / après refactorisation

Codegen m'a permis d'enregistrer rapidement deux parcours réels (`codegen/brut/`). Ces scripts sont **conservés tels quels** comme preuve. Ce document montre pourquoi ils ne sont pas utilisables directement, et comment l'IA les a refactorisés en Page Object Model sous ma relecture.

> Le parcours « formulaire vide » (CT-FRM-02) a été enregistré dans le même fichier que la navigation vers Contact.

## Exemple 1 — Menu → Contact → formulaire vide (CT-PAR-01, CT-FRM-02)

### Avant : script brut Codegen (extrait de `navigation-contact.spec.ts`)

```ts
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
  // ...
});
```

### Après : Page Objects, composants et tests

Le parcours enregistré est devenu le **parcours 1** (`tests/01-parcours-prospect.spec.ts`), enrichi d'une offre métier, et le clic « Envoyer » à vide est devenu **CT-FRM-02** (`tests/03-formulaire-contact.spec.ts`).

```ts
// Hook depuisLaPageAccueil() : beforeEach ouvre l'accueil et vérifie qu'elle est affichée
test('CT-PAR-01 de l’accueil au formulaire de contact', async ({ accueilPage, solutionsPage, assuranceIardPage, contactPage }) => {
  await test.step('1. Ouvrir « Nos solutions » depuis le menu', async () => {
    await accueilPage.menu.allerA('Nos solutions');
    await expect(solutionsPage).toEtreAffichee();          // URL + titre + élément clé
  });
  await test.step('2. Découvrir l’offre « Assurance IARD »', async () => {
    await solutionsPage.decouvrirAssuranceIard();
    await expect(assuranceIardPage).toEtreAffichee();
  });
  await test.step('3. Aller sur « Contact » depuis le menu', async () => {
    await assuranceIardPage.menu.allerA('Contact');
    await expect(contactPage).toEtreAffichee();
  });
  // 4. Le formulaire est prêt à être rempli (sans l'envoyer)
});

// Hook depuisLaPageContact() : beforeEach ouvre la page, afterEach vérifie qu'on y est toujours
test('CT-FRM-02 un formulaire vide n’est pas envoyé', async ({ formulaireContact, gardeReseau }) => {
  await formulaireContact.cliquerEnvoyer();
  expect(await formulaireContact.estValide()).toBe(false);
  expect(await formulaireContact.messageDeValidation('nom')).not.toBe('');
  expect(gardeReseau, 'aucune requête de soumission').toEqual([]);
});
```

## Exemple 2 — Menu mobile (CT-PAR-01 en mobile)

### Avant (extrait de `menu-mobile.spec.ts`)

```ts
await page.getByRole('button', { name: 'Permuter le menu' }).click();
await page.getByRole('button', { name: 'Non merci - Fermer sans' }).click();
await page.getByText('Prenez le contrôle de vos').click();
await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Contact' }).click();
await page.getByText('Aller au contenu principal Offre IA Vous êtes Fermer Vous êtes Ouvrir Vous êtes').press('ArrowDown');
// ... la même ligne répétée 27 fois
await expect(page.getByRole('button', { name: 'Envoyer votre demande' })).toBeVisible();
```

### Après

Plus de test mobile séparé : le composant `MenuPrincipal` ouvre lui-même le menu hamburger quand il est affiché. **Le même test CT-PAR-01 est rejoué par le projet `mobile` (Pixel 7).**

```ts
async allerA(libelle: string): Promise<void> {
  if (await this.estMobile()) await this.ouvrirSurMobile();   // attend aria-expanded="true"
  await this.lien(libelle).click();
}
```

## Transformations appliquées et justification

| # | Script brut | Problème | Après refactorisation |
|---|---|---|---|
| 1 | `test('test', …)` | Aucune traçabilité | Titre = ID du cas + comportement attendu, et des tags |
| 2 | `page.goto('https://www.antenia.com/')` | URL en dur | `baseURL` + `ouvrir()`, qui vérifie aussi le statut HTTP |
| 3 | `getByRole('link').nth(1)` | Dépend de l'ordre des liens : casse au moindre ajout | Supprimé : le parcours passe par des liens nommés (`menu.allerA('…')`) |
| 4 | `locator('#e-n-menu-title-2187')` | Identifiant généré par le CMS : change à chaque publication | `menu.lien('…')` / `menu.allerA('…')` par le libellé, insensible à la casse |
| 5 | `.elementor-field-type-text.elementor-field-group…` | Chaîne de classes CSS de mise en page | `getByTestId('form-field-field_452f97a')` dans le composant, exposé en `formulaire.champs.societe` |
| 6 | `getByText('Aller au contenu principal Offre IA…').press('ArrowDown')` ×27 | Bruit : défilement clavier enregistré | Supprimé |
| 7 | Clics superflus (« Découvrir nos logiciels », « NEO Partner », texte de page) | Exploration, pas le parcours testé | Supprimés |
| 8 | « OK pour moi – Accepter » / « Non merci » | Clic dépendant de l'apparition de la bannière | Fixture `banniereCookies` (`addLocatorHandler`) qui **refuse** les cookies seulement si la bannière gêne |
| 9 | `toContainText('Envoyer votre demande')` sur le bouton | L'assertion ne vérifie pas le résultat attendu | Assertions alignées sur CT-FRM-02 : formulaire invalide, message de validation, URL inchangée, **aucun POST** |
| 10 | Clic sur « Envoyer » sans protection | Risque d'envoi réel en production | Fixture `gardeReseau` qui bloque et contrôle toute soumission |
| 11 | Locators répétés dans le test | Pas de réutilisation | Centralisés dans des **composants** (`MenuPrincipal`, `PiedDePage`, `FormulaireContact`) assemblés dans les pages : aucun locator brut dans les tests |
| 12 | `goto` dans chaque test | Code dupliqué | Hooks partagés `depuisLaPageAccueil()` / `depuisLaPageContact()` |
| 13 | Pas de vérification que la page est bien chargée | Un test peut agir sur une mauvaise page | `expect(page).toEtreAffichee()` : URL, titre, élément clé |
| 14 | Une valeur testée = un script | Répétition | Données dans `data/`, une `test.step` par valeur ; un seul test de parcours pour desktop et mobile |

## Ce que je retiens de Codegen

- **Points forts** : rapide, et il propose de bons locators sémantiques (`getByRole('form', { name: 'CONTACT' })`, `getByRole('button', { name: 'Envoyer votre demande' })`, `getByRole('button', { name: 'Permuter le menu' })`), conservés tels quels dans les Page Objects.
- **Limites** : il enregistre tout, y compris le bruit ; il produit des locators fragiles (`nth()`, id générés, classes CSS) et des assertions pauvres ; il n'a ni structure ni données externalisées.
- **Bonne pratique** : Codegen sert à **découvrir** les locators. Le code de production passe toujours par une refactorisation et une relecture.
