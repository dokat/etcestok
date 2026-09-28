# ADR 0001: Stack technique et architecture

## Context

Développement d'une application web de suivi d'activité sexuelle pour la recherche, avec les contraintes suivantes :

- Stockage local (pas de serveur backend)
- Utilisation de Svelte + TypeScript + Tailwind CSS
- IndexedDB pour le stockage persistant
- Mode sombre/clair
- Zod comme source de vérité pour les types de données (validation runtime + inférence TypeScript)
- Dépendances basées sur les dernières versions stables disponibles
- Respect des bonnes pratiques TypeScript et Svelte, avec usage de patterns de conception là où ils apportent quelque chose

## Decision

**Stack frontend** (dernières versions stables, septembre 2026) :

- **Svelte 5** (^5.57) : runes (`$state`, `$derived`, `$props`) pour la réactivité
- **SvelteKit 2** (^2.66) : framework Svelte pour la structure du projet (Kit 3 est en release candidate, hors périmètre pour l'instant)
- **TypeScript** : typage statique pour la fiabilité
- **Tailwind CSS 4** (^4.3) : configuration CSS-first (`@theme`, pas de `tailwind.config.js`), via le plugin Vite `@tailwindcss/vite`
- **Vite** : tooling de build et dev server

**Bibliothèques**:

- **Zod** (^4.6) : source de vérité des types de données — les schémas Zod définissent les types (`z.infer`), la validation des formulaires et la validation à la lecture depuis IndexedDB
- **Dexie.js** : wrapper promise-based pour IndexedDB
- **@sveltejs/adapter-static** : pour build static (pas de serveur)
- **@tailwindcss/typography** : styling des textes

**Architecture**:

- **SvelteKit** : framework Svelte pour la structure du projet
- **Runes Svelte 5** : gestion d'état via `$state` / `$derived` dans des modules réactifs `*.svelte.ts` (remplace l'usage de stores `writable`/`derived`, réservé aux cas où une API compatible store est nécessaire)
- **Pattern Repository** : la persistance (Dexie/IndexedDB) est encapsulée derrière une interface ; le reste de l'application n'accède jamais à Dexie directement (voir plus bas)
- **Pages Svelte** : routing par fichier dans `src/routes/`

**Bonnes pratiques TypeScript & Svelte**:

- TypeScript en mode `strict` (dont `noUncheckedIndexedAccess`), pas de `any` ni d'assertion non-null `!` — narrowing et unions discriminées à la place
- Svelte 5 en mode runes : snippets à la place de `let:`, `$effect` uniquement pour les effets de bord externes, composants typés via `$props`
- Outils : `svelte-check` et `eslint-plugin-svelte` passés en CI

**Patterns appliqués** (là où ils réduisent le couplage ou améliorent la testabilité, pas par principe) :

- **Repository** : interface `SuiviRepository` (`add`, `update`, `delete`, `getAll`, `getByDate`) avec implémentation `DexieSuiviRepository` — swappable, testable avec un fake en mémoire
- **Factory** : `createSuiviDraft()` produit les valeurs vides du formulaire, cohérentes avec le schéma Zod
- **Provider (Context)** : thème et repository injectés via `setContext` / `getContext` plutôt qu'importés globalement
- **Observer / derived** : statistiques recalculées en réaction avec `$derived`, aucune synchronisation manuelle
- **Container / Presentational** : composants présentations pilotés uniquement par props et snippets ; logique regroupée dans les conteneurs et les modules réactifs

**Structure des données** : définie par le schéma Zod `Suivi` (voir ADR 0002, source de vérité). Le type TypeScript est dérivé via `z.infer<typeof Suivi>` ; aucun `interface` manuel. Le Dexie schema reste `suivis: '++id, date, nombre, protogene, position'`.

**Mode sombre/clair**:

- Tailwind `dark:` variant (stratégie par classe : `@custom-variant dark (&:where(.dark, .dark *));` requis en Tailwind 4, la variante par défaut étant liée à `prefers-color-scheme`)
- Stockage du préférence dans IndexedDB
- `prefers-color-scheme` comme fallback initial

## Consequences

**Positive**:

- Application légère et rapide (pas de serveur)
- Pas de dépendance externe pour le stockage
- Svelte génère du code optimisé
- TypeScript pour la maintainabilité
- Zod : une seule définition des données (type + validation), validations partageables entre formulaires et couche de persistance
- Repository + Provider : couche de persistance testable (fake en mémoire) et remplaçable sans toucher l'UI
- IndexedDB permet un stockage important (~50MB+)

**Negative**:

- Pas de synchronisation multi-appareils
- Pas de sauvegarde cloud (risque de perte de données)
- IndexedDB complexe à manipuler directement (Dexie aide beaucoup)
- Légère verbosité supplémentaire (interface repository, factories) — assumée pour la testabilité

**Neutral**:

- Build static possible (hébergement gratuit GitHub Pages)
- Pas de server-side rendering (SSR) nécessaire ici
- Pas d'authentification (pas de compte utilisateur)
