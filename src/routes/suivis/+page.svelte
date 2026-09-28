<script lang="ts">
  import SuiviCard from '$lib/components/SuiviCard.svelte';
  import { useSuivis } from '$lib/context';

  const suivis = useSuivis();
</script>

<svelte:head>
  <title>Suivis — EtCestOk</title>
</svelte:head>

<h1 class="text-2xl font-bold">Tous les suivis</h1>

{#if suivis.chargement}
  <p class="mt-4 text-zinc-500">Chargement…</p>
{:else if suivis.suivis.length === 0}
  <p class="mt-4">
    Aucun suivi. <a class="underline" href="/ajouter">Ajouter un suivi</a>.
  </p>
{:else}
  <ul class="mt-4 flex flex-col gap-3">
    {#each suivis.suivis as suivi (suivi.id)}
      <li><SuiviCard {suivi} onSupprimer={id => suivis.supprimer(id)} /></li>
    {/each}
  </ul>
{/if}
