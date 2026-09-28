# ADR 0003: Interface utilisateur et navigation

## Context

L'application doit permettre :

1. La saisie de suivis (groupée ou individuelle)
2. L'affichage par jour (calendrier ou liste)
3. La consultation de statistiques, filtrables par période (voir ADR 0004)
4. Le basculement mode sombre/clair

L'interface doit être simple, directe, et respecter les bonnes pratiques d'accessibilité.

## Decision

**Structure des pages** (SvelteKit routes) :

```
src/routes/
├── +page.svelte          # Page d'accueil (statistiques avec sélecteur de période, voir ADR 0004)
├── +page.server.js       # Pas de server load, juste +page.svelte
├── suivis/
│   └── +page.svelte      # Liste de tous les suivis
├── ajouter/
│   └── +page.svelte      # Formulaire d'ajout de suivi
│   └── +page.server.js   # Pas de server actions
└── parametres/
    └── +page.svelte      # Préférences (mode sombre/clair)
```

**Composants réutilisables** (présentationnels : pilotés par props et snippets, logique dans les conteneurs — voir ADR 0001) :

- `components/DateInput.svelte` : input de date
- `components/SuiviCard.svelte` : carte affichant un suivi
- `components/SuiviForm.svelte` : formulaire complet, validation portée par `suiviSchema` (Zod, voir ADR 0002)
- `components/ThemeToggle.svelte` : bouton bascule thème
- `components/StatCard.svelte` : carte de statistique

**Navigation** :

- Navigation principale en bas (mobile-first) ou sidebar (desktop)
- Liens : Accueil, Suivis, Ajouter, Paramètres
- Breadcrumb optionnel pour navigation en profondeur

**Mode sombre/clair** :

- Toggle dans les paramètres ou en haut de la page
- Persistance dans IndexedDB
- Fallback sur `prefers-color-scheme`
- Stratégie par classe (classe `dark` sur `<html>`), la variante `dark:` de Tailwind 4 étant liée à `prefers-color-scheme` par défaut (voir ADR 0001)

**Design system** (Tailwind) :

- Couleurs neutres pour mode clair
- Couleurs foncées pour mode sombre
- Texte lisible (contraste élevé)
- Boutons de taille touch (48px min)

## Consequences

**Positive**:

- Route claire et intuitive
- Composants réutilisables
- Responsive par défaut (mobile-first)
- Accessibilité facilitée par Tailwind

**Negative**:

- Pas de page de détail unique (les données sont simples)
- Pas de pagination (les données sont peu nombreuses)

**Alternative considérée**:

- Single page app avec onglets instead de routes multiples
- **Rejeté** : SvelteKit + pages séparées offre meilleur SEO et partageable
