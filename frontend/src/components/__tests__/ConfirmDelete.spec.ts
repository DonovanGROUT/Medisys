/*
 * Tests unitaires du composant ConfirmDelete.vue
 * Vérifie l’affichage du message, l’émission des événements "confirm" et "cancel".
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmDelete from '../ConfirmDelete.vue';

describe('ConfirmDelete', () => {
  // Vérifie l'affichage du message de confirmation
  it('affiche le message de confirmation', () => {
    const wrapper = mount(ConfirmDelete);
    expect(wrapper.text()).toContain('Voulez-vous vraiment supprimer ce patient');
  });

  // Vérifie que l'événement "confirm" est émis au clic sur Supprimer
  it('émet "confirm" au clic sur Supprimer', async () => {
    const wrapper = mount(ConfirmDelete);
    const btn = wrapper.findAll('button').find((b) => b.text().includes('Supprimer'));
    if (!btn) throw new Error('Bouton Supprimer non trouvé');
    await btn.trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });

  // Vérifie que l'événement "cancel" est émis au clic sur Annuler
  it('émet "cancel" au clic sur Annuler', async () => {
    const wrapper = mount(ConfirmDelete);
    const btn = wrapper.findAll('button').find((b) => b.text().includes('Annuler'));
    if (!btn) throw new Error('Bouton Annuler non trouvé');
    await btn.trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });
});
