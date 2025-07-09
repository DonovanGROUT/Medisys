// Type strict pour Patient (front)
export interface Patient {
  id: number;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  telephone?: string;
  email?: string;
}
