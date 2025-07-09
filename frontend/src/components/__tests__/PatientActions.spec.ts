/*
-------------------------------------------------
Sommaire des blocs de tests :
- Émission des événements (view, edit, delete)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import PatientActions from '../PatientActions.vue';

// Helper pour monter le composant PatientActions avec props optionnelles
function mountPatientActions(props?: {
  deleteDisabled?: boolean;
}): VueWrapper<InstanceType<typeof PatientActions>> {
  return mount(PatientActions, { props });
}

// -----------------------------------------------------------------------------
// Bloc Événements
// -----------------------------------------------------------------------------
describe('PatientActions – Événements', () => {
  it('émet l’événement "view" au clic', async () => {
    const wrapper = mountPatientActions();
    await wrapper.find('button[aria-label="Voir le patient"]').trigger('click');
    expect(wrapper.emitted('view')).toBeTruthy();
  });

  it('émet l’événement "edit" au clic', async () => {
    const wrapper = mountPatientActions();
    await wrapper.find('button[aria-label="Modifier le patient"]').trigger('click');
    expect(wrapper.emitted('edit')).toBeTruthy();
  });

  it('émet l’événement "delete" au clic', async () => {
    const wrapper = mountPatientActions();
    await wrapper.find('button[aria-label="Supprimer le patient"]').trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
  });
});

// -----------------------------------------------------------------------------
// Bloc Robustesse & Accessibilité
// -----------------------------------------------------------------------------
describe('PatientActions – Robustesse', () => {
  it('désactive le bouton supprimer si deleteDisabled', () => {
    const wrapper = mountPatientActions({ deleteDisabled: true });
    const btn = wrapper.find('button[aria-label="Supprimer le patient"]');
    expect(btn.attributes('disabled')).toBeDefined();
  });
});
