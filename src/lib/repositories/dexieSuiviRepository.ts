import { suiviInputSchema, suiviSchema } from '../schema';
import { getDb } from './db';
import type { SuiviRepository } from './suiviRepository';
import type { Suivi, SuiviInput } from '../schema';

/** Implémentation IndexedDB via Dexie. Validation Zod à l'écriture et défensive à la lecture (ADR 0002). */
export class DexieSuiviRepository implements SuiviRepository {
  async add(input: SuiviInput): Promise<number> {
    return getDb().suivis.add(suiviInputSchema.parse(input));
  }

  async update(id: number, changes: Partial<SuiviInput>): Promise<void> {
    await getDb().suivis.update(id, changes);
  }

  async delete(id: number): Promise<void> {
    await getDb().suivis.delete(id);
  }

  async getAll(): Promise<Suivi[]> {
    const rows = await getDb().suivis.toArray();
    return rows.map(row => suiviSchema.parse(row));
  }

  async getByDate(date: string): Promise<Suivi[]> {
    const rows = await getDb().suivis.where('date').equals(date).toArray();
    return rows.map(row => suiviSchema.parse(row));
  }
}
