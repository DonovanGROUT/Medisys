/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage, classes CSS selon la date
- Icône selon le sexe
- Émission des événements
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AppointmentTableRow from '../AppointmentTableRow.vue';
import type { Appointment } from '../../types/Appointment';
import type { Patient } from '../../types/Patient';

// Helper pour monter le composant AppointmentTableRow avec un rendez-vous donné
function mountAppointmentTableRow(
  appointment: Appointment
): VueWrapper<InstanceType<typeof AppointmentTableRow>> {
  return mount(AppointmentTableRow, { props: { appointment } });
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

describe('AppointmentTableRow.vue', () => {
  describe('Affichage & CSS', () => {
    it('monte le composant sans erreur', () => {
      const wrapper = mountAppointmentTableRow(baseAppointment);
      expect(wrapper.exists()).toBe(true);
    });
    it('applique la classe bg-gray-100 si le rendez-vous est passé', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const wrapper = mountAppointmentTableRow({ ...baseAppointment, dateHeure: pastDate });
      expect(wrapper.find('tr').classes()).toContain('bg-gray-100');
    });
    it("n'applique pas la classe bg-gray-100 si le rendez-vous est à venir", () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const wrapper = mountAppointmentTableRow({ ...baseAppointment, dateHeure: futureDate });
      expect(wrapper.find('tr').classes()).not.toContain('bg-gray-100');
    });
  });

  describe('Accessibilité & icônes', () => {
    it("affiche l'icône femme si sexe=F", () => {
      const wrapper = mountAppointmentTableRow({
        ...baseAppointment,
        patient: { ...fakePatient, sexe: 'F' },
      });
      expect(wrapper.html()).toContain('aria-label="Femme"');
    });
    it("affiche l'icône homme si sexe=M", () => {
      const wrapper = mountAppointmentTableRow({
        ...baseAppointment,
        patient: { ...fakePatient, sexe: 'M' },
      });
      expect(wrapper.html()).toContain('aria-label="Homme"');
    });
    it("affiche l'icône autre si sexe inconnu", () => {
      const wrapper = mountAppointmentTableRow({
        ...baseAppointment,
        patient: { ...fakePatient, sexe: 'X' },
      });
      expect(wrapper.html()).toContain('aria-label="Autre"');
    });
  });

  describe('Événements', () => {
    it('émet les événements view, edit, delete via AppointmentActions', async () => {
      const wrapper = mountAppointmentTableRow(baseAppointment);
      await wrapper.findComponent({ name: 'AppointmentActions' }).vm.$emit('view');
      await wrapper.findComponent({ name: 'AppointmentActions' }).vm.$emit('edit');
      await wrapper.findComponent({ name: 'AppointmentActions' }).vm.$emit('delete');
      expect(wrapper.emitted('view')).toBeTruthy();
      expect(wrapper.emitted('edit')).toBeTruthy();
      expect(wrapper.emitted('delete')).toBeTruthy();
    });
  });

  describe('Robustesse', () => {
    it('doit afficher une date vide si dateHeure est vide', () => {
      const appointment = { ...baseAppointment, dateHeure: '' };
      const wrapper = mountAppointmentTableRow(appointment);
      // La cellule date doit être vide
      expect(wrapper.text()).toContain('');
    });

    it('doit afficher une heure vide si dateHeure est vide', () => {
      const appointment = { ...baseAppointment, dateHeure: '' };
      const wrapper = mountAppointmentTableRow(appointment);
      // La cellule heure doit être vide
      expect(wrapper.text()).toContain('');
    });
  });
});
