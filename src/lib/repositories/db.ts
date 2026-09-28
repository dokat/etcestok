import Dexie from 'dexie';
import type { Table } from 'dexie';

import type { Suivi } from '../schema';
import type { ThemePreference } from './themeRepository';

export interface SettingsRow {
  key: 'theme';
  value: ThemePreference;
}

interface AppDatabase extends Dexie {
  suivis: Table<Suivi, number>;
  settings: Table<SettingsRow, 'theme'>;
}

let instance: AppDatabase | undefined;

/** Instance Dexie créée à la demande (jamais au chargement du module : teste en Node). */
export function getDb(): AppDatabase {
  if (!instance) {
    const db = new Dexie('etcestokDB');
    db.version(1).stores({
      suivis: '++id, date, nombre, protogene, position',
      settings: 'key',
    });
    instance = db as unknown as AppDatabase;
  }
  return instance;
}
