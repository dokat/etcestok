import { getDb } from './db';

export type ThemePreference = 'systeme' | 'clair' | 'sombre';

const THEME_KEY = 'theme' as const;

/** Préférence de thème persistée en IndexedDB (ADR 0001). */
export interface ThemeRepository {
  get(): Promise<ThemePreference>;
  set(preference: ThemePreference): Promise<void>;
}

export class DexieThemeRepository implements ThemeRepository {
  async get(): Promise<ThemePreference> {
    const row = await getDb().settings.get(THEME_KEY);
    return row?.value ?? 'systeme';
  }

  async set(preference: ThemePreference): Promise<void> {
    await getDb().settings.put({ key: THEME_KEY, value: preference });
  }
}

export class InMemoryThemeRepository implements ThemeRepository {
  #preference: ThemePreference = 'systeme';

  async get(): Promise<ThemePreference> {
    return this.#preference;
  }

  async set(preference: ThemePreference): Promise<void> {
    this.#preference = preference;
  }
}
