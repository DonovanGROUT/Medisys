/*
 * Tests unitaires du composant PatientCard.vue
 * Vérifie l'affichage des informations patient, des icônes de genre, et des actions par défaut.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PatientCard from '../PatientCard.vue';

describe('PatientCard', () => {
  const baseProps = {
    id: 1,
    gender: 'F',
    lastName: 'Dupont',
    firstName: 'Marie',
    birthDate: '1985-04-12',
    phone: '0601020304',
    email: 'marie.dupont@email.com',
  };

  // Vérifie que le nom complet et la date de naissance sont affichés
  it('affiche le nom complet et la date de naissance', () => {
    const wrapper = mount(PatientCard, { props: baseProps });
    expect(wrapper.text()).toContain('Dupont Marie');
    expect(wrapper.text()).toContain('1985-04-12');
  });

  // Vérifie que l'icône de genre appropriée est affichée selon la valeur de gender
  it('affiche l’icône de genre appropriée', () => {
    const wrapperF = mount(PatientCard, { props: { ...baseProps, gender: 'F' } });
    expect(wrapperF.html()).toContain('female');
    const wrapperM = mount(PatientCard, { props: { ...baseProps, gender: 'M' } });
    expect(wrapperM.html()).toContain('male');
    const wrapperX = mount(PatientCard, { props: { ...baseProps, gender: 'X' } });
    expect(wrapperX.html()).toContain('transgender');
  });

  // Vérifie que les actions par défaut sont affichées si aucun slot n'est fourni
  it('affiche les actions par défaut si aucun slot', () => {
    const wrapper = mount(PatientCard, { props: baseProps });
    expect(wrapper.text()).toContain('Voir');
    expect(wrapper.text()).toContain('Modifier');
    expect(wrapper.text()).toContain('Supprimer');
  });
});
