/**
 * Tests unitaires du service patientService (TypeScript)
 * -----------------------------------------------------
 * - Vérifie le comportement des appels API (CRUD) côté front
 * - Mocke globalThis.fetch pour simuler les réponses backend
 * - Couvre les cas de succès, d'erreur API, et de gestion des retours
 * - Garantit la robustesse, la cohérence des erreurs et la compatibilité TypeScript stricte
 *
 * Convention :
 *   - Chaque test isole un cas d'usage (succès, erreur, suppression...)
 *   - Les mocks de Response sont stricts pour éviter les faux positifs
 *   - Les erreurs sont toujours propagées au format ApiError
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as patientService from '../patientService';

// Mock global fetch
type FetchMock = ReturnType<typeof vi.fn>;
const mockFetch: FetchMock = vi.fn();
globalThis.fetch = mockFetch as any;

describe('patientService', () => {
  afterEach(() => {
    mockFetch.mockReset();
  });

  /**
   * Teste la récupération de la liste des patients (succès)
   * Vérifie que le service retourne bien un tableau typé Patient[]
   */
  it('fetchPatients retourne un tableau de patients', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        { id: 1, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '2000-01-01' },
      ],
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
    } as unknown as Response);
    const patients = await patientService.fetchPatients();
    expect(Array.isArray(patients)).toBe(true);
    expect(patients[0].nom).toBe('Test');
  });

  /**
   * Teste la création d'un patient (succès)
   * Vérifie que le service retourne le patient créé avec un id
   */
  it('createPatient retourne le patient créé', async () => {
    const patient = { lastName: 'N', firstName: 'P', gender: 'F', birthDate: '1990-01-01' };
    mockFetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ ...patient, id: 2 }), // format anglais (ApiPatient)
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
    } as unknown as Response);
    const created = await patientService.createPatient(patient as any);
    expect(created.nom).toBe('N'); // mapping Patient (français)
  });

  /**
   * Teste la modification d'un patient (succès)
   * Vérifie que le service retourne le patient modifié
   */
  it('updatePatient retourne le patient modifié', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: 1,
        lastName: 'Modif',
        firstName: 'T',
        gender: 'M',
        birthDate: '2000-01-01',
      }), // format anglais (ApiPatient)
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
    } as unknown as Response);
    const updated = await patientService.updatePatient(1, { lastName: 'Modif' });
    expect(updated.nom).toBe('Modif');
  });

  /**
   * Teste la suppression d'un patient (succès)
   * Vérifie que le service retourne true si la suppression est effective
   */
  it('deletePatient retourne true', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 204,
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
    } as unknown as Response);
    const res = await patientService.deletePatient(1);
    expect(res).toBe(true);
  });

  /**
   * Teste la gestion d'une erreur API lors de la récupération des patients
   * Vérifie que le service propage une erreur formatée ApiError
   */
  it('fetchPatients gère une erreur API', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Erreur API' }),
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
    } as unknown as Response);
    await expect(patientService.fetchPatients()).rejects.toEqual({ error: 'Erreur API' });
  });
});
