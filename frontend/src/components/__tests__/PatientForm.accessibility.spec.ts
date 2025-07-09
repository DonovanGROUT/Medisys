/*
-------------------------------------------------
Sommaire des blocs de tests :
- Accessibilité ARIA
- Association des erreurs
- Champs requis
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import PatientForm from '../PatientForm.vue';

// Helper pour monter le composant PatientForm avec props optionnelles
function mountPatientForm(
  props?: Record<string, unknown>
): VueWrapper<InstanceType<typeof PatientForm>> {
  return mount(PatientForm, { props });
}

describe('PatientForm.vue — Accessibilité', () => {
  describe('Structure ARIA du formulaire', () => {
    it('doit avoir un aria-label explicite', () => {
      const wrapper = mountPatientForm();
      const form = wrapper.find('form');
      expect(form.attributes('aria-label')).toBe('Formulaire patient');
    });
  });

  describe('Association des erreurs aux champs', () => {
    it('doit associer les erreurs via aria-describedby et role=alert', async () => {
      const wrapper = mountPatientForm({ errors: { nom: 'Erreur nom', email: 'Erreur email' } });
      await wrapper.find('#lastName').setValue('');
      await wrapper.find('#email').setValue('');
      expect(wrapper.find('#lastName').attributes('aria-describedby')).toContain('lastName-error');
      expect(wrapper.find('#email').attributes('aria-describedby')).toContain('email-error');
      expect(wrapper.find('#lastName-error').attributes('role')).toBe('alert');
      expect(wrapper.find('#email-error').attributes('role')).toBe('alert');
    });
  });

  describe('Champs requis', () => {
    it('doit indiquer les champs requis avec aria-required', () => {
      const wrapper = mountPatientForm();
      expect(wrapper.find('#lastName').attributes('aria-required')).toBe('true');
      expect(wrapper.find('#firstName').attributes('aria-required')).toBe('true');
      expect(wrapper.find('#sexe').attributes('aria-required')).toBe('true');
      expect(wrapper.find('#dateNaissance').attributes('aria-required')).toBe('true');
      expect(wrapper.find('#email').attributes('aria-required')).toBe('true');
      expect(wrapper.find('#telephone').attributes('aria-required')).toBe('false');
    });
  });

  describe('Accessibilité des boutons', () => {
    it('doit avoir des boutons accessibles au clavier et avec aria-label', () => {
      const wrapper = mountPatientForm();
      const buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('aria-label')).toMatch(/annuler/i);
      expect(buttons[1].attributes('aria-label')).toMatch(/valider/i);
    });
  });

  describe('Message d’erreur global', () => {
    it('doit être accessible (role="alert" et aria-live)', async () => {
      const wrapper = mountPatientForm({ errors: { global: 'Erreur globale' } });
      const globalError = wrapper.find('#form-global-error');
      expect(globalError.exists()).toBe(true);
      expect(globalError.attributes('role')).toBe('alert');
      expect(globalError.attributes('aria-live')).toBe('assertive');
    });
  });
});
