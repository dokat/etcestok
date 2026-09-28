# ADR 0004: Périmètre des statistiques et filtre de période

## Context

L'accueil affichait des « statistiques globales » (tous suivis confondus) incluant part
non protégée, position majoritaire et bornes de période. Le besoin exprimé est de pouvoir
consulter les statistiques **sur le dernier mois (en partant du jour courant), sur les
3 derniers mois, ou sur une période donnée**, et de limiter l'affichage à six indicateurs
de comptage.

Cet ADR révise la mention « statistiques globales » de l'ADR 0003 (page d'accueil).

## Decision

**Filtre de période** (trois modes, boutons sur la page d'accueil) :

1. **Dernier mois** : de `aujourd'hui − 1 mois` à aujourd'hui, bornes incluses — mode par défaut
2. **3 derniers mois** : de `aujourd'hui − 3 mois` à aujourd'hui, bornes incluses
3. **Période donnée** : deux champs de date (« À partir du » / « Jusqu'au ») ; une borne
   laissée vide = période ouverte de ce côté

Le calcul des périodes et le filtrage sont des **fonctions pures** de `src/lib/stats.ts`
(`periodePour`, `filtrerParPeriode`) ; le recalcul des mois repose sur `subMonthsISO`
(`src/lib/dates.ts`), qui borne le jour à la fin du mois cible (31 mars − 1 mois → 28 février).

**Indicateurs affichés** (cartes `StatCard`, sur la période sélectionnée uniquement) :

| Carte                 | Définition                                         |
| --------------------- | -------------------------------------------------- |
| Rapports au total     | somme de `suivi.nombre`                            |
| Rapports protégés     | somme de `suivi.nombre` avec `protogene = true`    |
| Rapports non protégés | somme de `suivi.nombre` avec `protogene = false`   |
| Rapports actifs       | somme de `suivi.nombre` où `position = 'actif'`    |
| Rapports passifs      | somme de `suivi.nombre` où `position = 'passif'`   |
| Rapports « les deux » | somme de `suivi.nombre` où `position = 'les deux'` |

Les compteurs sont **pondérés par `suivi.nombre`** : un suivi groupé de 3 rapports compte
pour 3 rapports. La notion de « jours avec suivi » et les indicateurs dérivés (part en
pourcentage, position majoritaire, première/dernière date) sont supprimés de `computeStats`
(élagués faute d'affichage, restaurables si besoin).

Le choix de mode n'est **pas persisté** : au rechargement, la page revient à « Dernier mois ».

## Consequences

**Positive**:

- Statistiques centrées sur des comptages bruts, sans indicateur dérivé interprétable
- Fonctions de filtrage pures et testées (Vitest), indépendantes de l'UI
- Les périodes ouvertes (borne vide côté personnalisé) couvrent « depuis le début » / « jusqu'à maintenant »

**Negative**:

- Filtrage effectué en mémoire sur la liste complète des suivis (non via index Dexie) —
  acceptable car les données sont peu nombreuses (voir ADR 0003)
- Le choix de mode n'est pas mémorisé entre deux visites
- Perte des anciens indicateurs (part non protégée, position majoritaire)

**Alternative considérée**:

- Requête Dexie par index `date` (`where('date').between(...)`) pour le filtrage de période
- **Rejeté** : le repository expose `getAll()` et l'état est déjà réactif en mémoire ; une
  requête par période ajouterait une API au repository pour un gain négligeable à ce volume
