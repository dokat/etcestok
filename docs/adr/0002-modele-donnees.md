# ADR 0002: Modèle de données et schéma IndexedDB

## Context

L'application doit stocker des suivis d'activité sexuelle avec les champs suivants :

- Date de l'acte
- Nombre de rapports
- Type de protection (protégé/non protégé)
- Position (actif, passif, ou les deux)
- Commentaire libre (facultatif)

Ces données doivent être persistantes (IndexedDB) et queryables par date.

**Zod est la source de vérité** : les types TypeScript sont dérivés des schémas Zod (`z.infer`), jamais définis manuellement. La même définition sert à la validation des formulaires et à la validation défensive à la lecture depuis IndexedDB.

Versions cible : Zod ^4.6 (voir ADR 0001).

## Decision

**Schéma Dexie**:

```typescript
const db = new Dexie('etcestokDB');
db.version(1).stores({
  suivis: '++id, date, nombre, protogene, position',
});
```

**Schémas Zod** (source de vérité, dans `src/lib/schema.ts`) :

```typescript
import { z } from 'zod';

export const positionSchema = z.enum(['actif', 'passif', 'les deux']);

export const suiviSchema = z.object({
  id: z.number().int().optional(), // absent à la création, géré par l'auto-increment
  date: z.string().date(), // ISO: YYYY-MM-DD
  nombre: z.number().int().min(1), // nombre de rapports (>= 1)
  protogene: z.boolean(), // true = protégé, false = non protégé
  position: positionSchema,
  commentaire: z.string().optional(), // note libre, facultative
});

// Le type TypeScript est dérivé du schéma — jamais défini manuellement
export type Position = z.infer<typeof positionSchema>;
export type Suivi = z.infer<typeof suiviSchema>;
```

**Indexation**:

- `++id` : clé primaire auto-incrementée
- `date` : index secondaire pour les requêtes par date
- `protogene` : index pour les filtres statistiques
- `position` : index pour les filtres par position

**Règles de validation** (portées par le schéma Zod, pas de validation manuelle) :

- `date` : `z.string().date()` (format YYYY-MM-DD) + `.refine()` pour rejeter les dates futures
- `nombre` : `z.number().int().min(1)`
- `protogene` : `z.boolean()`
- `position` : `z.enum([...])` — les 3 options possibles sont les seules valeurs acceptées
- `commentaire` : `z.string().optional()` — champ libre, non indexé, absent du schéma Dexie (aucune migration nécessaire : les attributs non indexés ne figurent pas dans la déclaration des stores)

**Utilisation de Zod**:

- **À l'écriture** : `suiviSchema.parse(suivi)` avant `db.suivis.add(...)` — la base ne contient que des données validées
- **À la lecture** : `suiviSchema.parse()` sur les enregistrements lus depuis IndexedDB (validation défensive contre les données corrompues ou d'un ancien schéma)
- **Dans les formulaires** : le même schéma pilote la validation côté UI (`safeParse` pour afficher les messages d'erreur)

**Opérations supportées** (exposées par le repository `SuiviRepository`, jamais par Dexie directement — voir pattern Repository dans l'ADR 0001) :

1. **Création** : `suivis.add(suivi)` → `db.suivis.add(suivi)`
2. **Lecture** : `suivis.getByDate(date)` → `db.suivis.where('date').equals(date).toArray()`
3. **Mise à jour** : `suivis.update(id, changes)` → `db.suivis.update(id, changes)`
4. **Suppression** : `suivis.delete(id)` → `db.suivis.delete(id)`
5. **Tous** : `suivis.getAll()` → `db.suivis.toArray()`

## Consequences

**Positive**:

- Schema clair et typé, une seule définition (schéma Zod) pour le type, la validation et les messages d'erreur
- Validation des formulaires et de la persistance partageant la même source de vérité
- Indexation sur date pour performances
- Validation déclarative simple à implémenter et à faire évoluer

**Negative**:

- Pas de normalisation (répétition des données)
- Pas de lien vers des entités externes (pas besoin ici)

**Alternative considérée**:

- Schema plus complexe avec tables séparées pour les positions
- **Rejeté** : trop complexe pour le besoin actuel
