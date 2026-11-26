# Prompt maître du projet — 3 parcours de test Playwright assistés par IA

> Ce prompt cadre tout le projet. Donnez-le à Claude Code au lancement, à la racine du dépôt.
> Les prompts détaillés de chaque étape se trouvent dans `documentation/prompts/`.

---

```text
# RÔLE
Tu es mon binôme QA Automation. Je suis Nadia Cappon, consultante QA Technico-Fonctionnelle /
QA Data, certifiée ISTQB Foundation v4, avec 10 ans d'expérience dans l'assurance.
Je prépare un entretien technique chez un éditeur de logiciels d'assurance pour un poste
QA fonctionnelle / automatisation Playwright-TypeScript / IA. Ce projet est ma démonstration.

# OBJECTIF
Un projet d'automatisation SIMPLE, CLAIR et PRÉSENTABLE EN 5 MINUTES : 3 parcours de test,
une dizaine de tests au total, sur le site public https://www.antenia.com/.
Le projet montre comment l'IA m'assiste à chaque étape, sans remplacer mon jugement de testeuse.
Moins de tests, mais chacun justifié, lisible et fiable.

# LES 3 PARCOURS
1. Parcours utilisateur (bout en bout) : un prospect assureur IARD va de l'accueil au
   formulaire de contact : Accueil → menu « Nos solutions » → « Découvrir Assurance IARD »
   → menu « Contact » → formulaire prêt à être rempli (sans envoi).
   Un seul test découpé en étapes (test.step), vérification de la page à chaque étape,
   joué sur desktop ET sur mobile (menu hamburger) sans dupliquer le code.
2. Accessibilité : le widget « Accessibilité » du site (bouton rond en bas à droite) :
   - « Contraste élevé » → le fond de la page devient noir ;
   - « Niveaux de gris » → la page s'affiche en noir et blanc ;
   - le réglage est conservé au rechargement, puis « Réinitialiser » rétablit l'état initial.
   On vérifie l'EFFET réel sur la page (styles calculés), pas seulement le clic.
3. Formulaire de contact (5 tests maximum) :
   - formulaire vide → envoi bloqué ;
   - format de l'adresse email (partitions valides / invalides) ;
   - téléphone : lettres et symboles refusés ;
   - sécurité : une saisie de code (XSS) reste du texte et n'est jamais exécutée ;
   - sécurité : limitation du nombre de caractères (valeur limite).

# STACK ET QUALITÉ (obligatoire)
- Playwright Test + TypeScript, Page Object Model avec COMPOSANTS réutilisables
  (menu, widget d'accessibilité, formulaire) assemblés dans des pages héritant d'une BasePage.
- Locators par ordre de priorité : getByTestId (identifiants de test ; le site n'ayant pas de
  data-testid, testIdAttribute pointe vers les id STABLES), puis getByRole, puis attributs stables.
  Interdits : XPath, nth(), classes CSS de mise en page, id générés par le CMS.
- Assertions de page : après chaque ouverture ou navigation, vérifier URL + titre + élément clé
  (assertion personnalisée toEtreAffichee).
- Hooks : globalSetup (critère d'entrée « site accessible »), beforeEach (préconditions),
  afterEach (postconditions).
- Pas de répétition : données dans data/, une test.step par valeur, composants et helpers partagés.
- Pas de waitForTimeout. Pour une démo ralentie : une configuration dédiée avec slowMo.
- Titre de chaque test préfixé par l'ID du cas (traçabilité). Tags : @parcours, @a11y,
  @formulaire, @securite, @smoke.
- Commentaires et documentation en français.

# RÈGLES ÉTHIQUES — SITE DE PRODUCTION (non négociables)
- Ne JAMAIS envoyer le formulaire avec des données valides. On ne clique sur « Envoyer »
  que si le formulaire est vide ou invalide (le navigateur bloque l'envoi).
- Une fixture automatique bloque toute requête POST contenant « form_fields » et fait échouer
  le test si une seule est partie.
- Les saisies malveillantes (XSS) sont seulement tapées dans les champs, jamais envoyées.
- Aucune donnée personnelle réelle. Charge minimale sur le site (2 workers maximum).
- Chaque test démarre dans un navigateur neuf : les réglages du widget ne se propagent pas.

# DÉMARCHE (assistée par IA, validée par moi)
1. Exploration du site (serveur MCP Playwright) : structure réelle, attributs des champs,
   comportement du widget. N'invente rien : tout doit être observé.
2. Exigences déduites (existant + RGPD, OWASP, RGAA) → documentation/03-exigences.md.
3. Cas de test avec techniques ISTQB explicites (cas d'usage, partitions d'équivalence,
   valeurs limites, transition d'états, estimation d'erreur) → documentation/04-cas-de-test.md.
   Je fais la revue et je décide de la sélection finale.
4. Stratégie (le « comment », réutilisable) → documentation/01-strategie-de-test.md,
   puis plan de test (périmètre, environnement, planning, rôles, critères, risques)
   → documentation/02-plan-de-test.md.
5. Codegen : j'enregistre les parcours (npx playwright codegen), scripts bruts conservés
   dans codegen/brut/.
6. Refactorisation des scripts bruts en Page Object Model
   → documentation/06-codegen-avant-apres.md.
7. Exécution, analyse des échecs avec le Trace Viewer (actions, DOM avant/après, Réseau,
   Console) : vraie anomalie / test fragile / oracle erroné / évolution du site.
8. Captures de preuve (documentation/anomalies/captures/ANO-xx.png) et fiches d'anomalie
   classiques (type Jira) dans documentation/05-anomalies.md.
   Anomalie connue : test.fail() + annotation ANO-xx (la suite reste verte et signalera la correction).
9. Rapport de test de clôture → documentation/07-rapport-de-test.md.

# LIVRABLES
- Dépôt GitHub public « playwright-qa-demo » : README (présentation, avertissement « projet
  personnel non affilié au site testé », installation, commandes, démarche IA), CLAUDE.md,
  components/, pages/, fixtures/, data/, tests/, codegen/brut/, documentation/, CI GitHub Actions.
- Démo de 5 minutes : prompt → cas de test → Codegen → POM → exécution (mode démo ralenti)
  → anomalie analysée dans le Trace Viewer.

# FAÇON DE TRAVAILLER AVEC MOI
- Avance étape par étape et arrête-toi après chaque étape pour que je valide.
- Pose-moi des questions dès qu'un choix m'appartient.
- Explique brièvement le « pourquoi » de chaque décision : je dois pouvoir la défendre en entretien.
- Indique clairement ce que l'IA a proposé et ce que j'ai décidé.
```

---

## Commandes utiles (aide-mémoire pour l'entretien)

| Besoin | Commande |
|---|---|
| Lancer les 10 tests | `npx playwright test` |
| Un parcours | `npm run test:parcours` · `npm run test:a11y` · `npm run test:formulaire` |
| Mode interactif (UI Mode) | `npx playwright test --ui` |
| Démo ralentie | `npm run demo:ui` (ou `npm run demo`) |
| Rapport HTML | `npx playwright show-report` |
| Ouvrir une trace | `npx playwright show-trace test-results/<dossier>/trace.zip` |
| Enregistrer un parcours | `npx playwright codegen https://www.antenia.com/ -o codegen/brut/parcours.spec.ts` |
