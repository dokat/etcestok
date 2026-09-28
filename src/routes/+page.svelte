<script lang="ts">
  import { formatDateISO } from '$lib/dates';
  import { resolve } from '$app/paths';
  import DateInput from '$lib/components/DateInput.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { useSuivis } from '$lib/context';
  import {
    computeStats,
    filtrerParPeriode,
    periodePour,
    type ModePeriode,
    type Periode,
  } from '$lib/stats';

  const suivis = useSuivis();

  const MODES: { valeur: ModePeriode; libelle: string }[] = [
    { valeur: 'mois', libelle: 'Dernier mois' },
    { valeur: '3 mois', libelle: '3 derniers mois' },
    { valeur: 'personnalisée', libelle: 'Période donnée' },
  ];

  let mode = $state<ModePeriode>('mois');
  let bornes = $state<{ debut: string; fin: string }>({ debut: '', fin: '' });

  const periode = $derived<Periode>(
    mode === 'personnalisée'
      ? { debut: bornes.debut || null, fin: bornes.fin || null }
      : periodePour(mode)
  );
  const suivisPeriode = $derived(filtrerParPeriode(suivis.suivis, periode));
  const stats = $derived(computeStats(suivisPeriode));
</script>

<h1 class="text-2xl font-bold">EtCestOk</h1>

<div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choix de la période">
  {#each MODES as m (m.valeur)}
    <button
      type="button"
      aria-pressed={mode === m.valeur}
      class="rounded-full border px-3 py-1 text-sm font-medium aria-[aria-pressed=true]:border-zinc-900 aria-[aria-pressed=true]:bg-zinc-900 aria-[aria-pressed=true]:text-white aria-[aria-pressed=true]:dark:border-white aria-[aria-pressed=true]:dark:bg-white aria-[aria-pressed=true]:dark:text-zinc-900 border-zinc-300 text-zinc-500 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white"
      onclick={() => (mode = m.valeur)}
    >
      {m.libelle}
    </button>
  {/each}
</div>

{#if mode === 'personnalisée'}
  <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
    <DateInput id="periode-debut" label="À partir du" bind:value={bornes.debut} />
    <DateInput id="periode-fin" label="Jusqu'au" bind:value={bornes.fin} />
  </div>
{/if}

<p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
  {#if periode.debut && periode.fin}
    Du {formatDateISO(periode.debut)} au {formatDateISO(periode.fin)}
  {:else if periode.debut}
    À partir du {formatDateISO(periode.debut)}
  {:else if periode.fin}
    Jusqu'au {formatDateISO(periode.fin)}
  {:else}
    Toute l'histoire
  {/if}
</p>

{#if !suivis.chargement && suivisPeriode.length === 0}
  {#if suivis.suivis.length === 0}
    <p class="mt-4">
      Aucun suivi pour l'instant.
      <a class="underline" href={resolve('/ajouter')}>Ajouter un premier suivi</a>.
    </p>
  {:else}
    <p class="mt-4">Aucun suivi sur cette période.</p>
  {/if}
{:else}
  <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
    <StatCard label="Rapports au total" valeur={stats.totalRapports} />
    <StatCard label="Rapports protégés" valeur={stats.rapportsProteges} />
    <StatCard label="Rapports non protégés" valeur={stats.rapportsNonProteges} />
    <StatCard label="Rapports actifs" valeur={stats.rapportsParPosition.actif} />
    <StatCard label="Rapports passifs" valeur={stats.rapportsParPosition.passif} />
    <StatCard label="Rapports « les deux »" valeur={stats.rapportsParPosition['les deux']} />
  </div>
{/if}
