# Rapport de test (clôture)

> Projet **playwright-qa-demo** — site testé : https://www.antenia.com (production)
> Période : 25 et 26/11/2026 — Rédigé par Nadia Cappon (QA), avec l'assistance de l'IA (Claude Code)
> Références : [stratégie](01-strategie-de-test.md) · [plan](02-plan-de-test.md) · [exigences](03-exigences.md) · [cas de test](04-cas-de-test.md) · [anomalies](05-anomalies.md)

## 1. Synthèse

| Indicateur | Résultat |
|---|---|
| Parcours testés | **3 / 3** |
| Tests exécutés | **9 / 9** (8 en desktop + le parcours 1 en mobile) |
| Résultat | **9 conformes, 0 échec inattendu** |
| Anomalies confirmées | **5** : 2 majeures (ANO-01, ANO-07), 3 mineures (ANO-02, ANO-06, ANO-05 hors automatisation) |
| Anomalies automatisées (`test.fail`) | 3 (ANO-01, ANO-02, ANO-06) + preuve automatique pour ANO-07 |
| Formulaires envoyés | **0** (garde réseau : aucune tentative détectée) |
| Échecs analysés pendant la mise au point | 7, tous classés **test fragile** et corrigés (aucun défaut du site masqué) |

**Avis de la QA** : les parcours prospect fonctionnent sur desktop et mobile. Les défauts trouvés portent sur la **qualité des données saisies** (téléphone, longueur) et sur l'**accessibilité** (widget). Les deux anomalies **majeures**, ANO-01 et ANO-07, sont à corriger en priorité.

## 2. Résultats par parcours

| Parcours | Test | Desktop | Mobile | Commentaire |
|---|---|---|---|---|
| **1. Parcours utilisateur** | CT-PAR-01 — de l'accueil au formulaire de démonstration (6 étapes) | ✅ | ✅ | Sous-menu « Nos solutions » vérifié (4 solutions) avec capture |
| **2. Accessibilité** | CT-A11Y-05 — contraste élevé, niveaux de gris, rechargement, réinitialisation | ✅ | — | Effets vérifiés par les styles calculés ; 4 captures jointes au rapport |
| | CT-A11Y-08 — contraste actif annoncé aux lecteurs d'écran | ✅ *(échec attendu)* | — | **ANO-06 confirmée** |
| **3. Formulaire de contact** | CT-FRM-02 — formulaire vide bloqué | ✅ | — | Aucune requête d'envoi |
| | CT-FRM-04 — format de l'email (6 valeurs) | ✅ | — | Valides acceptés, invalides refusés |
| | CT-FRM-08 — téléphone avec lettres ou symboles | ✅ *(échec attendu)* | — | **ANO-01 confirmée** |
| | CT-SEC-03 — saisie de code (XSS) | ✅ | — | Conservé comme texte, jamais exécuté |
| | CT-SEC-01 — 5 000 caractères dans « Nom » | ✅ *(échec attendu)* | — | **ANO-02 confirmée** (5 000 reçus pour 255 attendus) |

*« Échec attendu »* : test d'une anomalie connue, marqué `test.fail()`. Il est conforme tant que l'anomalie existe, et il signalera sa correction.

## 3. Anomalies

| ID | Titre | Gravité | Origine | Preuve |
|---|---|---|---|---|
| ANO-01 | Le champ Téléphone accepte des lettres et des symboles | Majeure | Exploration + automatisation | `ANO-01.png`, CT-FRM-08 |
| ANO-07 | En « Contraste élevé », le titre principal devient illisible (contraste ≈ 1,5:1) | Majeure | **Test exploratoire de la QA** | `ANO-07.png` (CT-A11Y-05, étape 3) |
| ANO-02 | Aucune limite de caractères sur les champs | Mineure | Exploration + automatisation | `ANO-02.png`, CT-SEC-01 |
| ANO-06 | Le contraste actif n'est pas annoncé aux lecteurs d'écran | Mineure | Exploration + automatisation | `ANO-06.png`, CT-A11Y-08 |
| ANO-05 | Emails `a@b` et `nadia..c@exemple.fr` acceptés | Mineure | Exploration (non automatisée) | Fiche |

Observations : OBS-01 (pas de captcha, pot de miel présent), OBS-02 (identifiants HTML en double), OBS-03 (deux liens par solution dans le sous-menu), OBS-04 (formulaire de démo nommé « demande formation »). Détails : [`05-anomalies.md`](05-anomalies.md).

## 4. Échecs analysés pendant la mise au point (Trace Viewer)

| # | Test | Symptôme | Cause | Classement | Correction |
|---|---|---|---|---|---|
| 1 | CT-PAR-01 | *Strict mode* : 2 liens « Assurance IARD » | Une icône et un texte pour chaque solution | Test fragile | Cibler le lien qui porte le texte (`filter({ hasText })`) |
| 2 | CT-PAR-01 | *Strict mode* sur la capture du sous-menu | `id` du panneau en double (menus desktop + mobile) | Test fragile | Chercher le panneau dans le menu affiché |
| 3 | CT-PAR-01 (desktop) | Sous-menu refermé | La bannière cookies surgit pendant le survol | Test fragile | Survol répété avec `toPass()` |
| 4 | CT-A11Y-05 | « Contraste élevé » introuvable | Choix masqués tant que la carte n'est pas activée | Test fragile | Clic sur la carte « Contraste », puis sur le choix |
| 5 | CT-A11Y-05 | Bouton du widget introuvable | Masqué tant que le panneau est ouvert | Test fragile | Fermer le panneau avant de vérifier |
| 6 | CT-A11Y-05 / 08 | Panneau refermé en cours de test | La bannière cookies apparaît en différé | Test fragile | Bannière (service tiers) bloquée dans le navigateur de test |
| 7 | CT-A11Y-05 (démo) | Délai dépassé | Mode ralenti (800 ms par action) | Configuration | Délai de démo porté à 3 minutes |

## 5. Critères de sortie

| Critère (plan de test) | Statut |
|---|---|
| 100 % des tests prévus exécutés | ✅ 9 / 9 |
| 0 échec inattendu | ✅ |
| Chaque anomalie avec fiche et preuve | ✅ (capture `ANO-07.png` produite à la prochaine exécution de CT-A11Y-05) |
| 0 test instable sur 3 exécutions | ⏳ à confirmer par 3 exécutions complètes (`npx playwright test --repeat-each=3`) |

## 6. Enseignements

- **Codegen** accélère la découverte des locators, mais ses scripts bruts sont fragiles (`nth()`, `id` générés, actions superflues). La refactorisation en Page Object Model est indispensable.
- **Le Trace Viewer** a permis de classer chaque échec sans supposition : 7 échecs, tous des tests fragiles, aucun défaut du site masqué.
- **Les tests exploratoires restent indispensables** : l'automatisation vérifiait « fond noir = OK », c'est l'œil de la QA qui a vu que la page était illisible (ANO-07).
- **L'IA** a accéléré l'exploration, la rédaction et la refactorisation. La QA a gardé la main sur le périmètre, les résultats attendus et chaque décision.

## 7. Recommandations

1. Corriger ANO-01 (motif du téléphone) et ANO-07 (couleur des titres en contraste élevé).
2. Ajouter des `maxlength` et une validation côté serveur (ANO-02, ANO-05).
3. Remonter ANO-06 à l'éditeur du widget d'accessibilité.
4. Rendre la suite plus robuste encore : 3 exécutions complètes, puis CI GitHub Actions à chaque modification.
