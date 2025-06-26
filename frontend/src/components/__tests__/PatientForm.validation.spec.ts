/**
 * Tests unitaires de la validation front du formulaire PatientForm.vue
 * -------------------------------------------------------------------
 * - Vérifie l’affichage des messages d’erreur pour chaque champ selon la saisie utilisateur
 * - Couvre la logique de validation front (feedback immédiat, UX, robustesse)
 * - Ne teste pas l’intégration backend
 *
 * Règles testées :
 *   - Champs requis (nom, prénom, sexe, date de naissance, email)
 *   - Format de l’email
 *   - Date de naissance dans le passé
 *   - Téléphone : non requis mais validé si rempli
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PatientForm from '../PatientForm.vue';

describe('PatientForm - validation', () => {
  /**
   * Vérifie que le message d’erreur s’affiche si le champ nom est vide
   */
  it('affiche une erreur si le nom est vide', async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#lastName').setValue('');
    await wrapper.find('input#lastName').trigger('input');
    expect(wrapper.html()).toContain('Le nom est requis.');
  });

  /**
   * Vérifie que le message d’erreur s’affiche si le champ prénom est vide
   */
  it('affiche une erreur si le prénom est vide', async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#firstName').setValue('');
    await wrapper.find('input#firstName').trigger('input');
    expect(wrapper.html()).toContain('Le prénom est requis.');
  });

  /**
   * Vérifie que le message d’erreur s’affiche si le champ sexe est vide
   */
  it('affiche une erreur si le sexe est vide', async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('select#sexe').setValue('');
    await wrapper.find('select#sexe').trigger('change');
    expect(wrapper.html()).toContain('Le sexe est requis.');
  });

  /**
   * Vérifie que le message d’erreur s’affiche si la date de naissance est dans le futur
   */
  it('affiche une erreur si la date de naissance est dans le futur', async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#dateNaissance').setValue('2999-01-01');
    await wrapper.find('input#dateNaissance').trigger('input');
    expect(wrapper.html()).toContain('La date de naissance doit être dans le passé.');
  });

  /**
   * Vérifie que le message d’erreur s’affiche si l’email est vide
   */
  it("affiche une erreur si l'email est vide", async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#email').setValue('');
    await wrapper.find('input#email').trigger('input');
    expect(wrapper.html()).toContain("L'email est requis.");
  });

  /**
   * Vérifie que le message d’erreur s’affiche si l’email ne contient pas d’arobase
   */
  it("affiche une erreur si l'email ne contient pas d'arobase", async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#email').setValue('toto.example.com');
    await wrapper.find('input#email').trigger('input');
    expect(wrapper.html()).toContain("L'email doit contenir un arobase (@).");
  });

  /**
   * Vérifie que le message d’erreur s’affiche si l’email ne contient pas de point après l’arobase
   */
  it("affiche une erreur si l'email ne contient pas de point après l'arobase", async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#email').setValue('toto@exemple');
    await wrapper.find('input#email').trigger('input');
    expect(wrapper.html()).toContain("L'email doit contenir un point après l'arobase.");
  });

  /**
   * Vérifie que le message d’erreur s’affiche si l’email est globalement invalide
   */
  it("affiche une erreur si l'email est globalement invalide", async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#email').setValue('toto@.com');
    await wrapper.find('input#email').trigger('input');
    expect(wrapper.html()).toContain("L'email est invalide.");
  });

  /**
   * Vérifie que le message d’erreur s’affiche si le téléphone est invalide
   */
  it('affiche une erreur si le téléphone est invalide', async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#telephone').setValue('abc123');
    await wrapper.find('input#telephone').trigger('input');
    expect(wrapper.html()).toContain(
      'Le téléphone doit contenir uniquement des chiffres, espaces, points ou tirets (8 à 20 caractères).'
    );
  });

  /**
   * Vérifie qu’aucun message d’erreur n’est affiché si le téléphone est vide (non requis)
   */
  it('n’affiche pas d’erreur si le téléphone est vide (non requis)', async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('input#telephone').setValue('');
    await wrapper.find('input#telephone').trigger('input');
    expect(wrapper.html()).not.toContain('Le téléphone doit contenir uniquement des chiffres');
  });
});
