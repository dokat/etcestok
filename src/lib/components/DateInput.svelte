<script lang="ts">
  import { todayISO } from '$lib/dates';

  interface Props {
    id?: string;
    label?: string;
    value: string;
  }

  let { id = 'date', label = 'Date', value = $bindable('') }: Props = $props();
</script>

<label class="block text-sm font-medium" for={id}>
  {label}
  <input
    {id}
    type="date"
    class="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
    max={todayISO()}
    bind:value
  />
</label>
