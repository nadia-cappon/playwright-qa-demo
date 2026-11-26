# Fiches d'anomalie

> Constats sur https://www.antenia.com (25/11/2026). Aucun formulaire n'a été envoyé ; la validation côté serveur n'a pas été testée.
> Les anomalies automatisées sont marquées `test.fail()` : elles sont confirmées à chaque exécution, avec une capture dans `anomalies/captures/`.

| ID | Titre | Gravité | Priorité | Statut | Test |
|---|---|---|---|---|---|
| ANO-01 | Contact – Le champ Téléphone accepte des lettres et des symboles | Majeure | P2 | Confirmée (automatisée) | CT-FRM-08 |
| ANO-02 | Contact – Aucune limite de caractères sur les champs | Mineure | P3 | Confirmée (automatisée) | CT-SEC-01 |
| ANO-06 | Widget d'accessibilité – Le contraste actif n'est pas annoncé aux lecteurs d'écran | Mineure | P3 | **Confirmée** (automatisée, 26/11/2026) | CT-A11Y-08 |
| ANO-07 | Widget d'accessibilité – En « Contraste élevé », le titre principal devient illisible (bleu nuit sur fond noir) | Majeure | P2 | **Confirmée** (test exploratoire de la QA, preuve automatique) | CT-A11Y-05 (capture) |

**Autres constats (exploration, non automatisés)** : ANO-03 coquille « Mention légales » dans le pied de page ; ANO-04 lien du logo sans intitulé accessible ; ANO-05 emails `a@b` et `nadia..c@exemple.fr` acceptés (conforme au standard HTML : une validation côté serveur est recommandée) ; OBS-01 pas de captcha, mais un champ « pot de miel » anti-spam est présent ; OBS-02 **identifiants HTML en double** : le menu existe deux fois dans la page (desktop et mobile) avec les mêmes `id` (ex. `e-n-menu-content-2183`), ce qui rend le HTML invalide et a provoqué un *strict mode violation* dans CT-PAR-01 (corrigé en cherchant le panneau dans le menu affiché) ; OBS-03 chaque solution du sous-menu a **deux liens** vers la même page (une icône avec `aria-label`, puis le texte) ; OBS-04 le formulaire de demande de démonstration porte le nom technique « demande formation ».

---

## ANO-01 — Contact – Le champ Téléphone accepte des lettres et des symboles

| Champ | Valeur |
|---|---|
| Type | Anomalie fonctionnelle (validation de saisie) |
| Environnement | Production – /contact/ – Chromium (Playwright), desktop |
| Gravité / Priorité | Majeure / P2 |
| Exigence / Test | EX-FRM-04 / CT-FRM-08 |
| Statut | Confirmée (26/11/2026) |

**Étapes** : saisir `06abc` (ou `abcdefgh`, `<>`) dans « Téléphone ».
**Résultat attendu** : champ invalide ; le `pattern` n'autorise que des chiffres et `()#&+*-=.`.
**Résultat obtenu** : le champ est considéré comme valide.
**Cause probable** : dans `[0-9()#&+*-=.]+`, le tiret n'est pas échappé dans la classe de caractères. Les navigateurs récents compilent les `pattern` avec le drapeau `v`, qui rend ce motif invalide : il est donc **ignoré**.
**Correctif suggéré** : `pattern="[0-9()#&+*=.\-\s]+"`.
**Impact** : numéros inexploitables dans le CRM.
**Preuve** : `anomalies/captures/ANO-01.png`, trace du test CT-FRM-08.

## ANO-02 — Contact – Aucune limite de caractères sur les champs

| Champ | Valeur |
|---|---|
| Type | Sécurité / validation des entrées |
| Environnement | Production – /contact/ – Chromium, desktop |
| Gravité / Priorité | Mineure / P3 |
| Exigence / Test | EX-SEC-01 / CT-SEC-01 |
| Statut | Confirmée (26/11/2026) |

