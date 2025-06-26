/*
 * Tests unitaires du composant Modal.vue
 * Vérifie l'affichage conditionnel du contenu, l'émission d'événements, et le comportement du bouton de fermeture.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Modal from '../Modal.vue';

describe('Modal', () => {
  // Vérifie que le contenu est affiché quand modelValue=true
  it('affiche le contenu quand modelValue=true', () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
      slots: { default: '<div>Contenu</div>' },
    });
    expect(wrapper.html()).toContain('Contenu');
  });

  // Vérifie que rien n'est affiché quand modelValue=false
  it('n’affiche rien quand modelValue=false', () => {
    const wrapper = mount(Modal, { props: { modelValue: false } });
    expect(wrapper.html()).not.toContain('bg-white');
  });

  // Vérifie que l'événement update:modelValue=false est émis au clic sur le bouton de fermeture
  it('émet update:modelValue=false au clic sur le bouton de fermeture', async () => {
    const wrapper = mount(Modal, { props: { modelValue: true } });
    await wrapper.find('button[aria-label="Fermer la modale"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });
});
