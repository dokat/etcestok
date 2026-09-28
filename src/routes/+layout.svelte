<script lang="ts">
  import { onMount } from 'svelte';

  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import { provideSuivis, provideTheme } from '$lib/context';
  import { DexieSuiviRepository } from '$lib/repositories/dexieSuiviRepository';
  import { DexieThemeRepository } from '$lib/repositories/themeRepository';
  import { SuivisController } from '$lib/state/suivis.svelte';
  import { ThemeController } from '$lib/state/theme.svelte';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();

  // Composition root : les dépendances concrètes ne sont câblées qu'ici,
  // l'application ne connaît que les interfaces via le contexte.
  const theme = new ThemeController(new DexieThemeRepository());
  const suivis = new SuivisController(new DexieSuiviRepository());
  provideTheme(theme);
  provideSuivis(suivis);

  onMount(async () => {
    await theme.init();
    await suivis.refresh();
  });
</script>

<div class="flex flex-col md:flex-row">
  <Nav />
  <main class="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-6 md:pb-8">
    {@render children()}
  </main>
</div>
