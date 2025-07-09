import type { Patient } from './Patient';

export interface Appointment {
  id: number;
  patient: Patient;
  dateHeure: string; // format ISO
  duree: number;
  motif: string;
  statut: 'scheduled' | 'cancelled' | 'completed';
}
