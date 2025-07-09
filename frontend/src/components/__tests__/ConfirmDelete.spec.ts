/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage du message de confirmation
- Émission des événements confirm/cancel
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import ConfirmDelete from '../ConfirmDelete.vue';

// Helper pour monter le composant ConfirmDelete
function mountConfirmDelete(): VueWrapper<InstanceType<typeof ConfirmDelete>> {
  return mount(ConfirmDelete);
}

// -----------------------------------------------------------------------------
// Bloc Affichage
// -----------------------------------------------------------------------------
describe('ConfirmDelete – Affichage', () => {
  it('affiche le message de confirmation', () => {
    const wrapper = mountConfirmDelete();
    expect(wrapper.text()).toContain('Voulez-vous vraiment supprimer ce patient');
  });
});

// -----------------------------------------------------------------------------
// Bloc Événements
// -----------------------------------------------------------------------------
describe('ConfirmDelete – Événements', () => {
  it('émet "confirm" au clic sur Supprimer', async () => {
    const wrapper = mountConfirmDelete();
    const btn = wrapper.findAll('button').find((b) => b.text().includes('Supprimer'));
    expect(btn).toBeDefined();
    await btn!.trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });

  it('émet "cancel" au clic sur Annuler', async () => {
    const wrapper = mountConfirmDelete();
    const btn = wrapper.findAll('button').find((b) => b.text().includes('Annuler'));
    expect(btn).toBeDefined();
    await btn!.trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });
});
