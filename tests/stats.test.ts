import { describe, expect, it } from 'vitest';

import { computeStats, filtrerParPeriode, periodePour } from '$lib/stats';
import type { Suivi } from '$lib/schema';

const suivi = (overrides: Partial<Suivi> & { id: number }): Suivi => ({
  date: '2026-09-01',
  nombre: 1,
  protogene: true,
  position: 'les deux',
  ...overrides,
});

describe('computeStats', () => {
  it('retourne des statistiques neutres sans suivi', () => {
    const stats = computeStats([]);
    expect(stats.totalRapports).toBe(0);
    expect(stats.rapportsProteges).toBe(0);
    expect(stats.rapportsNonProteges).toBe(0);
    expect(stats.rapportsParPosition).toEqual({ actif: 0, passif: 0, 'les deux': 0 });
  });

  it('compte les rapports au total (saisie groupée)', () => {
    const stats = computeStats([
      suivi({ id: 1, nombre: 3 }),
      suivi({ id: 2, nombre: 2, date: '2026-09-02' }),
    ]);
    expect(stats.totalRapports).toBe(5);
  });

  it('distingue rapports protégés et non protégés, pondérés par le nombre', () => {
    const stats = computeStats([
      suivi({ id: 1, nombre: 3, protogene: true }),
      suivi({ id: 2, nombre: 2, protogene: false }),
    ]);
    expect(stats.rapportsProteges).toBe(3);
    expect(stats.rapportsNonProteges).toBe(2);
  });

  it('compte les rapports par position, pondérés par le nombre', () => {
    const stats = computeStats([
      suivi({ id: 1, position: 'actif', nombre: 2 }),
      suivi({ id: 2, position: 'passif', nombre: 3 }),
      suivi({ id: 3, position: 'actif', nombre: 1 }),
      suivi({ id: 4, position: 'les deux', nombre: 4 }),
    ]);
    expect(stats.rapportsParPosition).toEqual({ actif: 3, passif: 3, 'les deux': 4 });
  });
});

describe('periodePour', () => {
  it('couvre le dernier mois écoulé, jour courant inclus', () => {
    expect(periodePour('mois', '2026-09-28')).toEqual({
      debut: '2026-08-28',
      fin: '2026-09-28',
    });
  });

  it('couvre les 3 derniers mois écoulés', () => {
    expect(periodePour('3 mois', '2026-09-28')).toEqual({
      debut: '2026-06-28',
      fin: '2026-09-28',
    });
  });

  it('borne le jour à la fin du mois cible en cas de dépassement', () => {
    expect(periodePour('mois', '2026-03-31').debut).toBe('2026-02-28');
  });

  it('laisse la période personnalisée sans borne', () => {
    expect(periodePour('personnalisée')).toEqual({ debut: null, fin: null });
  });
});

describe('filtrerParPeriode', () => {
  const tous = [
    suivi({ id: 1, date: '2026-05-31' }),
    suivi({ id: 2, date: '2026-06-01' }),
    suivi({ id: 3, date: '2026-06-15' }),
    suivi({ id: 4, date: '2026-06-16' }),
  ];

  it('garde les bornes incluses', () => {
    const filtres = filtrerParPeriode(tous, { debut: '2026-06-01', fin: '2026-06-15' });
    expect(filtres.map(s => s.id)).toEqual([2, 3]);
  });

  it('accepte une période ouverte en début ou en fin', () => {
    expect(filtrerParPeriode(tous, { debut: '2026-06-15', fin: null }).map(s => s.id)).toEqual([
      3, 4,
    ]);
    expect(filtrerParPeriode(tous, { debut: null, fin: '2026-06-01' }).map(s => s.id)).toEqual([
      1, 2,
    ]);
  });

  it('garde tout sans borne', () => {
    expect(filtrerParPeriode(tous, { debut: null, fin: null })).toHaveLength(4);
  });
});
