/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage des informations patient (nom, genre, date, etc.)
- Fallback (tiret) si données manquantes
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import PatientView from '../PatientView.vue';
import type { Patient } from '../../types/Patient';

// Helper pour monter le composant PatientView avec un patient donné
function mountView(patient: Patient | null): VueWrapper<InstanceType<typeof PatientView>> {
  return mount(PatientView, { props: { patient } });
}

describe('PatientView.vue', () => {
  const patient: Patient = {
    id: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    sexe: 'F',
    dateNaissance: '1985-04-12',
    telephone: '0601020304',
    email: 'marie.dupont@email.com',
  };

  describe('Affichage', () => {
    it('doit afficher toutes les infos du patient', () => {
      const wrapper = mountView(patient);
      expect(wrapper.text()).toContain('DUPONT');
      expect(wrapper.text()).toContain('Marie');
      expect(wrapper.text()).toContain('Femme');
      // Date attendue au format littéral local (ex: 12 avril 1985)
      const expectedDate = new Date('1985-04-12').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      });
      expect(wrapper.text()).toContain(expectedDate);
      expect(wrapper.text()).toContain('0601020304');
      expect(wrapper.text()).toContain('marie.dupont@email.com');
    });

    it('doit afficher un tiret si téléphone ou email manquant', () => {
      const wrapper = mountView({ ...patient, telephone: '', email: '' });
      expect(wrapper.text()).toContain('—');
    });
  });

  describe('Robustesse', () => {
    it('doit afficher une chaîne vide si date de naissance absente', () => {
      const wrapper = mountView({ ...patient, dateNaissance: '' });
      const dateEl = wrapper.findAll('p')[3];
      if (dateEl) {
        expect(dateEl.text().trim()).toBe('');
      } else {
        expect(dateEl).toBeUndefined();
      }
    });
    it('doit afficher la date au format français si navigateur en fr', () => {
      const originalLang = Object.getOwnPropertyDescriptor(window.navigator, 'language');
      Object.defineProperty(window.navigator, 'language', { value: 'fr-FR', configurable: true });
      const wrapper = mountView({ ...patient, dateNaissance: '1990-01-01' });
      expect(wrapper.text()).toContain('01/01/1990');
      if (originalLang) Object.defineProperty(window.navigator, 'language', originalLang);
    });
    it('doit afficher la date au format local si navigateur non-français', () => {
      const originalLang = Object.getOwnPropertyDescriptor(window.navigator, 'language');
      Object.defineProperty(window.navigator, 'language', { value: 'en-US', configurable: true });
      const wrapper = mountView({ ...patient, dateNaissance: '1990-01-01' });
      expect(wrapper.text()).toMatch(/1990/);
      if (originalLang) Object.defineProperty(window.navigator, 'language', originalLang);
    });
  });
});
