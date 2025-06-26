/**
 * Tests unitaires du composant PatientTableRow.vue
 * -----------------------------------------------
 * - Vérifie l’affichage des informations patient (nom, date, etc.)
 * - Vérifie l’affichage des actions par défaut
 *
 * Convention :
 *   - Utilise des props de base typées
 *   - Couvre les cas d’affichage principaux et les actions
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

  /**
   * Vérifie que toutes les informations principales du patient sont affichées
   */
  it('affiche toutes les infos principales', () => {
    const wrapper = mount(PatientTableRow, { props: baseProps });
    expect(wrapper.text()).toContain('Dupont');
    expect(wrapper.text()).toContain('Marie');
    // Date attendue au format littéral local (ex: 12 avril 1985)
    const expectedDate = new Date('1985-04-12').toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
    expect(wrapper.text()).toContain(expectedDate);
  });

  /**
   * Vérifie que les actions par défaut sont affichées si aucun slot n'est fourni
   */
  it('affiche les actions par défaut si aucun slot', () => {
    const wrapper = mount(PatientTableRow, { props: baseProps });
    expect(wrapper.text()).toContain('Voir');
    expect(wrapper.text()).toContain('Modifier');
    expect(wrapper.text()).toContain('Supprimer');
  });
});
