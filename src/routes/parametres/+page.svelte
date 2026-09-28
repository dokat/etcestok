<script lang="ts">
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
  <title>Paramètres — EtCestOk</title>
</svelte:head>

<h1 class="text-2xl font-bold">Paramètres</h1>

<section class="mt-4">
  <h2 class="font-semibold">Mode sombre/clair</h2>
  <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
    Par défaut, l'application suit le réglage du système. La préférence est enregistrée localement
    (IndexedDB).
  </p>
  <div class="mt-3">
    <ThemeToggle />
  </div>
</section>
