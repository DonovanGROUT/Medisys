/*
-------------------------------------------------
Sommaire des blocs de tests :
- formatDate : formatage de date ISO en fr-FR, gestion des cas vides
- formatTime : extraction de l'heure HH:mm, gestion des cas vides
- statutFr : traduction des statuts, fallback inconnu
- badgeClass : classe CSS selon le statut
- isPast : détection date passée/future
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatTime,
  statutFr,
  badgeClass,
  isPast,
} from '../../utils/appointmentHelpers';

describe('Helpers AppointmentItem', () => {
  describe('formatDate', () => {
    it('formate une date ISO en format fr-FR', () => {
      expect(formatDate('2025-07-02T10:00:00')).toBe('02/07/2025');
    });
    it('retourne vide si dateHeure vide', () => {
      expect(formatDate('')).toBe('');
    });
  });
  describe('formatTime', () => {
    it("extrait l'heure HH:mm depuis une date ISO", () => {
      expect(formatTime('2025-07-02T10:15:00')).toBe('10:15');
    });
    it('retourne vide si dateHeure vide', () => {
      expect(formatTime('')).toBe('');
    });
  });
  describe('statutFr', () => {
    it('traduit les statuts connus', () => {
      expect(statutFr('scheduled')).toBe('À venir');
      expect(statutFr('confirmed')).toBe('Confirmé');
      expect(statutFr('cancelled')).toBe('Annulé');
      expect(statutFr('completed')).toBe('Terminé');
    });
    it('retourne le statut brut si inconnu', () => {
      expect(statutFr('autre')).toBe('autre');
    });
  });
  describe('badgeClass', () => {
    it('retourne la bonne classe pour chaque statut', () => {
      expect(badgeClass('scheduled')).toBe('text-white bg-blue-800');
      expect(badgeClass('confirmed')).toBe('text-white bg-green-800');
      expect(badgeClass('cancelled')).toBe('text-white bg-red-800');
      expect(badgeClass('completed')).toBe('text-white bg-slate-800');
      expect(badgeClass('autre')).toBe('text-white bg-slate-800');
    });
  });
  describe('isPast', () => {
    it('retourne true si la date est passée', () => {
      const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(isPast(past)).toBe(true);
    });
    it('retourne false si la date est future', () => {
      const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      expect(isPast(future)).toBe(false);
    });
  });
});
