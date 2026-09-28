# EtCestOk — suivi d'activité sexuelle pour la recherche

Application web de suivi d'activité sexuelle à des fins de recherche scientifique.

## Fonctionnalités

- ✅ Saisie de suivis (date, nombre, protection, position)
- ✅ Support saisie groupée et individuelle
- ✅ Affichage par jour
- ✅ Statistiques avec filtre de période (dernier mois, 3 derniers mois, période donnée)
- ✅ Historique complet
- ✅ Mode sombre/clair
- ✅ Stockage local IndexedDB
- ✅ Tests automatiques (Vitest)
- 🚧 Export des données (à faire)

## Stack technique

- **Svelte** + **TypeScript** + **Tailwind CSS** (v4)
- **IndexedDB** avec **Dexie.js**
- **Vite** (build tool)
- **SvelteKit** (framework)
- **Vitest** (tests)

## Installation

```bash
cd etcestok
npm install
```

## Développement

```bash
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser.

## Build pour production

```bash
npm run build
```

## Preview production

```bash
npm run preview
```

## Déploiement GitHub Pages

Le workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
construit et publie le site à chaque push sur `main` (déclenchement manuel possible).

1. Dans les réglages du dépôt : **Pages → Build and deployment → Source : GitHub Actions**
2. Pousser sur `main` (ou déclencher « Exécuter le workflow ») : le site est en ligne sur
   `https://<utilisateur>.github.io/etcestok/`

Le script `npm run build` fixe l'URL de base du site à `/etcestok` (`KIT_BASE_PATH`,
lu dans `svelte.config.js`) ; en développement, l'application est servie à la racine.
Les liens et la navigation utilisent `resolve()` de `$app/paths`, qui tient compte
de cette base dans les deux environnements.

## Tests

```bash
npm run test
```

## Structure du projet

```
etcestok/
├── src/
│   ├── lib/
│   │   ├── schema.ts                      # Schémas Zod (source de vérité des types)
│   │   ├── factories.ts                   # Pattern Factory (brouillon de formulaire)
│   │   ├── stats.ts                       # Statistiques (fonctions pures)
│   │   ├── dates.ts                       # Utilitaires de dates ISO
│   │   ├── context.ts                     # Pattern Provider (setContext/getContext)
│   │   ├── components/                    # Composants présentationnels
│   │   │   ├── Nav.svelte
│   │   │   ├── DateInput.svelte
│   │   │   ├── SuiviForm.svelte
│   │   │   ├── SuiviCard.svelte
│   │   │   ├── StatCard.svelte
│   │   │   └── ThemeToggle.svelte
│   │   ├── repositories/                  # Pattern Repository
│   │   │   ├── suiviRepository.ts         # Interface
│   │   │   ├── dexieSuiviRepository.ts    # Implémentation IndexedDB (Dexie)
│   │   │   ├── inMemorySuiviRepository.ts # Fake testable
│   │   │   ├── themeRepository.ts         # Préférence de thème persistée
│   │   │   └── db.ts                      # Instance Dexie (schéma v1)
│   │   └── state/                         # Modules réactifs (runes Svelte 5)
│   │       ├── suivis.svelte.ts           # SuivisController
│   │       └── theme.svelte.ts            # ThemeController
│   ├── routes/                            # Pages SvelteKit
│   │   ├── +page.svelte                   # Accueil (statistiques par période)
│   │   ├── suivis/                        # Liste de tous les suivis
│   │   ├── ajouter/                       # Formulaire d'ajout
│   │   ├── parametres/                    # Préférences (mode sombre/clair)
│   │   └── +error.svelte                  # Page d'erreur
│   ├── app.html
│   └── app.css                            # Tailwind 4 (config CSS-first)
├── tests/                                 # Tests Vitest
├── docs/adr/                              # Architecture Decision Records
├── package.json
├── svelte.config.js                       # adapter-static
├── vite.config.ts                         # Kit + plugin Tailwind + Vitest
└── tsconfig.json                          # strict + noUncheckedIndexedAccess
```

## ADRs

- [ADR 0001: Stack technique et architecture](docs/adr/0001-stack-technique.md)
- [ADR 0002: Modèle de données et schéma IndexedDB](docs/adr/0002-modele-donnees.md)
- [ADR 0003: Interface utilisateur et navigation](docs/adr/0003-interface-utilisateur.md)
- [ADR 0004: Périmètre des statistiques et filtre de période](docs/adr/0004-statistiques-et-filtre-de-periode.md)
- [Plan d'implémentation (état du projet)](docs/plan-implementation.md)

## License

MIT
