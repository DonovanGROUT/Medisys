/*
 * Tests unitaires du composant PatientForm.vue
 * Vérifie l'affichage des champs, l'émission des événements submit et cancel, et la structure des données envoyées.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PatientForm from '../PatientForm.vue';

type PatientFormModel = {
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  telephone?: string;
  email?: string;
};

describe('PatientForm', () => {
  // Vérifie que tous les champs du formulaire sont affichés
  it('affiche tous les champs du formulaire', () => {
    const wrapper = mount(PatientForm);
    expect(wrapper.html()).toContain('Nom');
    expect(wrapper.html()).toContain('Prénom');
    expect(wrapper.html()).toContain('Sexe');
    expect(wrapper.html()).toContain('Date de naissance');
    expect(wrapper.html()).toContain('Téléphone');
    expect(wrapper.html()).toContain('Email');
  });

  // Vérifie que l'événement submit est émis avec les bonnes données saisies
  it('émet "submit" avec les bonnes données', async () => {
    const wrapper = mount(PatientForm);
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

  // Vérifie que l'événement cancel est émis au clic sur Annuler
  it('émet "cancel" au clic sur Annuler', async () => {
    const wrapper = mount(PatientForm);
    await wrapper.find('button[type="button"]').trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });
});
