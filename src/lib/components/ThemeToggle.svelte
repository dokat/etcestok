<script lang="ts">
  import { useTheme } from '$lib/context';
  import type { ThemePreference } from '$lib/repositories/themeRepository';

  const theme = useTheme();

  const OPTIONS: { value: ThemePreference; label: string }[] = [
    { value: 'systeme', label: 'Système' },
    { value: 'clair', label: 'Clair' },
    { value: 'sombre', label: 'Sombre' },
  ];
</script>

<div class="flex gap-2" role="radiogroup" aria-label="Préférence de thème">
  {#each OPTIONS as option (option.value)}
    <button
      type="button"
      role="radio"
      aria-checked={theme.preference === option.value}
      class="min-h-12 rounded-md border px-4 py-2 text-sm font-medium aria-[aria-checked=true]:border-zinc-900 aria-[aria-checked=true]:bg-zinc-900 aria-[aria-checked=true]:text-white dark:aria-[aria-checked=true]:border-zinc-100 dark:aria-[aria-checked=true]:bg-zinc-100 dark:aria-[aria-checked=true]:text-zinc-900 border-zinc-300 dark:border-zinc-700"
      onclick={() => void theme.definir(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>
