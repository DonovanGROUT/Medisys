/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage du statut, patient, classes CSS selon la date
- Robustesse (statuts inconnus)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AppointmentItem from '../AppointmentItem.vue';
import type { Appointment } from '../../types/Appointment';
import type { Patient } from '../../types/Patient';

// Helper pour monter le composant AppointmentItem avec un rendez-vous donné
function mountAppointmentItem(
  appointment: Appointment
): VueWrapper<InstanceType<typeof AppointmentItem>> {
  return mount(AppointmentItem, { props: { appointment } });
}

const fakePatient: Patient = {
  id: 1,
  nom: 'Dupont',
  prenom: 'Marie',
  sexe: 'F',
  dateNaissance: '1985-04-12',
};

const baseAppointment: Appointment = {
  id: 1,
  patient: fakePatient,
  dateHeure: '2025-07-02T10:00:00',
  duree: 30,
  motif: 'Consultation',
  statut: 'scheduled',
};

describe('AppointmentItem.vue', () => {
  describe('Affichage', () => {
    it('monte le composant sans erreur', () => {
      const wrapper = mountAppointmentItem(baseAppointment);
      expect(wrapper.exists()).toBe(true);
    });
    it('affiche le statut "À venir" pour scheduled', () => {
      const wrapper = mountAppointmentItem({ ...baseAppointment, statut: 'scheduled' });
      expect(wrapper.text()).toContain('Statut : À venir');
    });
    it('affiche le statut "Annulé" pour cancelled', () => {
      const wrapper = mountAppointmentItem({ ...baseAppointment, statut: 'cancelled' });
      expect(wrapper.text()).toContain('Statut : Annulé');
    });
    it('affiche le statut "Terminé" pour completed', () => {
      const wrapper = mountAppointmentItem({ ...baseAppointment, statut: 'completed' });
      expect(wrapper.text()).toContain('Statut : Terminé');
    });
    it('affiche le statut brut pour un statut inconnu', () => {
      // Test de robustesse : cast via unknown pour simuler un statut inconnu
      const appointment = { ...baseAppointment, statut: 'autre' } as unknown as Appointment;
      const wrapper = mountAppointmentItem(appointment);
      expect(wrapper.text()).toContain('Statut : autre');
    });
    it('affiche le SVG "Autre" si le sexe du patient est inconnu', () => {
      const appointment = {
        ...baseAppointment,
        patient: { ...fakePatient, sexe: '' },
      };
      const wrapper = mountAppointmentItem(appointment);
      // Vérifie la présence de l’icône "Autre" (aria-label)
      const svg = wrapper.find('svg[aria-label="Autre"]');
      expect(svg.exists()).toBe(true);
    });
    it('affiche le SVG "Homme", le statut "Confirmé" et la bonne classe pour un patient masculin confirmé', () => {
      const appointment = {
        ...baseAppointment,
        statut: 'confirmed',
        patient: { ...fakePatient, sexe: 'M' },
      } as unknown as Appointment;
      const wrapper = mountAppointmentItem(appointment);
      // Vérifie la présence de l’icône "Homme"
      const svg = wrapper.find('svg[aria-label="Homme"]');
      expect(svg.exists()).toBe(true);
      // Vérifie le texte du statut
      expect(wrapper.text()).toContain('Statut : Confirmé');
      // Vérifie la classe CSS du badge
      const badge = wrapper.find('[aria-label="Statut du rendez-vous"]');
      expect(badge.classes()).toContain('bg-green-800');
    });
  });

  describe('CSS & Robustesse', () => {
    it('applique la classe bg-gray-100 si le rendez-vous est passé', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const wrapper = mountAppointmentItem({ ...baseAppointment, dateHeure: pastDate });
      expect(wrapper.classes()).toContain('bg-gray-100');
    });
    it("n'applique pas la classe bg-gray-100 si le rendez-vous est à venir", () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const wrapper = mountAppointmentItem({ ...baseAppointment, dateHeure: futureDate });
      expect(wrapper.classes()).not.toContain('bg-gray-100');
    });
  });
});
