import type { ThemePreference, ThemeRepository } from '../repositories/themeRepository';

function systemeSombre(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function estSombre(preference: ThemePreference): boolean {
  if (preference === 'sombre') return true;
  if (preference === 'clair') return false;
  return systemeSombre();
}

/**
 * Contrôleur de thème (ADR 0001) : préférence persistée via le repository injecté,
 * fallback `prefers-color-scheme`, application par classe `.dark` sur <html>.
 */
export class ThemeController {
  #repository: ThemeRepository;

  preference = $state<ThemePreference>('systeme');

  constructor(repository: ThemeRepository) {
    this.#repository = repository;
  }

  get sombre(): boolean {
    return estSombre(this.preference);
  }

  /** À appeler au montage : charge la préférence persistée et applique le thème. */
  async init(): Promise<void> {
    if (typeof window === 'undefined') return;
    this.preference = await this.#repository.get();
    this.appliquer();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      this.appliquer();
    });
  }

  async definir(preference: ThemePreference): Promise<void> {
    this.preference = preference;
    await this.#repository.set(preference);
    this.appliquer();
  }

  private appliquer(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', estSombre(this.preference));
  }
}
