import type { Position, Suivi } from './schema';

import { subMonthsISO, todayISO } from './dates';

/** Statistiques globales dérivées des suivis (fonction pure, testable). */

/** Mode de période proposé sur la page de statistiques. */
export type ModePeriode = 'mois' | '3 mois' | 'personnalisée';

/** Période de filtre : bornes ISO inclusives, null = sans borne. */
export interface Periode {
  debut: string | null;
  fin: string | null;
}

/** Période prédéfinie correspondant à un mode, à partir d'aujourd'hui. */
export function periodePour(mode: ModePeriode, aujourdhui = todayISO()): Periode {
  if (mode === 'mois') return { debut: subMonthsISO(aujourdhui, 1), fin: aujourdhui };
  if (mode === '3 mois') return { debut: subMonthsISO(aujourdhui, 3), fin: aujourdhui };
  return { debut: null, fin: null };
}

/** Filtre les suivis dont la date est dans la période (bornes inclusives). */
export function filtrerParPeriode(suivis: readonly Suivi[], periode: Periode): Suivi[] {
  return suivis.filter(
    suivi =>
      (!periode.debut || suivi.date >= periode.debut) && (!periode.fin || suivi.date <= periode.fin)
  );
}

export interface Statistiques {
  totalRapports: number;
  rapportsProteges: number;
  rapportsNonProteges: number;
  /** Nombre de rapports par position (pondéré par le nombre de rapports de chaque suivi). */
  rapportsParPosition: Record<Position, number>;
}

export function computeStats(suivis: readonly Suivi[]): Statistiques {
  const rapportsParPosition: Record<Position, number> = {
    actif: 0,
    passif: 0,
    'les deux': 0,
  };

  let totalRapports = 0;
  let rapportsProteges = 0;
  let rapportsNonProteges = 0;

  for (const suivi of suivis) {
    totalRapports += suivi.nombre;
    if (suivi.protogene) {
      rapportsProteges += suivi.nombre;
    } else {
      rapportsNonProteges += suivi.nombre;
    }
    rapportsParPosition[suivi.position] += suivi.nombre;
  }

  return {
    totalRapports,
    rapportsProteges,
    rapportsNonProteges,
    rapportsParPosition,
  };
}
