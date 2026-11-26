# Playwright QA Demo — automatisation de tests assistée par IA

Projet de démonstration réalisé par **Nadia Cappon**, consultante QA Technico-Fonctionnelle / QA Data (ISTQB Foundation v4).

**Playwright · TypeScript · Page Object Model · Codegen · Trace Viewer · GitHub Actions**

> ⚠️ Projet personnel, **non affilié** à l'éditeur du site testé. Cas pratique : le site public https://www.antenia.com.
> Les tests sont **non intrusifs** : aucun formulaire n'est envoyé (une garde réseau bloque toute soumission), et la charge est minimale.

## La démarche

```
Exploration (IA + MCP) → Exigences → Cas de test (IA) → Revue QA → Codegen → Refactorisation POM
→ Exécution → Trace Viewer + captures → Fiches d'anomalie
```

| Étape | Document |
|---|---|
| Cadrage de l'IA | [`documentation/00-prompt-projet.md`](documentation/00-prompt-projet.md) |
| Stratégie de test (le « comment ») | [`documentation/01-strategie-de-test.md`](documentation/01-strategie-de-test.md) |
| Plan de test (le « quoi, quand, qui ») | [`documentation/02-plan-de-test.md`](documentation/02-plan-de-test.md) |
| Exigences | [`documentation/03-exigences.md`](documentation/03-exigences.md) |
| Cas de test | [`documentation/04-cas-de-test.md`](documentation/04-cas-de-test.md) |
| Fiches d'anomalie | [`documentation/05-anomalies.md`](documentation/05-anomalies.md) |
| Codegen avant / après | [`documentation/06-codegen-avant-apres.md`](documentation/06-codegen-avant-apres.md) |
| Rapport de test (clôture) | [`documentation/07-rapport-de-test.md`](documentation/07-rapport-de-test.md) |
| Prompts utilisés | [`documentation/prompts/`](documentation/prompts/) |

## Les 3 parcours testés (9 tests)

| # | Parcours | Fichier | Tests |
|---|---|---|---|
| 1 | **Parcours utilisateur** : un prospect assureur IARD va de l'accueil au formulaire de demande de démonstration (logo → sous-menu Nos solutions → Assurance IARD → Demander une démo → retour par le logo → Découvrir nos logiciels) | `tests/01-parcours-prospect.spec.ts` | 1 test en 6 étapes, joué en **desktop et mobile** |
| 2 | **Accessibilité** : widget d'accessibilité du site (contraste élevé, niveaux de gris, réglage conservé puis réinitialisé ; contraste actif non annoncé aux lecteurs d'écran) | `tests/02-accessibilite-widget.spec.ts` | 2 tests : le parcours en 6 étapes + l'anomalie ANO-06 |
| 3 | **Formulaire de contact** : formulaire vide, format de l'email, téléphone (ANO-01), XSS, longueur (ANO-02) | `tests/03-formulaire-contact.spec.ts` | 5 tests |

Les **anomalies connues** sont marquées `test.fail()` avec leur identifiant (ANO-xx) : la suite reste verte tant que l'anomalie existe, et signalera sa correction.

## Architecture : Page Object Model optimisé

- **Composition** : chaque page *contient* des composants (`menu`, `widgetAccessibilite`, `formulaire`). Un changement du menu se corrige à un seul endroit ; le menu gère seul le hamburger sur mobile, donc le même test de parcours tourne sur desktop et mobile.
- **Héritage** limité au socle commun (`BasePage` : ouverture « comme un visiteur », rechargement, URL et titre attendus).
- **Aucun locator d'interface dans les tests** (seule exception : la recherche d'un élément injecté par le test XSS) : les tests se lisent comme les cas de test (`formulaireContact.saisir('email', …)`).
- **Pas d'assertion dans les Page Objects** : ils exposent des locators, des actions et des lectures d'état. Les tests décident du résultat attendu.
- **API fluide** : les actions renvoient `this` (`await formulaire.saisir(…)` peut s'enchaîner).
- **Fixtures** : une par page + `formulaireContact`, garde réseau et cookies automatiques.

## Qualité des tests

| Principe | Mise en œuvre |
|---|---|
| **Locators par identifiant de test d'abord** | Le site n'expose aucun `data-testid`. `testIdAttribute: 'id'` (config) permet d'utiliser `getByTestId()` sur les **id stables** des champs (`form-field-email`…). Ordre de priorité : `getByTestId` → `getByRole` → attributs stables. Les id générés par le CMS (`e-n-menu-title-2187`) sont interdits. |
| **Assertions de page** | Assertion personnalisée `expect(page).toEtreAffichee()` : URL + titre d'onglet + élément clé visible. Elle est utilisée après chaque ouverture et chaque navigation. |
| **Hooks** | `globalSetup` (critère d'entrée : site accessible), hooks partagés `depuisLaPageAccueil()` / `depuisLaPageContact()` (`beforeEach` précondition ; `afterEach` postcondition « toujours sur Contact, rien n'a été envoyé » puis **retour à l'accueil par le logo** après chaque test), `beforeEach` d'ouverture du widget. |
| **Pas de répétition** | Données dans `data/` parcourues par `test.step` (une étape par valeur), un test de parcours partagé desktop/mobile, composants POM, helpers `anomalieConnue()` / `capturerPreuve()`. |

## Structure

```
components/     Composants réutilisables (MenuPrincipal, WidgetAccessibilite, FormulaireContact)
pages/          Page Objects (BasePage, AccueilPage, AssuranceIardPage, DemoPage, ContactPage)
fixtures/       Fixtures (pages, garde réseau, cookies), assertion toEtreAffichee, hooks partagés
global-setup.ts Hook global : critère d'entrée « site accessible »
data/           Jeux de données (tests pilotés par les données)
tests/          Specs Playwright
utils/          Captures de preuve, outils de texte
codegen/brut/   Enregistrements Codegen d'origine (non exécutés)
documentation/  Stratégie, exigences, cas de test, anomalies, prompts
```

## Lancer les tests

```bash
npm install
npx playwright install chromium

npm test                 # toute la suite (desktop + mobile)
npm run test:parcours    # parcours 1 (desktop + mobile)
npm run test:a11y        # parcours 2
npm run test:formulaire  # parcours 3
npm run test:smoke       # tests critiques
npm run test:mobile      # responsive
npm run test:ui          # mode interactif
npm run test:headed      # navigateur visible
npm run parcours:headed  # parcours 1 avec navigateur visible
npm run demo             # démo : navigateur visible et ralenti (slowMo 800 ms)
npm run demo:ui          # démo en UI Mode, ralentie
npm run rapport          # rapport HTML

npx playwright test --trace on                        # trace complète (démo)
npx playwright show-trace test-results/<test>/trace.zip
npx playwright codegen https://www.antenia.com/        # enregistrer un parcours
```

## Rôle de l'IA (et ses limites)

- L'IA (Claude Code + Playwright MCP) a exploré le site, proposé les exigences, généré les cas de test et refactorisé les scripts Codegen.
- **La QA a tranché** : exigences validées, 2 cas modifiés (oracle fixé), 2 cas rejetés (envoi réel en production interdit).
- Aucun locator inventé : tous viennent du vrai DOM ou de Codegen.
