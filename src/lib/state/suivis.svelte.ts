import type { SuiviRepository } from '../repositories/suiviRepository';
import type { Suivi, SuiviInput } from '../schema';

/**
 * État réactif des suivis (runes Svelte 5). Le repository est injecté au
 * constructeur — jamais importé globalement (pattern Provider, ADR 0001).
 */
export class SuivisController {
  #repository: SuiviRepository;

  suivis = $state<Suivi[]>([]);
  chargement = $state(false);

  constructor(repository: SuiviRepository) {
    this.#repository = repository;
  }

  async refresh(): Promise<void> {
    this.chargement = true;
    try {
      const all = await this.#repository.getAll();
      this.suivis = all.sort((a, b) => b.date.localeCompare(a.date));
    } finally {
      this.chargement = false;
    }
  }

  async ajouter(input: SuiviInput): Promise<number> {
    const id = await this.#repository.add(input);
    await this.refresh();
    return id;
  }

  async supprimer(id: number): Promise<void> {
    await this.#repository.delete(id);
    await this.refresh();
  }
}
