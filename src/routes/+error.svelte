<script lang="ts">
  interface Props {
    error: Error & { frame?: string };
  }

  let { error }: Props = $props();
</script>

<svelte:head>
  <title>Erreur — EtCestOk</title>
</svelte:head>

<h1 class="text-2xl font-bold">Une erreur est survenue</h1>
<p class="mt-2">{error.message}</p>
<p class="mt-4"><a class="underline" href="/">Retour à l'accueil</a></p>
