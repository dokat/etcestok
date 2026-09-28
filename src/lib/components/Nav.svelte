<script lang="ts">
  import { page } from '$app/state';

  const LIENS = [
    { href: '/', label: 'Accueil', icon: '📊' },
    { href: '/suivis', label: 'Suivis', icon: '📅' },
    { href: '/ajouter', label: 'Ajouter', icon: '➕' },
    { href: '/parametres', label: 'Paramètres', icon: '⚙️' },
  ];

  function actif(href: string): boolean {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }
</script>

<nav
  class="fixed inset-x-0 bottom-0 z-10 flex border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:static md:min-h-screen md:w-56 md:flex-col md:border-t-0 md:border-r"
  aria-label="Navigation principale"
>
  {#each LIENS as lien (lien.href)}
    <a
      href={lien.href}
      aria-current={actif(lien.href) ? 'page' : undefined}
      class="flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-xs font-medium aria-[aria-current=page]:text-zinc-900 aria-[aria-current=page]:underline md:flex-none md:flex-row md:gap-2 md:px-4 md:text-sm dark:aria-[aria-current=page]:text-white text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
    >
      <span aria-hidden="true">{lien.icon}</span>
      {lien.label}
    </a>
  {/each}
</nav>
