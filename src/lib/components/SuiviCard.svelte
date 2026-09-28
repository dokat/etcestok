<script lang="ts">
  import { formatDateISO } from '$lib/dates';
  import type { Suivi } from '$lib/schema';

  interface Props {
    suivi: Suivi;
    /** Si absent, la carte est en lecture seule (composant présentationnel). */
    onSupprimer?: (id: number) => void;
  }

  let { suivi, onSupprimer }: Props = $props();

  const id = $derived(suivi.id);
</script>

<article
  class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
>
  <div class="flex flex-wrap items-center gap-2">
    <span class="font-medium">{formatDateISO(suivi.date)}</span>
    <span class="rounded-full bg-zinc-200 px-2 py-0.5 text-xs dark:bg-zinc-700">
      {suivi.nombre} rapport{suivi.nombre > 1 ? 's' : ''}
    </span>
    {#if suivi.protogene}
      <span
        class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
      >
        Protégé
      </span>
    {:else}
      <span
        class="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200"
      >
        Non protégé
      </span>
    {/if}
    <span class="text-sm text-zinc-500 dark:text-zinc-400">{suivi.position}</span>
    {#if suivi.commentaire}
      <p class="w-full text-sm text-zinc-600 italic dark:text-zinc-300">{suivi.commentaire}</p>
    {/if}
  </div>

  {#if onSupprimer && id !== undefined}
    <button
      type="button"
      class="min-h-12 rounded-md px-3 py-1 text-sm text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950"
      onclick={() => {
        if (suivi.id !== undefined) {
          onSupprimer(suivi.id);
        }
      }}
      aria-label="Supprimer ce suivi"
    >
      Supprimer
    </button>
  {/if}
</article>
