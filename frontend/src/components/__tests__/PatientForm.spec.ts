/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage de tous les champs du formulaire
- Émission des événements submit/cancel
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import PatientForm from '../PatientForm.vue';
import type { PatientFormModel } from '../PatientForm.vue';

// Helper pour monter le composant PatientForm avec props optionnelles
function mountForm(
  props?: Partial<InstanceType<typeof PatientForm>['$props']>
): VueWrapper<InstanceType<typeof PatientForm>> {
  return mount(PatientForm, { props });
}

describe('PatientForm.vue', () => {
  describe('Affichage', () => {
    it('doit afficher tous les champs du formulaire', () => {
      const wrapper = mountForm();
      expect(wrapper.html()).toContain('Nom');
      expect(wrapper.html()).toContain('Prénom');
      expect(wrapper.html()).toContain('Sexe');
      expect(wrapper.html()).toContain('Date de naissance');
      expect(wrapper.html()).toContain('Téléphone');
      expect(wrapper.html()).toContain('Email');
    });
  });

  describe('Événements', () => {
    it('doit émettre "submit" avec les bonnes données', async () => {
      const wrapper = mountForm();
      await wrapper.find('input#lastName').setValue('Dupont');
      await wrapper.find('input#firstName').setValue('Marie');
      await wrapper.find('select#sexe').setValue('F');
      await wrapper.find('input#dateNaissance').setValue('1985-04-12');
      await wrapper.find('input#telephone').setValue('0601020304');
      await wrapper.find('input#email').setValue('marie.dupont@email.com');
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.emitted('submit')).toBeTruthy();
      const payload = wrapper.emitted('submit')![0][0] as PatientFormModel;
      expect(payload.nom).toBe('Dupont');
      expect(payload.prenom).toBe('Marie');
      expect(payload.sexe).toBe('F');
      expect(payload.dateNaissance).toBe('1985-04-12');
      expect(payload.telephone).toBe('0601020304');
      expect(payload.email).toBe('marie.dupont@email.com');
    });

    it('doit émettre "cancel" au clic sur Annuler', async () => {
      const wrapper = mountForm();
      await wrapper.find('button[type="button"]').trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
    });
  });
});
