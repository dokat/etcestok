<script lang="ts">
  import { goto } from '$app/navigation';

  import SuiviForm from '$lib/components/SuiviForm.svelte';
  import { useSuivis } from '$lib/context';

  const suivis = useSuivis();
</script>

<svelte:head>
  <title>Ajouter — EtCestOk</title>
</svelte:head>

<h1 class="text-2xl font-bold">Ajouter un suivi</h1>
<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
  Saisie groupée : indiquez le nombre de rapports identiques pour la date choisie.
</p>

<div class="mt-4">
  <SuiviForm
    onSubmit={async input => {
      await suivis.ajouter(input);
      await goto('/suivis');
    }}
  />
</div>
