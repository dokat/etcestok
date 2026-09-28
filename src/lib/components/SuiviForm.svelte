<script lang="ts">
  import { createSuiviDraft } from '$lib/factories';
  import { positionSchema, suiviInputSchema, type SuiviInput } from '$lib/schema';
  import DateInput from './DateInput.svelte';

  interface Props {
    /** Valeurs initiales (par défaut : factory de brouillon). */
    initial?: SuiviInput;
    submitLabel?: string;
    onSubmit: (input: SuiviInput) => void | Promise<void>;
  }

  let { initial = createSuiviDraft(), submitLabel = 'Enregistrer', onSubmit }: Props = $props();

  const POSITIONS = positionSchema.options;

  // svelte-ignore state_referenced_locally
  const draft = $state<SuiviInput>({ ...initial });
  let erreurs = $state<string[]>([]);

  async function soumettre(): Promise<void> {
    const resultat = suiviInputSchema.safeParse(draft);
    if (!resultat.success) {
      erreurs = resultat.error.issues.map(issue => `${issue.path.join('.')} — ${issue.message}`);
      return;
    }
    erreurs = [];
    await onSubmit(resultat.data);
  }

  function majNombre(event: Event): void {
    const target = event.currentTarget;
    if (target instanceof HTMLInputElement) {
      draft.nombre = Number(target.value);
    }
  }
</script>

<form
  class="flex flex-col gap-4"
  novalidate
  onsubmit={e => {
    e.preventDefault();
    void soumettre();
  }}
>
  <DateInput id="suivi-date" label="Date" bind:value={draft.date} />

  <label class="block text-sm font-medium" for="suivi-nombre">
    Nombre de rapports (saisie groupée)
    <input
      id="suivi-nombre"
      type="number"
      min="1"
      step="1"
      class="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
      value={draft.nombre}
      oninput={majNombre}
    />
  </label>

  <fieldset class="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700">
    <legend class="px-1 text-sm font-medium">Protection</legend>
    <div class="flex gap-6 py-1">
      <label class="flex items-center gap-2 text-sm">
        <input
          type="radio"
          name="protogene"
          checked={draft.protogene}
          onchange={() => (draft.protogene = true)}
          value={true}
        />
        Protégé
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input
          type="radio"
          name="protogene"
          checked={!draft.protogene}
          onchange={() => (draft.protogene = false)}
          value={false}
        />
        Non protégé
      </label>
    </div>
  </fieldset>

  <fieldset class="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700">
    <legend class="px-1 text-sm font-medium">Position</legend>
    <div class="flex flex-wrap gap-6 py-1">
      {#each POSITIONS as position}
        <label class="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="position"
            checked={draft.position === position}
            onchange={() => (draft.position = position)}
          />
          {position}
        </label>
      {/each}
    </div>
  </fieldset>

  <label class="block text-sm font-medium" for="suivi-commentaire">
    Commentaire (facultatif)
    <textarea
      id="suivi-commentaire"
      rows="3"
      class="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
      bind:value={draft.commentaire}></textarea>
  </label>

  {#if erreurs.length > 0}
    <ul
      class="list-disc rounded-md bg-red-100 px-8 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200"
    >
      {#each erreurs as erreur}
        <li>{erreur}</li>
      {/each}
    </ul>
  {/if}

  <button
    type="submit"
    class="min-h-12 rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
  >
    {submitLabel}
  </button>
</form>
