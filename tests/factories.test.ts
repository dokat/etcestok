import { describe, expect, it } from 'vitest';

import { createSuiviDraft } from '$lib/factories';
import { todayISO } from '$lib/dates';
import { suiviInputSchema } from '$lib/schema';

describe('createSuiviDraft', () => {
  it('produit un brouillon valide au regard du schéma', () => {
    expect(() => suiviInputSchema.parse(createSuiviDraft())).not.toThrow();
  });

  it('préremplit la date du jour, un rapport, non protégé, position « les deux », commentaire vide', () => {
    expect(createSuiviDraft()).toEqual({
      date: todayISO(),
      nombre: 1,
      protogene: false,
      position: 'les deux',
      commentaire: '',
    });
  });
});
