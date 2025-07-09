/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage des messages d’erreur pour chaque champ
- Validation front (feedback immédiat, UX, robustesse)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import PatientForm from '../PatientForm.vue';

// Helper pour monter le composant PatientForm pour la validation
function mountForm(): VueWrapper<InstanceType<typeof PatientForm>> {
  return mount(PatientForm);
}

describe('PatientForm.vue - Validation', () => {
  describe('Champs requis', () => {
    it('doit afficher une erreur si le nom est vide', async () => {
      const wrapper = mountForm();
      await wrapper.find('input#lastName').setValue('');
      await wrapper.find('input#lastName').trigger('input');
      expect(wrapper.html()).toContain('Le nom est requis.');
    });
    it('doit afficher une erreur si le prénom est vide', async () => {
      const wrapper = mountForm();
      await wrapper.find('input#firstName').setValue('');
      await wrapper.find('input#firstName').trigger('input');
      expect(wrapper.html()).toContain('Le prénom est requis.');
    });
    it('doit afficher une erreur si le sexe est vide', async () => {
      const wrapper = mountForm();
      await wrapper.find('select#sexe').setValue('');
      await wrapper.find('select#sexe').trigger('change');
      expect(wrapper.html()).toContain('Le sexe est requis.');
    });
    it('doit afficher une erreur si la date de naissance est dans le futur', async () => {
      const wrapper = mountForm();
      await wrapper.find('input#dateNaissance').setValue('2999-01-01');
      await wrapper.find('input#dateNaissance').trigger('input');
      expect(wrapper.html()).toContain('La date de naissance doit être dans le passé.');
    });
    it("doit afficher une erreur si l'email est vide", async () => {
      const wrapper = mountForm();
      await wrapper.find('input#email').setValue('');
      await wrapper.find('input#email').trigger('input');
      expect(wrapper.html()).toContain("L'email est requis.");
    });
  });

  describe('Email', () => {
    it("doit afficher une erreur si l'email ne contient pas d'arobase", async () => {
      const wrapper = mountForm();
      await wrapper.find('input#email').setValue('toto.example.com');
      await wrapper.find('input#email').trigger('input');
      expect(wrapper.html()).toContain("L'email doit contenir un arobase (@).");
    });
    it("doit afficher une erreur si l'email ne contient pas de point après l'arobase", async () => {
      const wrapper = mountForm();
      await wrapper.find('input#email').setValue('toto@exemple');
      await wrapper.find('input#email').trigger('input');
      expect(wrapper.html()).toContain("L'email doit contenir un point après l'arobase.");
    });
    it("doit afficher une erreur si l'email est globalement invalide", async () => {
      const wrapper = mountForm();
      await wrapper.find('input#email').setValue('toto@.com');
      await wrapper.find('input#email').trigger('input');
      expect(wrapper.html()).toContain("L'email est invalide.");
    });
  });

  describe('Téléphone', () => {
    it('doit afficher une erreur si le téléphone est invalide', async () => {
      const wrapper = mountForm();
      await wrapper.find('input#telephone').setValue('abc123');
      await wrapper.find('input#telephone').trigger('input');
      expect(wrapper.html()).toContain(
        'Le téléphone doit contenir uniquement des chiffres, espaces, points ou tirets (8 à 20 caractères).'
      );
    });
    it('ne doit pas afficher d’erreur si le téléphone est vide (non requis)', async () => {
      const wrapper = mountForm();
      await wrapper.find('input#telephone').setValue('');
      await wrapper.find('input#telephone').trigger('input');
      expect(wrapper.html()).not.toContain('Le téléphone doit contenir uniquement des chiffres');
    });
  });
});
