/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage (message, icône selon le type)
- Robustesse (message vide)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import Alert from '../Alert.vue';

// Helper pour monter le composant Alert avec props typées
function mountAlert(props: {
  type: 'info' | 'success' | 'error';
  message: string;
}): VueWrapper<InstanceType<typeof Alert>> {
  return mount(Alert, { props });
}

describe('Alert.vue', () => {
  describe('Affichage', () => {
    it('doit afficher le message et l’icône info par défaut', () => {
      const wrapper = mountAlert({ type: 'info', message: 'Test info' });
      expect(wrapper.text()).toContain('Test info');
      expect(wrapper.html()).toContain('info');
    });
    it('doit afficher l’icône de succès pour le type success', () => {
      const wrapper = mountAlert({ type: 'success', message: 'Succès' });
      expect(wrapper.html()).toContain('check_circle');
    });
    it('doit afficher l’icône d’erreur pour le type error', () => {
      const wrapper = mountAlert({ type: 'error', message: 'Erreur' });
      expect(wrapper.html()).toContain('error');
    });
  });
  describe('Robustesse', () => {
    it('ne doit rien afficher si le message est vide', () => {
      const wrapper = mountAlert({ type: 'info', message: '' });
      expect(wrapper.html()).not.toContain('info');
    });
  });
});
