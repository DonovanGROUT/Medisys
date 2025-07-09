/**
 * Service Patient (TypeScript)
 * ---------------------------
 * Fournit les fonctions d'accès à l'API Patient (CRUD) côté front.
 * - Centralise les appels réseau et la gestion des erreurs (via apiErrorHandler)
 * - Garantit le typage strict des données Patient
 * - Utilisé par les vues et composants Vue.js pour toutes les opérations patient
 *
 * Mapping API ↔ Front :
 *   - L’API expose les champs en anglais (lastName, firstName, gender, birthDate, phone, email)
 *   - Le frontend utilise les champs en français (nom, prenom, sexe, dateNaissance, telephone, email)
 *   - La conversion est assurée ici dans les fonctions de mapping
 *
 * Sécurité :
 *   - Ne stocke aucune donnée sensible côté client
 *   - Ne jamais exposer de logique métier critique ici
 *
 * Convention :
 *   - Toutes les erreurs sont formatées et propagées via ApiError
 *   - Les réponses 204 (DELETE) retournent true
 */
import { handleApiResponse, formatError } from '../utils/apiErrorHandler';
import type { Patient } from '../types/Patient';

export interface ApiPatient {
  id?: number;
  gender: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  phone?: string;
  email?: string;
}

/**
 * Mapping robuste d'un objet API (anglais ou français) vers Patient (français)
 * @param {unknown} p - Objet patient reçu de l'API
 * @returns {Patient}
 */
function mapApiPatient(p: unknown): Patient {
  const api = p as Partial<ApiPatient>;
  const alt = p as Record<string, unknown>;
  return {
    id: typeof api.id === 'number' ? api.id : 0,
    nom:
      typeof api.lastName === 'string' ? api.lastName : typeof alt.nom === 'string' ? alt.nom : '',
    prenom:
      typeof api.firstName === 'string'
        ? api.firstName
        : typeof alt.prenom === 'string'
          ? alt.prenom
          : '',
    sexe:
      typeof api.gender === 'string' ? api.gender : typeof alt.sexe === 'string' ? alt.sexe : '',
    dateNaissance:
      (typeof api.birthDate === 'string'
        ? api.birthDate
        : typeof alt.dateNaissance === 'string'
          ? alt.dateNaissance
          : ''
      ).split('T')[0] || '',
    telephone:
      typeof api.phone === 'string'
        ? api.phone
        : typeof alt.telephone === 'string'
          ? alt.telephone
          : '',
    email: typeof api.email === 'string' ? api.email : '',
  };
}

/**
 * Récupère la liste des patients depuis l'API.
 * @returns {Promise<Patient[]>} Tableau de patients
 * @throws {ApiError} en cas d'erreur API ou réseau
 */
export async function fetchPatients(): Promise<Patient[]> {
  try {
    const response = await fetch('/api/patients');
    const data = await handleApiResponse<unknown[]>(response, 'Erreur API (liste)');
    if (data === true) throw formatError({}, 'Réponse inattendue');
    // Mapping explicite (robuste)
    return data.map(mapApiPatient);
  } catch (e) {
    throw formatError(e);
  }
}

/**
 * Crée un nouveau patient via l'API.
 * @param {ApiPatient} patient - Données du patient à créer (format API)
 * @returns {Promise<Patient>} Patient créé (avec id)
 * @throws {ApiError} en cas d'erreur API ou validation
 */
export async function createPatient(patient: Patient): Promise<Patient> {
  try {
    // Conversion Patient (fr) -> ApiPatient (en)
    const apiPatient: ApiPatient = {
      gender: patient.sexe,
      lastName: patient.nom,
      firstName: patient.prenom,
      birthDate: patient.dateNaissance,
      phone: patient.telephone,
      email: patient.email,
    };
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPatient),
    });
    const data = await handleApiResponse<unknown>(response, 'Erreur API (création)');
    if (data === true) throw formatError({}, 'Réponse inattendue');
    if (typeof (data as Record<string, unknown>).id !== 'number')
      throw formatError({}, 'Patient sans id');
    return mapApiPatient(data);
  } catch (e) {
    throw formatError(e);
  }
}

/**
 * Modifie un patient existant (partiel, PATCH).
 * @param {number} id - Identifiant du patient
 * @param {Partial<ApiPatient>} patient - Champs à modifier (format API)
 * @returns {Promise<Patient>} Patient modifié
 * @throws {ApiError} en cas d'erreur API ou validation
 */
export async function updatePatient(id: number, patient: Partial<Patient>): Promise<Patient> {
  try {
    // Conversion partielle Patient (fr) -> ApiPatient (en)
    const apiPatient: Partial<ApiPatient> = {};
    if (patient.sexe !== undefined) apiPatient.gender = patient.sexe;
    if (patient.nom !== undefined) apiPatient.lastName = patient.nom;
    if (patient.prenom !== undefined) apiPatient.firstName = patient.prenom;
    if (patient.dateNaissance !== undefined) apiPatient.birthDate = patient.dateNaissance;
    if (patient.telephone !== undefined) apiPatient.phone = patient.telephone;
    if (patient.email !== undefined) apiPatient.email = patient.email;
    const response = await fetch(`/api/patients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPatient),
    });
    const data = await handleApiResponse<unknown>(response, 'Erreur API (modification)');
    if (data === true) throw formatError({}, 'Réponse inattendue');
    if (typeof (data as Record<string, unknown>).id !== 'number')
      throw formatError({}, 'Patient sans id');
    return mapApiPatient(data);
  } catch (e) {
    throw formatError(e);
  }
}

/**
 * Supprime un patient par son identifiant.
 * @param {number} id - Identifiant du patient à supprimer
 * @returns {Promise<true>} true si suppression réussie (204)
 * @throws {ApiError} en cas d'erreur API
 */
export async function deletePatient(id: number): Promise<true> {
  try {
    const response = await fetch(`/api/patients/${id}`, {
      method: 'DELETE',
    });
    return await handleApiResponse<true>(response, 'Erreur API (suppression)');
  } catch (e) {
    throw formatError(e);
  }
}

export { mapApiPatient };
export type { Patient };
