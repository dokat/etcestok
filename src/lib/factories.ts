import { todayISO } from './dates';
import type { SuiviInput } from './schema';

/** Pattern Factory : valeurs initiales du formulaire, cohérentes avec le schéma Zod. */
export function createSuiviDraft(): SuiviInput {
  return {
    date: todayISO(),
    nombre: 1,
    protogene: false,
    position: 'les deux',
    commentaire: '',
  };
}
