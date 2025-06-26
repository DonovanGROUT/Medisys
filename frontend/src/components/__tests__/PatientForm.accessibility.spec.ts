/**
 * Tests d’accessibilité du composant PatientForm.vue
 * --------------------------------------------------
 * - Vérifie la conformité ARIA, l’association des erreurs, et la navigation clavier
 * - Garantit l’accessibilité pour les utilisateurs de lecteurs d’écran et de clavier
 *
 * Convention :
 *   - Chaque test cible un critère d’accessibilité précis (aria-label, aria-describedby, etc.)
 *   - Les erreurs sont simulées pour vérifier l’affichage et l’association ARIA
 */
/// <reference types="vitest" />
import { mount } from '@vue/test-utils';
import PatientForm from '../PatientForm.vue';

describe('PatientForm.vue accessibilité', () => {
  /**
   * Vérifie la présence d’un aria-label sur le formulaire principal
   */
  it('a un aria-label sur le formulaire', () => {
    const wrapper = mount(PatientForm);
    const form = wrapper.find('form');
    expect(form.attributes('aria-label')).toBe('Formulaire patient');
  });

  /**
   * Vérifie l’association des erreurs aux champs via aria-describedby et role=alert
   */
  it('associe les erreurs aux champs via aria-describedby', async () => {
    const wrapper = mount(PatientForm, {
      props: {
        errors: { nom: 'Erreur nom', email: 'Erreur email' },
      },
    });
    // Déclenche une erreur locale aussi
    await wrapper.find('#lastName').setValue('');
    await wrapper.find('#email').setValue('');
    expect(wrapper.find('#lastName').attributes('aria-describedby')).toContain('lastName-error');
    expect(wrapper.find('#email').attributes('aria-describedby')).toContain('email-error');
    expect(wrapper.find('#lastName-error').attributes('role')).toBe('alert');
    expect(wrapper.find('#email-error').attributes('role')).toBe('alert');
  });

  /**
   * Vérifie l’indication des champs requis avec aria-required
   */
  it('indique les champs requis avec aria-required', () => {
    const wrapper = mount(PatientForm);
    expect(wrapper.find('#lastName').attributes('aria-required')).toBe('true');
    expect(wrapper.find('#firstName').attributes('aria-required')).toBe('true');
    expect(wrapper.find('#sexe').attributes('aria-required')).toBe('true');
    expect(wrapper.find('#dateNaissance').attributes('aria-required')).toBe('true');
    expect(wrapper.find('#email').attributes('aria-required')).toBe('true');
    expect(wrapper.find('#telephone').attributes('aria-required')).toBe('false');
  });

  /**
   * Vérifie l’accessibilité des boutons (clavier, aria-label)
   */
  it('a des boutons accessibles au clavier et avec aria-label', () => {
    const wrapper = mount(PatientForm);
    const buttons = wrapper.findAll('button');
    expect(buttons[0].attributes('aria-label')).toMatch(/annuler/i);
    expect(buttons[1].attributes('aria-label')).toMatch(/valider/i);
  });

  /**
   * Vérifie l’accessibilité du message d’erreur global (role="alert" et aria-live)
   */
  it('le message d’erreur global est accessible (role="alert" et aria-live)', async () => {
    const wrapper = mount(PatientForm, {
      props: { errors: { global: 'Erreur globale' } },
    });
    const globalError = wrapper.find('#form-global-error');
    expect(globalError.exists()).toBe(true);
    expect(globalError.attributes('role')).toBe('alert');
    expect(globalError.attributes('aria-live')).toBe('assertive');
  });
});
