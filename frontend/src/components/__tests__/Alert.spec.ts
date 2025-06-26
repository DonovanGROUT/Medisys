/*
 * Tests unitaires du composant Alert.vue
 * Vérifie l'affichage du message, de l'icône selon le type, et le comportement si message vide.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Alert from '../Alert.vue';

describe('Alert', () => {
  // Vérifie que le message et l'icône info sont affichés par défaut
  it('affiche le message et l’icône info par défaut', () => {
    const wrapper = mount(Alert, { props: { type: 'info', message: 'Test info' } });
    expect(wrapper.text()).toContain('Test info');
    expect(wrapper.html()).toContain('info');
  });

  // Vérifie que l'icône de succès est affichée pour le type success
  it('affiche l’icône de succès', () => {
    const wrapper = mount(Alert, { props: { type: 'success', message: 'Succès' } });
    expect(wrapper.html()).toContain('check_circle');
  });

  // Vérifie que l'icône d'erreur est affichée pour le type error
  it('affiche l’icône d’erreur', () => {
    const wrapper = mount(Alert, { props: { type: 'error', message: 'Erreur' } });
    expect(wrapper.html()).toContain('error');
  });

  // Vérifie qu'aucune alerte n'est affichée si le message est vide
  it('n’affiche rien si message vide', () => {
    const wrapper = mount(Alert, { props: { type: 'info', message: '' } });
    expect(wrapper.html()).not.toContain('info');
  });
});
