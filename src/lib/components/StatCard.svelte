<script lang="ts">
  interface Props {
    label: string;
    valeur: string | number;
    note?: string;
  }

  let { label, valeur, note = '' }: Props = $props();
</script>

<article
  class="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
>
  <p class="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
  <p class="mt-1 text-2xl font-semibold">{valeur}</p>
  {#if note}
    <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{note}</p>
  {/if}
</article>
