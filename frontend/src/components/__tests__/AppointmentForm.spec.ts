/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage général & DOM
- Bouton Valider (création, édition)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppointmentForm from '../AppointmentForm.vue';

// Vérifie le montage du composant AppointmentForm

describe('AppointmentForm.vue', () => {
  describe('Affichage', () => {
    it('doit se monter sans erreur', () => {
      const wrapper = mount(AppointmentForm, {
        global: { stubs: { BaseIcon: true } },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });
  describe('Bouton Valider', () => {
    it('affiche le bouton Valider en mode création', () => {
      const wrapper = mount(AppointmentForm, {
        global: { stubs: { BaseIcon: true } },
      });
      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain('Valider');
      expect(button.attributes('aria-label')).toBe('Valider le formulaire rendez-vous');
    });
    it('affiche le bouton Valider en mode édition', () => {
      const wrapper = mount(AppointmentForm, {
        props: { modelValue: { id: 1 } },
        global: { stubs: { BaseIcon: true } },
      });
      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain('Valider');
      expect(button.attributes('aria-label')).toBe('Valider le formulaire rendez-vous');
    });
  });
  // Le focus trap est testé dans les tests de la modale (Modal.vue/BaseModal.vue)
});
