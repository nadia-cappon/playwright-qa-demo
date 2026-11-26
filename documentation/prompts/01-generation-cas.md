# Prompt 1 — Génération des cas de test à partir des exigences

Utilisé avec Claude (Claude Code), après l'exploration du site via Playwright MCP.

```text
Tu es un ingénieur QA certifié ISTQB. À partir des exigences ci-dessous (docs/03-exigences.md)
et de l'exploration du formulaire /contact/ (attributs HTML relevés), génère des cas de test.

Contraintes :
- Applique explicitement les techniques : partitions d'équivalence, valeurs limites,
  table de décision, estimation d'erreur (référentiel OWASP pour la sécurité).
- Une ligne par cas, format tableau Markdown :
  ID | Exigence | Cas de test | Technique | Données | Résultat attendu | Priorité
- Le résultat attendu doit être vérifiable automatiquement (oracle précis).
- Site de PRODUCTION : aucun cas ne doit nécessiter l'envoi réel du formulaire.
  Si un cas en a besoin, liste-le à part avec la mention « hors périmètre ».
- N'invente aucun comportement : si tu n'es pas sûr du résultat attendu,
  marque le cas « à valider par la QA ».
- Données de test fictives uniquement.
```

## Ce que la revue a corrigé

- L'IA considérait `a@b` comme invalide. C'est faux au regard du standard HTML : le cas a été requalifié en observation (CT-FRM-06).
- L'IA proposait un cas de temps de chargement : rejeté, car il n'est pas fiable sur un site de production.
- Ajout par la QA du contrôle réseau « aucune requête POST » (CT-SEC-05).
