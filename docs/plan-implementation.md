# Plan d'implémentation — EtCestOk

> Document de suivi. Les décisions de fond vivent dans les [ADR](adr/) ; ce fichier
> garde la trace de **qui a été implémenté, quand et comment vérifié**.

## État

- **Socle complet (v0.1.0)** — 28 septembre 2026 ✅
- **Révision des statistiques (ADR 0004)** — 28 septembre 2026 ✅
- **Champ `commentaire` sur les suivis** — 28 septembre 2026 ✅
- **Déploiement GitHub Pages (workflow Actions)** — 28 septembre 2026 ✅

## Séance 1 — socle : décisions prises en séance (déjà reversées dans les ADR)

| #   | Décision                                                                                                  | ADR                                 |
| --- | --------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1   | Zod comme source de vérité des types (schémas + `z.infer`, aucune interface manuelle)                     | [0002](adr/0002-modele-donnees.md)  |
| 2   | Dépendances au dernier stable : zod ^4.6, svelte ^5.57, kit ^2.66, tailwind ^4.3                          | [0001](adr/0001-stack-technique.md) |
| 3   | Bonnes pratiques TS/Svelte + patterns (Repository, Factory, Provider, Container/Presentational, Observer) | [0001](adr/0001-stack-technique.md) |
| 4   | Runes Svelte 5 en remplacement des stores                                                                 | [0001](adr/0001-stack-technique.md) |
| 5   | Reprise du code à zéro selon les décisions ci-dessus                                                      | —                                   |
| 6   | Renommage du projet en **EtCestOk** (npm `etcestok`, base `etcestokDB`)                                   | [0002](adr/0002-modele-donnees.md)  |
| 7   | Suppression de `TEMPLATE.md` (l'historique vit dans les ADR)                                              | —                                   |

## Implémentation — socle (cartographie décision → code)

| Décision                                                   | Fichier(s)                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Schémas Zod source de vérité                               | `src/lib/schema.ts`                                                                   |
| Validation à l'écriture / lecture / formulaires            | `src/lib/repositories/dexieSuiviRepository.ts`, `src/lib/components/SuiviForm.svelte` |
| Pattern Repository (interface + Dexie + fake mémoire)      | `src/lib/repositories/`                                                               |
| Pattern Factory (`createSuiviDraft`)                       | `src/lib/factories.ts`                                                                |
| Pattern Provider (contexte thème + repository)             | `src/lib/context.ts`, composition root dans `src/routes/+layout.svelte`               |
| État réactif (runes `$state`/`$derived`)                   | `src/lib/state/*.svelte.ts`, statistiques via `$derived`                              |
| Persistance IndexedDB (schéma v1 : `suivis` + `settings`)  | `src/lib/repositories/db.ts`                                                          |
| Mode sombre par classe + persistance + fallback système    | `src/lib/state/theme.svelte.ts`, `src/app.css` (`@custom-variant dark`)               |
| Pages (accueil/stats, suivis, ajouter, paramètres, erreur) | `src/routes/`                                                                         |
| Navigation mobile (bas) / desktop (sidebar)                | `src/lib/components/Nav.svelte`                                                       |

## Vérifications effectuées (séance 1)

- `npm run check` : 0 erreur, 0 warning (strict + `noUncheckedIndexedAccess`)
- `npm run test` : 20 tests Vitest (schéma, factory, contrat repository, statistiques)
- `npm run lint` : Prettier propre
- `npm run build` : build static OK (`build/` : 4 pages HTML prérendues)
- Smoke test navigateur : montage SPA, ajout d'un suivi groupé (3 rapports, non protégé,
  actif), stats à jour (100 % non protégé), thème sombre persisté en IndexedDB, 0 erreur console

## Séance 2 — page de statistiques : décisions (reversées dans l'ADR 0004)

