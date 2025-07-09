/**
 * =============================================================
 * Service d’accès et de mapping pour les rendez-vous (Appointment)
 * -------------------------------------------------------------
 * Fournit les fonctions d’appel à l’API backend pour la gestion des rendez-vous,
 * ainsi que le mapping entre les formats API (backend) et front (TypeScript).
 *
 * - Mapping API <-> Front : conversion des champs, adaptation des noms et formats.
 * - Gestion des statuts : scheduled | cancelled | completed
 * - Gestion des erreurs : toutes les fonctions lèvent une erreur en cas d’échec HTTP.
 * - Sécurité : aucune donnée sensible n’est stockée côté front.
 *
 * Conventions :
 * - Toutes les fonctions asynchrones renvoient une Promise typée.
 * - Les fonctions de mapping sont isolées et testables.
 * - Les commentaires JSDoc sont présents sur chaque fonction exportée.
 * =============================================================
 */

import type { Patient } from '../types/Patient';
import type { Appointment } from '../types/Appointment';

const API_URL = '/api/appointments';

/**
 * Vérifie si une valeur correspond à un statut valide de rendez-vous.
 * @param val Valeur à tester
 * @returns true si la valeur est un statut reconnu
 */
function isStatut(val: unknown): val is 'scheduled' | 'cancelled' | 'completed' {
  return val === 'scheduled' || val === 'cancelled' || val === 'completed';
}

/**
 * Convertit un objet patient reçu de l’API en Patient typé front.
 * Gère les variations de nommage (camelCase/snake_case) et les champs alternatifs.
 * @param p Objet patient brut (API)
 * @returns Patient typé front
 */
function mapApiPatient(p: unknown): Patient {
  const api = p as Partial<
    Patient & {
      lastName?: string;
      firstName?: string;
      gender?: string;
      birthDate?: string;
      phone?: string;
      email?: string;
    }
  >;
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
 * Convertit un objet rendez-vous reçu de l’API en Appointment typé front.
 * Gère les variations de nommage et les champs alternatifs.
 * @param apiData Objet rendez-vous brut (API)
 * @returns Appointment typé front
 */
function mapApiToAppointment(apiData: unknown): Appointment {
  const data = apiData as Record<string, unknown>;
  const defaultPatient: Patient = {
    id: 0,
    nom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    telephone: '',
    email: '',
  };
  let statut: 'scheduled' | 'cancelled' | 'completed' = 'scheduled';
  if (isStatut(data.statut)) {
    statut = data.statut;
  } else if (isStatut(data.status)) {
    statut = data.status;
  }
  const motif =
    typeof data.reason === 'string'
      ? data.reason
      : typeof data.motif === 'string'
        ? data.motif
        : typeof data.titre === 'string'
          ? data.titre
          : typeof data.title === 'string'
            ? data.title
            : '';
  const dateHeure =
    typeof data.dateTime === 'string'
      ? data.dateTime
      : typeof data.dateHeure === 'string'
        ? data.dateHeure
        : typeof data.date === 'string' && typeof data.heure === 'string'
          ? `${data.date}T${data.heure}`
          : '';
  const duree =
    typeof data.duration === 'number'
      ? data.duration
      : typeof data.duree === 'number'
        ? data.duree
        : typeof data.dureeMinutes === 'number'
          ? data.dureeMinutes
          : 30;
  return {
    id: typeof data.id === 'number' ? data.id : 0,
    patient:
      typeof data.patient === 'object' && data.patient !== null && 'id' in data.patient
        ? mapApiPatient(data.patient)
        : defaultPatient,
    statut,
    dateHeure,
    duree,
    motif,
  };
}

/**
 * Récupère la liste des rendez-vous depuis l’API.
 * @returns Liste des rendez-vous (Appointment[])
 * @throws Error en cas d’échec HTTP
 */
export async function getAppointments(): Promise<Appointment[]> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Erreur lors du chargement des rendez-vous');
  const data = await response.json();
  // Si l'API renvoie un tableau
  return Array.isArray(data) ? data.map(mapApiToAppointment) : [];
}

/**
 * Crée un nouveau rendez-vous via l’API.
 * @param appointment Données du rendez-vous à créer (partielles)
 * @returns Rendez-vous créé (Appointment)
 * @throws Error en cas d’échec HTTP
 */
export async function createAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
  // Adapter le payload pour l'API (Front -> API)
  const payload = {
    patientId: appointment.patient?.id,
    dateTime: appointment.dateHeure,
    duration: appointment.duree,
    reason: appointment.motif,
    status: appointment.statut,
  };
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erreur lors de la création du rendez-vous');
  const data = await response.json();
  return mapApiToAppointment(data);
}

/**
 * Supprime un rendez-vous via l’API.
 * @param id Identifiant du rendez-vous à supprimer
 * @throws Error en cas d’échec HTTP
 */
export async function deleteAppointment(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression du rendez-vous');
}

/**
 * Met à jour un rendez-vous via l’API.
 * @param id Identifiant du rendez-vous à modifier
 * @param appointment Données partielles à mettre à jour
 * @returns Rendez-vous modifié (Appointment)
 * @throws Error en cas d’échec HTTP
 */
export async function updateAppointment(
  id: number,
  appointment: Partial<Appointment>
): Promise<Appointment> {
  const payload = {
    patientId: appointment.patient?.id,
    dateTime: appointment.dateHeure,
    duration: appointment.duree,
    reason: appointment.motif,
    status: appointment.statut,
  };
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erreur lors de la modification du rendez-vous');
  const data = await response.json();
  return mapApiToAppointment(data);
}

export { isStatut, mapApiToAppointment, mapApiPatient };
