/**
 * Service Patient (TypeScript)
 * ---------------------------
 * Fournit les fonctions d'accès à l'API Patient (CRUD) côté front.
 * - Centralise les appels réseau et la gestion des erreurs (via apiErrorHandler)
 * - Garantit le typage strict des données Patient
 * - Utilisé par les vues et composants Vue.js pour toutes les opérations patient
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

export interface Patient {
  id?: number;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  telephone?: string;
  email?: string;
}

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
 * Récupère la liste des patients depuis l'API.
 * @returns {Promise<Patient[]>} Tableau de patients
 * @throws {ApiError} en cas d'erreur API ou réseau
 */
export async function fetchPatients(): Promise<Patient[]> {
  try {
    const response = await fetch('/api/patients');
    const data = await handleApiResponse<Patient[]>(response, 'Erreur API (liste)');
    if (data === true) throw formatError({}, 'Réponse inattendue');
    return data;
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
export async function createPatient(patient: ApiPatient): Promise<Patient> {
  try {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    const data = await handleApiResponse<ApiPatient>(response, 'Erreur API (création)');
    if (data === true) throw formatError({}, 'Réponse inattendue');
    // Mapping explicite ApiPatient → Patient
    if (typeof data.id !== 'number') throw formatError({}, 'Patient sans id');
    return {
      id: data.id,
      nom: data.lastName,
      prenom: data.firstName,
      sexe: data.gender,
      dateNaissance: data.birthDate ? data.birthDate.split('T')[0] : '',
      telephone: data.phone ?? '',
      email: data.email ?? '',
    };
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
export async function updatePatient(id: number, patient: Partial<ApiPatient>): Promise<Patient> {
  try {
    const response = await fetch(`/api/patients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    const data = await handleApiResponse<ApiPatient>(response, 'Erreur API (modification)');
    if (data === true) throw formatError({}, 'Réponse inattendue');
    // Mapping explicite ApiPatient → Patient
    if (typeof data.id !== 'number') throw formatError({}, 'Patient sans id');
    return {
      id: data.id,
      nom: data.lastName,
      prenom: data.firstName,
      sexe: data.gender,
      dateNaissance: data.birthDate ? data.birthDate.split('T')[0] : '',
      telephone: data.phone ?? '',
      email: data.email ?? '',
    };
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
