/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage, robustesse sur champs vides
- Statut, icône, lien patient
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AppointmentView from '../AppointmentView.vue';
import type { Appointment } from '../../types/Appointment';
import type { Patient } from '../../types/Patient';

// Helper pour monter le composant AppointmentView avec un rendez-vous donné et stubs personnalisés
function mountAppointmentView(
  appointment: Appointment | null,
  stubs?: Record<string, unknown>
): VueWrapper<InstanceType<typeof AppointmentView>> {
  return mount(AppointmentView, {
    props: { appointment },
    global: { stubs: { BaseIcon: true, 'router-link': true, ...stubs } },
  });
}

const basePatient: Patient = {
  id: 1,
  nom: 'Dupont',
  prenom: 'Marie',
  sexe: 'F',
  dateNaissance: '1985-04-12',
};

const baseAppointment: Appointment = {
  id: 1,
  patient: { ...basePatient },
  dateHeure: '2025-07-02T10:00:00',
  duree: 30,
  motif: 'Consultation',
  statut: 'scheduled',
};

// Helper pour statut arbitraire (robustesse)
function fakeAppointmentWithStatus(status: string): Appointment {
  return { ...baseAppointment, statut: status } as unknown as Appointment;
}

describe('AppointmentView.vue', () => {
  describe('Affichage', () => {
    it('monte le composant sans erreur', () => {
      const wrapper = mountAppointmentView(baseAppointment);
      expect(wrapper.exists()).toBe(true);
    });
    it('affiche tous les champs du rendez-vous', () => {
      const wrapper = mountAppointmentView(baseAppointment);
      expect(wrapper.text()).toContain('Consultation');
      expect(wrapper.text()).toContain('02/07/2025');
      expect(wrapper.text()).toContain('10:00');
      expect(wrapper.text()).toContain('Dupont');
      expect(wrapper.text()).toContain('Marie');
      expect(wrapper.text()).toContain('30 min');
      expect(wrapper.text()).toContain('À venir');
    });
    it('affiche un tiret si un champ est vide', () => {
      const appointment = {
        ...baseAppointment,
        motif: '',
        dateHeure: '',
        patient: { ...basePatient, nom: '', prenom: '' },
      };
      const wrapper = mountAppointmentView(appointment);
      expect(wrapper.text()).toContain('—');
    });
    it('affiche le message d’absence si appointment=null', () => {
      const wrapper = mountAppointmentView(null);
      expect(wrapper.text()).toMatch(/aucun rendez-vous sélectionné/i);
    });
    it('affiche le lien vers la fiche patient si patient.id existe', () => {
      const wrapper = mountAppointmentView(baseAppointment, {
        'router-link': { template: '<a data-testid="patient-link"></a>' },
      });
      expect(wrapper.find('[data-testid="patient-link"]').exists()).toBe(true);
    });
    it('n’affiche pas le lien patient si patient.id est absent', () => {
      const appointment = {
        ...baseAppointment,
        patient: { ...basePatient, id: undefined as unknown as number },
      };
      const wrapper = mountAppointmentView(appointment);
      expect(wrapper.find('a').exists()).toBe(false);
    });
  });

  describe('Accessibilité & icônes', () => {
    it('affiche l’icône correct selon le sexe', () => {
      const wrapperF = mountAppointmentView(
        { ...baseAppointment, patient: { ...basePatient, sexe: 'F' } },
        { BaseIcon: { template: '<span data-testid="icon-f"></span>' } }
      );
      expect(wrapperF.html()).toContain('icon-f');
      const wrapperM = mountAppointmentView(
        { ...baseAppointment, patient: { ...basePatient, sexe: 'M' } },
        { BaseIcon: { template: '<span data-testid="icon-m"></span>' } }
      );
      expect(wrapperM.html()).toContain('icon-m');
      const wrapperX = mountAppointmentView(
        { ...baseAppointment, patient: { ...basePatient, sexe: 'X' } },
        { BaseIcon: { template: '<span data-testid="icon-x"></span>' } }
      );
      expect(wrapperX.html()).toContain('icon-x');
    });
  });

  describe('Robustesse', () => {
    it('traduit le statut en français et gère un statut inconnu', () => {
      const wrapper = mountAppointmentView(fakeAppointmentWithStatus('foobar'));
      expect(wrapper.text()).toContain('foobar');
    });
    it('gère un patient incomplet (pas de nom/prenom)', () => {
      const appointment = {
        ...baseAppointment,
        patient: { id: 2, nom: '', prenom: '', sexe: '', dateNaissance: '' },
      };
      const wrapper = mountAppointmentView(appointment);
      expect(wrapper.text()).toContain('—');
    });
    it('affiche le statut Terminé pour un rendez-vous terminé', () => {
      const wrapper = mountAppointmentView({ ...baseAppointment, statut: 'completed' });
      expect(wrapper.text()).toContain('Terminé');
    });
    it('affiche le statut Annulé pour un rendez-vous annulé', () => {
      const wrapper = mountAppointmentView({ ...baseAppointment, statut: 'cancelled' });
      expect(wrapper.text()).toContain('Annulé');
    });
    it('affiche un tiret si seul le nom est vide', () => {
      const appointment = {
        ...baseAppointment,
        patient: { ...basePatient, nom: '', prenom: 'Marie' },
      };
      const wrapper = mountAppointmentView(appointment);
      expect(wrapper.text()).toContain('—');
    });
    it('affiche un tiret si seul le prénom est vide', () => {
      const appointment = {
        ...baseAppointment,
        patient: { ...basePatient, nom: 'Dupont', prenom: '' },
      };
      const wrapper = mountAppointmentView(appointment);
      expect(wrapper.text()).toContain('—');
    });
    it('affiche un tiret si la date de naissance est absente', () => {
      const appointment = { ...baseAppointment, patient: { ...basePatient, dateNaissance: '' } };
      const wrapper = mountAppointmentView(appointment);
      expect(wrapper.text()).toContain('—');
    });
    it('affiche un tiret si la durée est absente', () => {
      const appointment = { ...baseAppointment, duree: undefined as unknown as number };
      const wrapper = mountAppointmentView(appointment);
      expect(wrapper.text()).toContain('—');
    });
    it('affiche un tiret si tous les champs sont vides', () => {
      const appointment = fakeAppointmentWithStatus('');
      appointment.id = 99;
      appointment.patient = { id: 0, nom: '', prenom: '', sexe: '', dateNaissance: '' };
      appointment.dateHeure = '';
      appointment.duree = undefined as unknown as number;
      appointment.motif = '';
      const wrapper = mountAppointmentView(appointment);
      expect(wrapper.text()).toContain('—');
    });
    it('affiche le statut brut si inconnu', () => {
      const wrapper = mountAppointmentView(fakeAppointmentWithStatus('unexpected_status'));
      expect(wrapper.text()).toContain('unexpected_status');
    });
  });
});
