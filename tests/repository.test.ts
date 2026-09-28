import { describe, expect, it } from 'vitest';

import { InMemorySuiviRepository } from '$lib/repositories/inMemorySuiviRepository';
import type { SuiviRepository } from '$lib/repositories/suiviRepository';
import { createSuiviDraft } from '$lib/factories';

/**
 * Contrat du repository, exécuté contre le fake en mémoire.
 * L'implémentation Dexie doit se comporter à l'identique (mêmes validations).
 */
function contrat(nom: string, factory: () => SuiviRepository): void {
  describe(nom, () => {
    it('ajoute puis relit un suivi avec id auto-incrémenté', async () => {
      const repo = factory();
      const id = await repo.add(createSuiviDraft());
      const all = await repo.getAll();
      expect(id).toBeGreaterThan(0);
      expect(all).toHaveLength(1);
      expect(all[0]?.id).toBe(id);
    });

    it('rejette une saisie invalide à l’écriture', async () => {
      const repo = factory();
      await expect(repo.add({ ...createSuiviDraft(), nombre: 0 })).rejects.toThrow();
      expect(await repo.getAll()).toHaveLength(0);
    });

    it('filtre par date', async () => {
      const repo = factory();
      await repo.add({ ...createSuiviDraft(), date: '2026-01-05' });
      await repo.add({ ...createSuiviDraft(), date: '2026-01-06' });
      await repo.add({ ...createSuiviDraft(), date: '2026-01-05' });
      const ceJour = await repo.getByDate('2026-01-05');
      expect(ceJour).toHaveLength(2);
    });

    it('met à jour partiellement', async () => {
      const repo = factory();
      const id = await repo.add(createSuiviDraft());
      await repo.update(id, { nombre: 7, protogene: false });
      const relus = await repo.getAll();
      const suivi = relus.find(row => row.id === id);
      expect(suivi?.nombre).toBe(7);
      expect(suivi?.protogene).toBe(false);
    });

    it('supprime', async () => {
      const repo = factory();
      const id = await repo.add(createSuiviDraft());
      await repo.delete(id);
      expect(await repo.getAll()).toHaveLength(0);
    });
  });
}

contrat('InMemorySuiviRepository', () => new InMemorySuiviRepository());
