/** Utilitaires de dates ISO (YYYY-MM-DD) en heure locale. */

function toISO(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

/** Retourne la date ISO `mois` mois avant `date` (le jour est borné à la fin du mois cible). */
export function subMonthsISO(date: string, mois: number): string {
  const [annee, moisCourant, jour] = date.split('-');
  const cible = new Date(Number(annee), Number(moisCourant) - 1 - mois, 1);
  const dernierJour = new Date(cible.getFullYear(), cible.getMonth() + 1, 0).getDate();
  return toISO(
    new Date(cible.getFullYear(), cible.getMonth(), Math.min(Number(jour), dernierJour))
  );
}

/** Formate une date ISO en français (ex. « lundi 28 septembre 2026 »). */
export function formatDateISO(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(date));
}
