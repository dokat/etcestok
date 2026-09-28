import { z } from 'zod';

import { todayISO } from './dates';

/** Source de vérité du modèle (ADR 0002) : les types TypeScript sont dérivés, jamais écrits à la main. */

export const positionSchema = z.enum(['actif', 'passif', 'les deux']);

export type Position = z.infer<typeof positionSchema>;

const dateSchema = z
  .string()
  .date()
  .refine(value => value <= todayISO(), { message: 'La date ne peut pas être dans le futur' });

export const suiviSchema = z.object({
  id: z.number().int().optional(),
  date: dateSchema,
  nombre: z.number().int().min(1),
  protogene: z.boolean(),
  position: positionSchema,
  commentaire: z.string().optional(),
});

/** Un suivi sans id : ce qui est saisi par l'utilisateur (l'id vient de l'auto-incrémentation). */
export const suiviInputSchema = suiviSchema.omit({ id: true });

export type Suivi = z.infer<typeof suiviSchema>;
export type SuiviInput = z.infer<typeof suiviInputSchema>;
