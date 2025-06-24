/*
 * Tests unitaires du composant PatientTableRow.vue
 * Vérifie l'affichage des informations patient et des actions par défaut.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PatientTableRow from '../PatientTableRow.vue';

describe('PatientTableRow', () => {
  const baseProps = {
    id: 1,
    gender: 'F',
    lastName: 'Dupont',
    firstName: 'Marie',
    birthDate: '1985-04-12',
    phone: '0601020304',
    email: 'marie.dupont@email.com',
  };

  // Vérifie que toutes les informations principales du patient sont affichées
  it('affiche toutes les infos principales', () => {
    const wrapper = mount(PatientTableRow, { props: baseProps });
    expect(wrapper.text()).toContain('Dupont');
    expect(wrapper.text()).toContain('Marie');
    expect(wrapper.text()).toContain('1985-04-12');
  });

  // Vérifie que les actions par défaut sont affichées si aucun slot n'est fourni
  it('affiche les actions par défaut si aucun slot', () => {
    const wrapper = mount(PatientTableRow, { props: baseProps });
    expect(wrapper.text()).toContain('Voir');
    expect(wrapper.text()).toContain('Modifier');
    expect(wrapper.text()).toContain('Supprimer');
  });
});
