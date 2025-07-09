/**
 * -----------------------------------------------------
 * Sommaire des blocs de tests :
 * - Vérifie le comportement des appels API (CRUD) côté front
 * - Mocke globalThis.fetch pour simuler les réponses backend
 * - Couvre les cas de succès, d’erreur API, et de gestion des retours
 * - Garantit la robustesse, la cohérence des erreurs et la compatibilité TypeScript stricte
 * Helpers/mocks centralisés en haut de fichier.
 * -----------------------------------------------------
 */

/**
 * Tests unitaires du service patientService (TypeScript)
 * -----------------------------------------------------
 * Convention :
 *   - Chaque test isole un cas d'usage (succès, erreur, suppression...)
 *   - Les mocks de Response sont stricts pour éviter les faux positifs
 *   - Les erreurs sont toujours propagées au format ApiError
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as patientService from '../patientService';
import type { Patient } from '../../types/Patient';

// Helper strict pour mocker fetch
function mockFetchResponse<T>(data: T, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => data,
    headers: new Headers(),
    redirected: false,
    statusText: '',
    type: 'basic',
    url: '',
    clone: () => ({}) as Response,
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
    text: async () => '',
  } as Response;
}

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as typeof globalThis.fetch;

describe('patientService', () => {
  afterEach(() => {
    mockFetch.mockReset();
  });

  // --- Bloc : Lecture (fetchPatients) ---
  it('fetchPatients retourne un tableau de patients', async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse<unknown[]>([
        { id: 1, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '2000-01-01' },
      ])
    );
    const patients = await patientService.fetchPatients();
    expect(Array.isArray(patients)).toBe(true);
    expect(patients[0].nom).toBe('Test');
  });

  it('fetchPatients gère une erreur API', async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse<{ error: string }>({ error: 'Erreur API' }, false, 400)
    );
    await expect(patientService.fetchPatients()).rejects.toEqual({ error: 'Erreur API' });
  });

  it('fetchPatients lève une erreur si la réponse est true (réponse inattendue)', async () => {
    mockFetch.mockResolvedValue(mockFetchResponse<true>(true));
    await expect(patientService.fetchPatients()).rejects.toEqual({ error: 'Réponse inattendue' });
  });

  it('fetchPatients mappe correctement un patient avec tous les champs absents', async () => {
    mockFetch.mockResolvedValue(mockFetchResponse<unknown[]>([{}]));
    const patients = await patientService.fetchPatients();
    expect(patients[0]).toEqual({
      id: 0,
      nom: '',
      prenom: '',
      sexe: '',
      dateNaissance: '',
      telephone: '',
      email: '',
    });
  });

  it('fetchPatients mappe correctement un patient avec une date mal formée', async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse<unknown[]>([
        { id: 2, lastName: 'X', firstName: 'Y', gender: 'F', birthDate: 'notadate' },
      ])
    );
    const patients = await patientService.fetchPatients();
    expect(patients[0].dateNaissance).toBe('notadate');
  });

  it('fetchPatients mappe correctement un patient avec des champs API en français', async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse<unknown[]>([
        { id: 3, nom: 'FR', prenom: 'FR', sexe: 'M', dateNaissance: '2020-01-01' },
      ])
    );
    const patients = await patientService.fetchPatients();
    expect(patients[0].nom).toBe('FR');
    expect(patients[0].prenom).toBe('FR');
    expect(patients[0].sexe).toBe('M');
    expect(patients[0].dateNaissance).toBe('2020-01-01');
  });

  it('fetchPatients mappe correctement un patient avec une date ISO complète', async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse<unknown[]>([
        {
          id: 4,
          lastName: 'ISO',
          firstName: 'D',
          gender: 'F',
          birthDate: '2020-01-01T12:34:56.000Z',
        },
      ])
    );
    const patients = await patientService.fetchPatients();
    expect(patients[0].dateNaissance).toBe('2020-01-01');
  });

  // --- Bloc : Création (createPatient) ---
  it('createPatient retourne le patient créé', async () => {
    const patient: Patient = {
      id: 0,
      nom: '',
      prenom: '',
      sexe: '',
      dateNaissance: '',
      telephone: '',
      email: '',
    };
    mockFetch.mockResolvedValue(mockFetchResponse({ ...patient, id: 2, nom: 'N' }, true, 201));
    const created = await patientService.createPatient(patient);
    expect(created.nom).toBe('N');
  });

  it('createPatient lève une erreur si la réponse est true (réponse inattendue)', async () => {
    mockFetch.mockResolvedValue(mockFetchResponse<true>(true, true, 201));
    await expect(
      patientService.createPatient({
        sexe: 'F',
        nom: 'N',
        prenom: 'P',
        dateNaissance: '1990-01-01',
      } as Patient)
    ).rejects.toEqual({ error: 'Réponse inattendue' });
  });

  it("createPatient lève une erreur si la réponse ne contient pas d'id", async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse(
        { lastName: 'N', firstName: 'P', gender: 'F', birthDate: '1990-01-01' },
        true,
        201
      )
    );
    await expect(
      patientService.createPatient({
        sexe: 'F',
        nom: 'N',
        prenom: 'P',
        dateNaissance: '1990-01-01',
      } as Patient)
    ).rejects.toEqual({ error: 'Patient sans id' });
  });

  // --- Bloc : Modification (updatePatient) ---
  it('updatePatient retourne le patient modifié', async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse({
        id: 1,
        lastName: 'Modif',
        firstName: 'T',
        gender: 'M',
        birthDate: '2000-01-01',
      })
    );
    const updated = await patientService.updatePatient(1, { nom: 'Modif' });
    expect(updated.nom).toBe('Modif');
  });

  it('updatePatient lève une erreur si la réponse est true (réponse inattendue)', async () => {
    mockFetch.mockResolvedValue(mockFetchResponse<true>(true));
    await expect(patientService.updatePatient(1, { nom: 'N' })).rejects.toEqual({
      error: 'Réponse inattendue',
    });
  });

  it("updatePatient lève une erreur si la réponse ne contient pas d'id", async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse({ lastName: 'N', firstName: 'P', gender: 'F', birthDate: '1990-01-01' })
    );
    await expect(patientService.updatePatient(1, { nom: 'N' })).rejects.toEqual({
      error: 'Patient sans id',
    });
  });

  it('updatePatient propage une erreur formatée si fetch lève une exception', async () => {
    mockFetch.mockRejectedValue(new Error('Erreur réseau PATCH'));
    await expect(patientService.updatePatient(1, { nom: 'X' })).rejects.toMatchObject({
      error: expect.stringContaining(''),
    });
  });

  it('updatePatient propage une erreur formatée si une exception non-Error est levée', async () => {
    mockFetch.mockImplementation(() => {
      throw { custom: 'fail' };
    });
    await expect(patientService.updatePatient(2, { nom: 'Y' })).rejects.toMatchObject({
      error: expect.stringContaining(''),
    });
  });

  // --- Bloc : Suppression (deletePatient) ---
  it('deletePatient retourne true', async () => {
    mockFetch.mockResolvedValue(mockFetchResponse<true>(true, true, 204));
    const res = await patientService.deletePatient(1);
    expect(res).toBe(true);
  });

  it('deletePatient propage une erreur formatée si l’API retourne une erreur', async () => {
    mockFetch.mockResolvedValue(
      mockFetchResponse<{ error: string }>({ error: 'Suppression impossible' }, false, 400)
    );
    await expect(patientService.deletePatient(1)).rejects.toEqual({
      error: 'Suppression impossible',
    });
  });

  it.each([
    { name: 'erreur JS classique', error: new Error('Erreur réseau') },
    { name: 'exception string', error: 'fail' },
    { name: 'exception objet', error: { message: 'fail', code: 42 } },
  ])('deletePatient propage une erreur formatée si fetch lève une $name', async ({ error }) => {
    mockFetch.mockImplementation(() => {
      throw error;
    });
    await expect(patientService.deletePatient(999)).rejects.toMatchObject({
      error: expect.stringContaining(''),
    });
  });
});

describe('helpers internes patientService', () => {
  it('mapApiPatient gère un patient incomplet (tous champs manquants)', () => {
    const patient = patientService['mapApiPatient']({});
    expect(patient.id).toBe(0);
    expect(patient.nom).toBe('');
    expect(patient.prenom).toBe('');
    expect(patient.sexe).toBe('');
    expect(patient.dateNaissance).toBe('');
    expect(patient.telephone).toBe('');
    expect(patient.email).toBe('');
  });

  it('mapApiPatient gère un patient avec champs alternatifs (nom/prenom/sexe)', () => {
    const patient = patientService['mapApiPatient']({
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

  it('mapApiPatient gère un patient API mal typé (id string)', () => {
    const patient = patientService['mapApiPatient']({
      id: 'foo',
      lastName: 'N',
      firstName: 'P',
      gender: 'F',
      birthDate: '2000-01-01',
    });
    expect(patient.id).toBe(0);
    expect(patient.nom).toBe('N');
    expect(patient.prenom).toBe('P');
    expect(patient.sexe).toBe('F');
    expect(patient.dateNaissance).toBe('2000-01-01');
  });

  it('mapApiPatient gère le fallback sur alt.telephone si phone absent', () => {
    const patient = patientService['mapApiPatient']({
      telephone: '0123456789',
    });
    expect(patient.telephone).toBe('0123456789');
    expect(patient.email).toBe('');
  });

  it('mapApiPatient retourne un téléphone vide si aucun champ n’est présent', () => {
    const patient = patientService['mapApiPatient']({});
    expect(patient.telephone).toBe('');
  });

  describe('mapApiPatient - fallback téléphone vide', () => {
    const { mapApiPatient } = patientService;
    it('retourne téléphone vide si ni phone ni telephone ne sont des strings', () => {
      const res = mapApiPatient({ phone: null, telephone: 123 });
      expect(res.telephone).toBe('');
    });
  });

  describe('mapApiPatient - fallback téléphone vide (tous champs absents)', () => {
    const { mapApiPatient } = patientService;
    it('retourne téléphone vide si phone et telephone sont absents', () => {
      const res = mapApiPatient({});
      expect(res.telephone).toBe('');
    });
  });
});
