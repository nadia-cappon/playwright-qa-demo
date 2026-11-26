# Contexte pour Claude Code

Projet de démonstration d'automatisation de tests (Playwright + TypeScript, Page Object Model), assisté par IA.
Autrice : Nadia Cappon, QA Technico-Fonctionnelle / QA Data, ISTQB Foundation v4.
Site testé : https://www.antenia.com (production, site tiers). **Lire `documentation/00-prompt-projet.md`.**

## Périmètre
3 parcours, 10 tests : `tests/01-parcours-prospect.spec.ts` (desktop + mobile), `tests/02-accessibilite-widget.spec.ts`, `tests/03-formulaire-contact.spec.ts`. Garder la suite courte et lisible.

## Règles non négociables
- Ne JAMAIS soumettre le formulaire de contact avec des données valides. La fixture `gardeReseau` bloque tout POST : ne jamais la désactiver.
- Charges XSS / SQL : saisies uniquement, jamais envoyées.
- 2 workers au maximum, appels réseau séquentiels.

## Conventions
- Français pour le code, les commentaires et la documentation.
- POM optimisé : composants dans `components/` (MenuPrincipal, WidgetAccessibilite, FormulaireContact), pages dans `pages/` (héritent de `BasePage` et assemblent les composants). Aucun locator brut ni assertion de résultat dans les Page Objects ; aucun locator brut dans les tests.
- Les tests importent `test` / `expect` depuis `fixtures/fixtures.ts` (une fixture par page + `formulaireContact`).
- Le site retarde ses scripts (widget…) jusqu'à une action du visiteur : `BasePage.ouvrir()` / `recharger()` simulent cette présence.
- Locators, par ordre de priorité : `getByTestId` (testIdAttribute = `id`, uniquement sur les id STABLES) → `getByRole` → attributs stables. Interdits : XPath, `nth()`, classes CSS de mise en page, id générés (`e-n-menu-title-XXXX`).
- Après chaque ouverture ou navigation : `await expect(page).toEtreAffichee()` (fixtures/assertions.ts).
- Préconditions et postconditions dans des hooks : `depuisLaPageAccueil()` / `depuisLaPageContact()` (fixtures/hooks.ts). Pas de `goto` dans le corps des tests.
- Pas de répétition : nouvelles données → ajouter une ligne dans `data/` (parcourue avec `test.step`), pas un nouveau test.
- Données dans `data/`. Tests pilotés par les données avec une boucle `for`.
- Titre de test = ID du cas (`CT-XXX-NN`) + comportement attendu. Tags : @smoke @navigation @formulaire @securite @a11y @responsive.
- Anomalie connue : `anomalieConnue('ANO-xx')` + `annotation: anomalie('ANO-xx')` + `capturerPreuve()`.
- Pas de `waitForTimeout` : uniquement des assertions web-first. Pour ralentir une démo : `npm run demo` (slowMo dans playwright.demo.config.ts).
- Scripts Codegen bruts dans `codegen/brut/` : ne jamais les modifier ni les exécuter.

## Méthode de travail
- Avancer étape par étape et attendre la validation de Nadia.
- Expliquer le « pourquoi » de chaque choix (préparation d'entretien).
- Analyser un échec avec le Trace Viewer selon `documentation/prompts/03-analyse-echec.md`.

## Commandes
`npm test` · `npm run test:smoke` · `npm run test:mobile` · `npm run test:ui` · `npm run rapport` · `npm run typecheck`
