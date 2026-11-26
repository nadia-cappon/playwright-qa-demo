# Stratégie de test — le « comment »

> Projet personnel de démonstration, réalisé par Nadia Cappon (QA Technico-Fonctionnelle / QA Data, ISTQB Foundation v4).
> Non affilié à l'éditeur du site testé.
> **Stratégie** = l'approche générale, réutilisable sur d'autres projets. Le **plan de test** ([`02-plan-de-test.md`](02-plan-de-test.md)) l'applique à ce projet.

## 1. Approche basée sur les risques

On teste en priorité ce qui coûterait le plus cher en cas de défaut. Le nombre de tests est volontairement limité : **chaque test est justifié par un risque**.

| Risque | Conséquence | Priorité | Réponse de test |
|---|---|---|---|
| Parcours prospect cassé | Perte de clients potentiels | P1 | Parcours utilisateur de bout en bout |
| **Site inutilisable sur téléphone** | Une grande partie des visiteurs consulte le site sur mobile : un menu ou un parcours bloqué sur téléphone fait **perdre ces prospects et leurs demandes** (données commerciales perdues) | **P1** | **Test responsive** : le parcours utilisateur est rejoué sur mobile (menu hamburger, écran tactile) |
| Formulaire qui accepte des données fausses | CRM pollué, prospects impossibles à recontacter | P1 | Partitions d'équivalence, valeurs limites |
| Faille de sécurité dans les saisies | Injection de code, spam | P1 | Estimation d'erreur (OWASP) |
| Outil d'accessibilité inopérant | Exclusion d'utilisateurs, obligation légale, image de marque | P2 | Vérification des effets réels du widget |

## 2. Niveaux et types de test

| Niveau / type | Application |
|---|---|
| Test système, **bout en bout** | Parcours utilisateur complets, sur le site réel |
| Test **fonctionnel** | Validation des saisies du formulaire |
| Test **non fonctionnel** | Accessibilité (widget), sécurité côté client (XSS, longueur) |
| Test de **compatibilité (responsive)** | Les parcours critiques sont joués sur desktop **et** sur mobile (émulation d'un téléphone : petit écran, tactile, menu hamburger), avec le **même code de test** |
| Test de **régression** | La suite automatisée est rejouée à chaque modification (CI GitHub Actions) |

## 3. Techniques de conception (ISTQB)

| Technique | Usage type |
|---|---|
| Test basé sur les cas d'usage | Parcours utilisateur, découpé en étapes vérifiées une à une |
| Partitions d'équivalence | Classes valides / invalides d'une saisie (email, téléphone) |
| Analyse des valeurs limites | Formulaire vide, longueur maximale d'un champ |
| Transition d'états | Réglage activé → conservé au rechargement → réinitialisé |
| Estimation d'erreur (OWASP) | Saisies malveillantes (XSS) |

## 4. Automatisation

- **Outil** : Playwright Test + TypeScript.
- **Architecture** : Page Object Model avec **composants réutilisables** (menu, widget, formulaire) assemblés dans des pages héritant d'une `BasePage`. Aucune assertion de résultat dans les Page Objects.
- **Locators** : `getByTestId` sur des identifiants stables, puis `getByRole`. Interdits : XPath, `nth()`, classes CSS de mise en page, identifiants générés.
- **Fiabilité** : assertions web-first (pas de `waitForTimeout`), vérification de chaque page après une navigation (`toEtreAffichee`), hooks pour les préconditions et postconditions (dont un retour à l'accueil après chaque test), `toPass` pour les interactions qu'un événement extérieur peut interrompre. Les **services tiers hors périmètre** qui perturbent les tests (bannière cookies) sont **bloqués** dans le navigateur de test plutôt que contournés à chaque test.
- **Pas de répétition** : données dans `data/`, une étape par valeur, un même test pour desktop et mobile.
- **Création** : enregistrement avec **Codegen** par la QA, puis refactorisation en Page Object Model.

## 5. Rôle de l'IA et garde-fous

| L'IA… | La QA… |
|---|---|
| explore le site, propose exigences et cas de test, refactorise le code, propose un classement des échecs | décide du périmètre, fixe les résultats attendus (l'oracle), valide chaque étape, tranche sur chaque échec |

- Aucun locator inventé : tout vient du DOM réel ou de Codegen, puis est confirmé par une exécution.
- Aucune donnée sensible dans les prompts.
- Chaque décision de la QA est tracée dans la documentation.

## 6. Analyse des échecs et anomalies

Chaque échec est analysé dans le **Trace Viewer** (actions, page avant / après, réseau, console) et classé : **vraie anomalie**, **test fragile**, **résultat attendu erroné** ou **évolution du site**. Une anomalie confirmée donne lieu à une fiche (type Jira) avec une capture de preuve, et reste automatisée avec `test.fail()`.

## 7. Éthique sur un site de production

Aucune soumission de formulaire (garde réseau automatique), saisies malveillantes jamais transmises, aucune donnée personnelle réelle, charge minimale. Les tests intrusifs (sécurité serveur, charge) exigent une autorisation écrite et un environnement de test.