| #   | Décision                                                                                                                         | ADR                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 8   | Trois modes de période : dernier mois (défaut), 3 derniers mois, période donnée (bornes vides = période ouverte)                 | [0004](adr/0004-statistiques-et-filtre-de-periode.md) |
| 9   | Affichage limité à six cartes de comptage (total, protégés, non protégés, actif, passif, les deux), pondérées par `suivi.nombre` | [0004](adr/0004-statistiques-et-filtre-de-periode.md) |
| 10  | Élagage des indicateurs non affichés (`partNonProteges`, `positionMajoritaire`, `totalJours`, bornes de dates)                   | [0004](adr/0004-statistiques-et-filtre-de-periode.md) |

## Implémentation — statistiques (cartographie décision → code)

| Décision                                                             | Fichier(s)                |
| -------------------------------------------------------------------- | ------------------------- |
| Périodes et filtrage (`periodePour`, `filtrerParPeriode`), comptages | `src/lib/stats.ts`        |
| Calcul des périodes en mois (`subMonthsISO`)                         | `src/lib/dates.ts`        |
| Sélecteur de mode + champs « À partir du » / « Jusqu'au »            | `src/routes/+page.svelte` |

## Vérifications effectuées (séance 2)

- `npm run check` : 0 erreur, 0 warning
- `npm run test` : 27 tests Vitest (11 sur `stats.ts` : périodes, filtrage, comptages pondérés)
- `npm run lint` : Prettier propre
- `npm run build` : build static OK

## Implémentation — champ `commentaire` (cartographie décision → code)

| Décision                                                                | Fichier(s)                            |
| ----------------------------------------------------------------------- | ------------------------------------- |
| `commentaire` facultatif dans le schéma Zod (source de vérité)          | `src/lib/schema.ts`                   |
| Brouillon prérempli avec commentaire vide                               | `src/lib/factories.ts`                |
| Zone de texte « Commentaire (facultatif) » dans le formulaire           | `src/lib/components/SuiviForm.svelte` |
| Affichage du commentaire (s'il existe) sur la carte de suivi            | `src/lib/components/SuiviCard.svelte` |
| Sans index Dexie : aucune migration de base (`db.version(1)` inchangée) | `src/lib/repositories/db.ts`          |

## Vérifications effectuées (champ commentaire)

- `npm run check` : 0 erreur, 0 warning
- `npm run test` : 30 tests Vitest (commentaire accepté, facultatif, rejeté si non-chaîne)
- `npm run lint` : Prettier propre
- `npm run build` : build static OK

## Implémentation — déploiement GitHub Pages (cartographie décision → code)

| Décision                                                                                                | Fichier(s)                                     |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| CI (lint, check, tests) + build + publication Pages, moindres privilèges                                | `.github/workflows/deploy-pages.yml`           |
| Deux jobs : `build` (aucun droit d'écriture) puis `deploy` (`pages: write`, environment `github-pages`) | idem                                           |
| URL de base `/etcestok` au build (`KIT_BASE_PATH`), liens via `resolve()` de `$app/paths`               | `svelte.config.js`, `package.json`, composants |

## Points d'attention & suites possibles

- **SvelteKit 3** est en release candidate (sept. 2026) ; le passage de Kit 2 → 3 sera
  une nouvelle décision à documenter (ADR superseded par une 0004 le cas échéant).
- **Migration IndexedDB** : le renommage `activiteSexuelleDB` → `etcestokDB` est sans effet
  ici (aucune donnée réelle), mais toute évolution du schéma devra passer par
  `db.version(n)` avec migration explicite.
- **Export des données** : toujours à faire (signalé dans le README) — réduit le risque
  « perte de données » listé en conséquence négative de l'ADR 0001.
- **Tests de composants** : seuls les modules purs sont testés pour l'instant ; ajouter
  une suite de composants (jsdom) quand l'UI gagnera en surface.
- TypeScript 7 existe mais sort du spectre des peer deps de l'outillage (svelte-check) :
  rester sur `^6` tant que ce n'est pas supporté.
