/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage des informations patient
- Icônes de genre
- Actions par défaut
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/

import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import PatientCard from '../PatientCard.vue';

// Helper pour monter le composant PatientCard avec props typées
function mountPatientCard(props: {
  id: number | string;
  sexe: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
}): VueWrapper<InstanceType<typeof PatientCard>> {
  return mount(PatientCard, { props });
}

const baseProps = {
  id: 1,
  sexe: 'F',
  nom: 'Dupont',
  prenom: 'Marie',
  dateNaissance: '1985-04-12',
  telephone: '0601020304',
  email: 'marie.dupont@email.com',
};

// -----------------------------------------------------------------------------
// Bloc Affichage
// -----------------------------------------------------------------------------
describe('PatientCard – Affichage', () => {
  it('affiche le nom complet et la date de naissance', () => {
    const wrapper = mountPatientCard(baseProps);
    expect(wrapper.text()).toContain('DUPONT Marie');
    const expectedDate = new Date('1985-04-12').toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
    expect(wrapper.text()).toContain(expectedDate);
  });
});

// -----------------------------------------------------------------------------
// Bloc Icônes
// -----------------------------------------------------------------------------
describe('PatientCard – Icônes', () => {
  it('affiche l’icône de genre appropriée', () => {
    const wrapperF = mountPatientCard({ ...baseProps, sexe: 'F' });
    expect(wrapperF.html()).toContain('female');
    const wrapperM = mountPatientCard({ ...baseProps, sexe: 'M' });
    expect(wrapperM.html()).toContain('male');
    const wrapperX = mountPatientCard({ ...baseProps, sexe: 'X' });
    expect(wrapperX.html()).toContain('transgender');
  });
});

// -----------------------------------------------------------------------------
// Bloc Actions
// -----------------------------------------------------------------------------
describe('PatientCard – Actions', () => {
  it('affiche les actions par défaut si aucun slot', () => {
    const wrapper = mountPatientCard(baseProps);
    expect(wrapper.text()).toContain('Voir');
    expect(wrapper.text()).toContain('Modifier');
    expect(wrapper.text()).toContain('Supprimer');
  });
});
