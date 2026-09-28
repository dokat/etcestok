import { describe, expect, it } from 'vitest';

import { positionSchema, suiviInputSchema, suiviSchema } from '$lib/schema';
import { todayISO } from '$lib/dates';
import { createSuiviDraft } from '$lib/factories';

function demain(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

describe('suiviSchema', () => {
  it('accepte un suivi complet valide', () => {
    const valide = { id: 1, date: '2026-09-01', nombre: 3, protogene: false, position: 'actif' };
    expect(suiviSchema.parse(valide)).toEqual(valide);
  });

  it('accepte l’absence d’id (création)', () => {
    expect(() => suiviInputSchema.parse(createSuiviDraft())).not.toThrow();
  });

  it('rejette une date dans le futur', () => {
    const resultat = suiviInputSchema.safeParse({
      ...createSuiviDraft(),
      date: demain(),
    });
    expect(resultat.success).toBe(false);
  });

  it('rejette un format de date invalide', () => {
    expect(suiviInputSchema.safeParse({ ...createSuiviDraft(), date: '01/09/2026' }).success).toBe(
      false
    );
  });

  it('rejette un nombre nul ou négatif', () => {
    expect(suiviInputSchema.safeParse({ ...createSuiviDraft(), nombre: 0 }).success).toBe(false);
    expect(suiviInputSchema.safeParse({ ...createSuiviDraft(), nombre: -2 }).success).toBe(false);
  });

  it('rejette un nombre non entier', () => {
    expect(suiviInputSchema.safeParse({ ...createSuiviDraft(), nombre: 1.5 }).success).toBe(false);
  });

  it('rejette une position hors énumération', () => {
    expect(suiviInputSchema.safeParse({ ...createSuiviDraft(), position: 'autre' }).success).toBe(
      false
    );
  });

  it('accepte un commentaire libre', () => {
    const avecCommentaire = {
      ...createSuiviDraft(),
      commentaire: 'Une note, avec des chiffres 123.',
    };
    expect(suiviInputSchema.parse(avecCommentaire).commentaire).toBe(avecCommentaire.commentaire);
  });

  it('accepte l’absence de commentaire (champ facultatif)', () => {
    const sansCommentaire = { ...createSuiviDraft(), commentaire: undefined };
    expect(suiviInputSchema.safeParse(sansCommentaire).success).toBe(true);
  });

  it('rejette un commentaire qui n’est pas une chaîne', () => {
    expect(suiviInputSchema.safeParse({ ...createSuiviDraft(), commentaire: 42 }).success).toBe(
      false
    );
  });

  it('n’accepte que les trois positions documentées', () => {
    expect(positionSchema.options).toEqual(['actif', 'passif', 'les deux']);
  });
});

describe('todayISO', () => {
  it('retourne la date du jour au format YYYY-MM-DD', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
