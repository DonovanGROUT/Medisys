/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage des informations patient (nom, date, etc.)
- Affichage des actions par défaut
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import PatientTableRow from '../PatientTableRow.vue';

// Helper pour monter le composant PatientTableRow avec props obligatoires
function mountRow(
  props?: Partial<{
    id: number | string;
    sexe: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    telephone: string;
    email: string;
  }>
): VueWrapper<InstanceType<typeof PatientTableRow>> {
  const baseProps = {
    id: 1,
    sexe: 'F',
    nom: 'Dupont',
    prenom: 'Marie',
    dateNaissance: '1985-04-12',
    telephone: '0601020304',
    email: 'marie.dupont@email.com',
  };
  return mount(PatientTableRow, { props: { ...baseProps, ...props } });
}

describe('PatientTableRow.vue', () => {
  describe('Affichage', () => {
    it('doit afficher toutes les infos principales', () => {
      const wrapper = mountRow();
      expect(wrapper.text()).toContain('DUPONT');
      expect(wrapper.text()).toContain('Marie');
      // Date attendue au format littéral local (ex: 12 avril 1985)
      const expectedDate = new Date('1985-04-12').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      });
      expect(wrapper.text()).toContain(expectedDate);
    });
  });

  describe('Actions', () => {
    it('doit afficher les actions par défaut si aucun slot', () => {
      const wrapper = mountRow();
      expect(wrapper.text()).toContain('Voir');
      expect(wrapper.text()).toContain('Modifier');
      expect(wrapper.text()).toContain('Supprimer');
    });
  });

  describe('Robustesse', () => {
    it('doit afficher une chaîne vide si date de naissance absente', () => {
      const wrapper = mountRow({ dateNaissance: '' });
      // On cible la cellule date (5e colonne)
      const dateCell = wrapper.findAll('td')[4];
      expect(dateCell.text().trim()).toBe('');
    });
    it('doit afficher la date au format français si navigateur en fr', () => {
      const originalLang = Object.getOwnPropertyDescriptor(window.navigator, 'language');
      Object.defineProperty(window.navigator, 'language', { value: 'fr-FR', configurable: true });
      const wrapper = mountRow({ dateNaissance: '1990-01-01' });
      expect(wrapper.text()).toContain('01/01/1990');
      // Restore
      if (originalLang) Object.defineProperty(window.navigator, 'language', originalLang);
    });
    it('doit afficher la date au format local si navigateur non-français', () => {
      const originalLang = Object.getOwnPropertyDescriptor(window.navigator, 'language');
      Object.defineProperty(window.navigator, 'language', { value: 'en-US', configurable: true });
      const wrapper = mountRow({ dateNaissance: '1990-01-01' });
      // Format attendu : January 1, 1990 ou équivalent local
      expect(wrapper.text()).toMatch(/1990/);
      // Restore
      if (originalLang) Object.defineProperty(window.navigator, 'language', originalLang);
    });
  });
});
