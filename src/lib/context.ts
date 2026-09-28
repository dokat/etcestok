import { getContext, setContext } from 'svelte';

import type { SuivisController } from './state/suivis.svelte';
import type { ThemeController } from './state/theme.svelte';

/** Pattern Provider : injection des dépendances via le contexte Svelte (ADR 0001). */

const CLE_SUIVIS = 'suivisController';
const CLE_THEME = 'themeController';

export function provideSuivis(controller: SuivisController): void {
  setContext(CLE_SUIVIS, controller);
}

export function provideTheme(controller: ThemeController): void {
  setContext(CLE_THEME, controller);
}

export function useSuivis(): SuivisController {
  const controller = getContext<SuivisController | undefined>(CLE_SUIVIS);
  if (!controller) {
    throw new Error('useSuivis() doit être appelé sous le layout qui fournit SuivisController');
  }
  return controller;
}

export function useTheme(): ThemeController {
  const controller = getContext<ThemeController | undefined>(CLE_THEME);
  if (!controller) {
    throw new Error('useTheme() doit être appelé sous le layout qui fournit ThemeController');
  }
  return controller;
}
