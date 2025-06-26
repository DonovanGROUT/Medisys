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
