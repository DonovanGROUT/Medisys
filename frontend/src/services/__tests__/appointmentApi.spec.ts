/**
 * ------------------------------------------------
 * Sommaire des blocs de tests :
 * - Vérifie les appels API (succès, erreurs, mapping)
 * - Couvre les helpers internes (isStatut, mapApiToAppointment, mapApiPatient)
 * Helpers/mocks centralisés en haut de fichier.
 * ------------------------------------------------
 */

/**
 * Tests unitaires et robustesse de appointmentApi
 * ------------------------------------------------
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as appointmentApi from '../appointmentApi';
import type { Appointment } from '../../types/Appointment';
import type { Patient } from '../../types/Patient';

type FetchMock = ReturnType<typeof vi.fn>;
const mockFetch: FetchMock = vi.fn();
globalThis.fetch = mockFetch as typeof globalThis.fetch;

describe('appointmentApi', () => {
  afterEach(() => {
    mockFetch.mockReset();
  });

  describe('getAppointments', () => {
    it('retourne un tableau d’objets Appointment', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [
          {
            id: 1,
            patient: { id: 2 },
            dateHeure: '2025-07-01T10:00',
            duree: 30,
            motif: 'Test',
            statut: 'scheduled',
          },
        ],
      });
      const res = await appointmentApi.getAppointments();
      expect(Array.isArray(res)).toBe(true);
      expect(res[0]).toHaveProperty('id', 1);
    });
    it('gère le cas d’erreur API', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      await expect(appointmentApi.getAppointments()).rejects.toThrow();
    });
    it('retourne [] si la réponse n’est pas un tableau', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ foo: 'bar' }),
      });
      const res = await appointmentApi.getAppointments();
      expect(res).toEqual([]);
    });
    it('mappe un rendez-vous avec patient absent', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [
          { id: 1, dateHeure: '2025-07-01T10:00', duree: 30, motif: 'Test', statut: 'scheduled' },
        ],
      });
      const res = await appointmentApi.getAppointments();
      expect(res[0].patient).toBeDefined();
    });
    it('mappe un rendez-vous avec patient et date mal formée', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [
          {
            id: 1,
            patient: { id: 2, lastName: 'X', firstName: 'Y', gender: 'F', birthDate: 'notadate' },
            dateHeure: '2025-07-01T10:00',
            duree: 30,
            motif: 'Test',
            statut: 'scheduled',
          },
        ],
      });
      const res = await appointmentApi.getAppointments();
      expect(res[0].patient.dateNaissance).toBe('notadate');
    });
  });

  describe('createAppointment', () => {
    it('retourne un Appointment créé', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({
          id: 1,
          patient: { id: 2, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '2000-01-01' },
          dateHeure: '2025-07-01T10:00',
          duree: 30,
          motif: 'Test',
          statut: 'scheduled',
        }),
      });
      const res = await appointmentApi.createAppointment({
        patient: { id: 2, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '2000-01-01' },
        dateHeure: '2025-07-01T10:00',
        duree: 30,
        motif: 'Test',
        statut: 'scheduled',
      });
      expect(res).toHaveProperty('id', 1);
    });
    it('gère le cas d’erreur API', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 400 });
      await expect(appointmentApi.createAppointment({})).rejects.toThrow();
    });
  });

  describe('updateAppointment', () => {
    it('retourne un Appointment modifié', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          id: 1,
          patient: { id: 2, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '2000-01-01' },
          dateHeure: '2025-07-01T10:00',
          duree: 30,
          motif: 'Test',
          statut: 'scheduled',
        }),
      });
      const res = await appointmentApi.updateAppointment(1, {
        patient: { id: 2, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '2000-01-01' },
        dateHeure: '2025-07-01T10:00',
        duree: 30,
        motif: 'Test',
        statut: 'scheduled',
      });
      expect(res).toHaveProperty('id', 1);
    });
    it('gère le cas d’erreur API', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 400 });
      await expect(appointmentApi.updateAppointment(1, {})).rejects.toThrow();
    });
  });

  describe('deleteAppointment', () => {
    it('ne lève pas d’erreur si succès', async () => {
      mockFetch.mockResolvedValue({ ok: true, status: 204 });
      await expect(appointmentApi.deleteAppointment(1)).resolves.toBeUndefined();
    });
    it('lève une erreur si échec', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });
      await expect(appointmentApi.deleteAppointment(1)).rejects.toThrow();
    });
  });
});

describe('helpers internes appointmentApi', () => {
  it('isStatut retourne true pour les statuts valides', () => {
    expect(appointmentApi['isStatut']('scheduled')).toBe(true);
    expect(appointmentApi['isStatut']('cancelled')).toBe(true);
    expect(appointmentApi['isStatut']('completed')).toBe(true);
  });
  it('isStatut retourne false pour un statut inconnu', () => {
    expect(appointmentApi['isStatut']('foo')).toBe(false);
    expect(appointmentApi['isStatut'](undefined)).toBe(false);
  });
  it('mapApiToAppointment gère un statut inconnu (retourne la valeur par défaut)', () => {
    const data = { id: 1, statut: 'foo', dateHeure: '2025-07-01T10:00', duree: 30, motif: 'Test' };
    const appt = appointmentApi['mapApiToAppointment'](data);
    expect(appt.statut).toBe('scheduled');
  });
  it('mapApiToAppointment gère tous les champs manquants (valeurs par défaut)', () => {
    const appt = appointmentApi['mapApiToAppointment']({});
    expect(appt.id).toBe(0);
    expect(appt.patient).toBeDefined();
    expect(appt.statut).toBe('scheduled');
    expect(appt.dateHeure).toBe('');
    expect(appt.duree).toBe(30);
    expect(appt.motif).toBe('');
  });
  it('mapApiPatient gère un patient incomplet (tous champs manquants)', () => {
    const patient = appointmentApi['mapApiPatient']({});
    expect(patient.id).toBe(0);
    expect(patient.nom).toBe('');
    expect(patient.prenom).toBe('');
    expect(patient.sexe).toBe('');
    expect(patient.dateNaissance).toBe('');
    expect(patient.telephone).toBe('');
    expect(patient.email).toBe('');
  });
  it('mapApiPatient gère un patient avec champs alternatifs (nom/prenom/sexe)', () => {
    const patient = appointmentApi['mapApiPatient']({
      nom: 'N',
      prenom: 'P',
      sexe: 'F',
      dateNaissance: '2000-01-01',
    });
    expect(patient.nom).toBe('N');
    expect(patient.prenom).toBe('P');
    expect(patient.sexe).toBe('F');
    expect(patient.dateNaissance).toBe('2000-01-01');
  });
  it('mapApiToAppointment gère le mapping status (anglais)', () => {
    const appt = appointmentApi['mapApiToAppointment']({
      id: 2,
      status: 'completed',
      dateHeure: '2025-07-01T10:00',
      duree: 30,
      motif: 'Test',
      patient: { id: 1 },
    });
    expect(appt.statut).toBe('completed');
  });
  it('mapApiToAppointment gère motif depuis titre et title', () => {
    expect(
      appointmentApi['mapApiToAppointment']({ titre: 'Titre', id: 1, patient: { id: 1 } }).motif
    ).toBe('Titre');
    expect(
      appointmentApi['mapApiToAppointment']({ title: 'Title', id: 1, patient: { id: 1 } }).motif
    ).toBe('Title');
  });
  it('mapApiToAppointment gère dateHeure depuis dateHeure, dateTime, et date+heure', () => {
    expect(
      appointmentApi['mapApiToAppointment']({
        dateHeure: '2025-01-01T10:00',
        id: 1,
        patient: { id: 1 },
      }).dateHeure
    ).toBe('2025-01-01T10:00');
    expect(
      appointmentApi['mapApiToAppointment']({
        dateTime: '2025-01-01T11:00',
        id: 1,
        patient: { id: 1 },
      }).dateHeure
    ).toBe('2025-01-01T11:00');
    expect(
      appointmentApi['mapApiToAppointment']({
        date: '2025-01-01',
        heure: '12:00',
        id: 1,
        patient: { id: 1 },
      }).dateHeure
    ).toBe('2025-01-01T12:00');
  });
  it('mapApiToAppointment gère duree depuis duree, duration, dureeMinutes', () => {
    expect(
      appointmentApi['mapApiToAppointment']({ duree: 42, id: 1, patient: { id: 1 } }).duree
    ).toBe(42);
    expect(
      appointmentApi['mapApiToAppointment']({ duration: 43, id: 1, patient: { id: 1 } }).duree
    ).toBe(43);
    expect(
      appointmentApi['mapApiToAppointment']({ dureeMinutes: 44, id: 1, patient: { id: 1 } }).duree
    ).toBe(44);
  });
  it('mapApiPatient retourne un téléphone vide si aucun champ n’est présent', () => {
    const patient = appointmentApi['mapApiPatient']({});
    expect(patient.telephone).toBe('');
  });
  it('mapApiToAppointment retourne une dateHeure vide si aucun champ n’est présent', () => {
    const appt = appointmentApi['mapApiToAppointment']({ id: 1, patient: { id: 1 } });
    expect(appt.dateHeure).toBe('');
  });
});

describe('mapApiToAppointment - couverture maximale', () => {
  const { mapApiToAppointment } = appointmentApi;
  it('retourne statut par défaut si statut et status invalides', () => {
    const res = mapApiToAppointment({});
    expect(res.statut).toBe('scheduled');
  });
  it('retourne motif par défaut si aucun champ motif/raison/titre/title', () => {
    const res = mapApiToAppointment({});
    expect(res.motif).toBe('');
  });
  it('retourne dateHeure par défaut si aucun champ dateTime/dateHeure/date+heure', () => {
    const res = mapApiToAppointment({});
    expect(res.dateHeure).toBe('');
  });
  it('retourne duree par défaut si aucun champ duration/duree/dureeMinutes', () => {
    const res = mapApiToAppointment({});
    expect(res.duree).toBe(30);
  });
  it('retourne dateHeure construite à partir de date+heure', () => {
    const res = mapApiToAppointment({ date: '2025-07-01', heure: '10:00' });
    expect(res.dateHeure).toBe('2025-07-01T10:00');
  });
  it('retourne motif à partir de titre', () => {
    const res = mapApiToAppointment({ titre: 'Consultation' });
    expect(res.motif).toBe('Consultation');
  });
  it('retourne motif à partir de title', () => {
    const res = mapApiToAppointment({ title: 'Suivi' });
    expect(res.motif).toBe('Suivi');
  });
  it('retourne duree à partir de dureeMinutes', () => {
    const res = mapApiToAppointment({ dureeMinutes: 42 });
    expect(res.duree).toBe(42);
  });
});
describe('mapApiToAppointment - couverture extrême', () => {
  const { mapApiToAppointment } = appointmentApi;
  it('retourne statut par défaut si statut et status sont non-string', () => {
    const res = mapApiToAppointment({ statut: 123, status: null });
    expect(res.statut).toBe('scheduled');
  });
  it('retourne dateHeure vide si tous les champs dateTime/dateHeure/date/heure sont invalides', () => {
    const res = mapApiToAppointment({
      dateTime: 42,
      dateHeure: false,
      date: null,
      heure: undefined,
    });
    expect(res.dateHeure).toBe('');
  });
});
