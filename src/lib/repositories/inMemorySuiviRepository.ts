import { suiviInputSchema, suiviSchema } from '../schema';
import type { Suivi, SuiviInput } from '../schema';
import type { SuiviRepository } from './suiviRepository';

/**
 * Fake en mémoire du repository : utilisé par les tests, et réutilisable
 * comme mode démo. Contrat identique à l'implémentation Dexie.
 */
export class InMemorySuiviRepository implements SuiviRepository {
  #rows = new Map<number, Suivi>();
  #nextId = 1;

  async add(input: SuiviInput): Promise<number> {
    const validated = suiviInputSchema.parse(input);
    const id = this.#nextId++;
    this.#rows.set(id, suiviSchema.parse({ ...validated, id }));
    return id;
  }

  async update(id: number, changes: Partial<SuiviInput>): Promise<void> {
    const existing = this.#rows.get(id);
    if (!existing) {
      return;
    }
    this.#rows.set(id, suiviSchema.parse({ ...existing, ...changes, id }));
  }

  async delete(id: number): Promise<void> {
    this.#rows.delete(id);
  }

  async getAll(): Promise<Suivi[]> {
    return [...this.#rows.values()];
  }

  async getByDate(date: string): Promise<Suivi[]> {
    return [...this.#rows.values()].filter(row => row.date === date);
  }
}
