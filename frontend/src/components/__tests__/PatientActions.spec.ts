/*
 * Tests unitaires du composant PatientActions.vue
 * Vérifie l'émission des événements et le comportement des boutons d'action.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PatientActions from '../PatientActions.vue';

describe('PatientActions', () => {
  // Vérifie que l'événement "view" est émis au clic sur le bouton correspondant
  it('émet l’événement "view" au clic', async () => {
    const wrapper = mount(PatientActions);
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('view')).toBeTruthy();
  });

  // Vérifie que le bouton supprimer est désactivé si deleteDisabled est à true
  it('désactive le bouton supprimer si deleteDisabled', () => {
    const wrapper = mount(PatientActions, { props: { deleteDisabled: true } });
    const btn = wrapper.findAll('button')[2];
    expect(btn.attributes('disabled')).toBeDefined();
  });
});
