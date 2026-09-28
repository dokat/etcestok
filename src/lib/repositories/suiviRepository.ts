import type { Suivi, SuiviInput } from '../schema';

/**
 * Pattern Repository (ADR 0001) : le reste de l'application ne parle jamais à Dexie,
 * seulement à cette interface. Implémentations : Dexie (production) et en mémoire (tests).
 */
export interface SuiviRepository {
  add(input: SuiviInput): Promise<number>;
  update(id: number, changes: Partial<SuiviInput>): Promise<void>;
  delete(id: number): Promise<void>;
  getAll(): Promise<Suivi[]>;
  getByDate(date: string): Promise<Suivi[]>;
}
