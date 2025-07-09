/**
 * -----------------------------------------------------
 * Sommaire des blocs de tests :
 * - Vérifie la robustesse et la cohérence métier du formatage des noms et prénoms
 * - Couvre tous les cas métier (simples, composés, vides, undefined, casse)
 * Helpers centralisés en haut de fichier.
 * -----------------------------------------------------
 */
import { describe, it, expect } from 'vitest';
import { formatNom, formatPrenom } from '../formatNomPrenom';

describe('formatNom', () => {
  it('met en majuscules un nom simple', () => {
    expect(formatNom('durand')).toBe('DURAND');
  });
  it('met en majuscules un nom composé', () => {
    expect(formatNom('le-roux')).toBe('LE-ROUX');
  });
  it('retourne une chaîne vide si nom vide', () => {
    expect(formatNom('')).toBe('');
  });
  it('retourne une chaîne vide si nom undefined', () => {
    expect(formatNom(undefined)).toBe('');
  });
});

describe('formatPrenom', () => {
  it('met la première lettre en majuscule, le reste en minuscule', () => {
    expect(formatPrenom('jean')).toBe('Jean');
  });
  it('gère les prénoms composés', () => {
    expect(formatPrenom('jean-paul')).toBe('Jean-Paul');
  });
  it('retourne une chaîne vide si prénom vide', () => {
    expect(formatPrenom('')).toBe('');
  });
  it('retourne une chaîne vide si prénom undefined', () => {
    expect(formatPrenom(undefined)).toBe('');
  });
  it('gère les majuscules et minuscules mélangées', () => {
    expect(formatPrenom('jEAN-pAUL')).toBe('Jean-Paul');
  });
});
