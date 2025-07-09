/**
 * =============================================================
 * Déclarations de types pour le service patientService
 * -------------------------------------------------------------
 * Définit l’interface ApiPatient et les signatures des fonctions d’accès aux patients.
 *
 * - Utilisé pour typer les accès API côté frontend
 * - Garantit la cohérence des types entre les modules
 * - À maintenir synchronisé avec l’implémentation réelle du service
 *
 * Convention : bloc JSDoc descriptif en tête de fichier de déclaration.
 * =============================================================
 */

// Déclaration de type pour le service patientService.js
export interface ApiPatient {
  id: number;
  gender: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  phone: string;
  email: string;
}

export function fetchPatients(): Promise<ApiPatient[]>;
export function createPatient(patient: Partial<ApiPatient>): Promise<ApiPatient>;
export function updatePatient(id: number, patient: Partial<ApiPatient>): Promise<ApiPatient>;
export function deletePatient(id: number): Promise<boolean>;