**Étapes** : saisir 5 000 caractères dans « Nom ».
**Résultat attendu** : saisie limitée à 255 caractères.
**Résultat obtenu** : 5 000 caractères acceptés ; aucun champ n'a d'attribut `maxlength`.
**Impact** : spam volumineux, données hors format en base (recommandation OWASP).
**Correctif suggéré** : `maxlength` sur chaque champ, et un contrôle équivalent côté serveur.
**Preuve** : `anomalies/captures/ANO-02.png`.

## ANO-06 — Widget d'accessibilité – Le contraste actif n'est pas annoncé aux lecteurs d'écran

| Champ | Valeur |
|---|---|
| Type | Accessibilité |
| Environnement | Production – widget « Accessibilité » (Ally by Elementor), toutes les pages |
| Gravité / Priorité | Mineure / P3 |
| Exigence | EX-A11Y-04 |
| Statut | **Confirmée** le 26/11/2026 par CT-A11Y-08 (résultat obtenu : `aria-checked="false"` alors que le fond est noir) |

**Étapes** : ouvrir le widget, puis activer « Contraste » (ou « Contraste élevé »).
**Résultat attendu** : l'option active a `aria-checked="true"` (RGAA 7.1, WCAG 4.1.2 : l'état d'un composant doit être restitué).
**Résultat obtenu** : l'effet est appliqué (fond noir), mais « Par défaut » reste `aria-checked="true"` et l'option choisie reste à `false`.
**Remarque** : la case « Niveaux de gris » met bien son état à jour (vérifié par CT-A11Y-06).
**Correctif suggéré** : mettre à jour `aria-checked` du groupe Contraste (composant tiers : à remonter à l'éditeur du widget).
**Preuve** : `anomalies/captures/ANO-06.png` (panneau en contraste élevé), trace du test CT-A11Y-08.

## ANO-07 — Widget d'accessibilité – En « Contraste élevé », le titre principal devient illisible

| Champ | Valeur |
|---|---|
| Type | Accessibilité (contraste) |
| Environnement | Production – page d'accueil – widget « Accessibilité », desktop |
| Gravité / Priorité | Majeure / P2 |
| Exigence | EX-A11Y-04 |
| Détection | **Test exploratoire de la QA** pendant l'enregistrement Codegen (page « complètement noire »), puis mesure par l'IA |
| Statut | **Confirmée** le 26/11/2026 : observée manuellement par la QA, puis reproduite par le parcours automatisé CT-A11Y-05 (étape 3) |

**Étapes** : ouvrir le widget, puis choisir « Contraste élevé ».
**Résultat attendu** : tous les textes restent lisibles, avec un contraste d'au moins **4,5:1** (WCAG 1.4.3, RGAA 3.2). C'est justement le but de cette option.
**Résultat obtenu** : le fond devient noir `rgb(0, 0, 0)`, les paragraphes passent en blanc, mais **le titre H1 reste bleu nuit `rgb(3, 49, 71)`**. Le contraste est d'environ **1,5:1** : le titre est quasi invisible. L'utilisatrice a eu l'impression d'une page entièrement noire.
**Impact** : l'option destinée aux personnes malvoyantes rend la page moins lisible.
**Correctif suggéré** : forcer la couleur des titres en mode contraste élevé (styles du widget ou du thème).
**Preuves** : `anomalies/captures/ANO-07.png` (titre en contraste élevé, capturé à chaque exécution de CT-A11Y-05) ; capture plein écran « 2-contraste-eleve » dans le rapport HTML Playwright ; onglet *After* de l'étape « 3. Contraste élevé » dans l'UI Mode.
**Leçon** : l'automatisation vérifiait « fond noir = OK » ; c'est l'observation humaine (« la page est toute noire ») qui a révélé le défaut de lisibilité. Les tests exploratoires restent indispensables à côté de l'automatisation.
