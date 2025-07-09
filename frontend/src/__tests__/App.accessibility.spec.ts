/**
 * -----------------------------------------------------
 * Sommaire des blocs de tests :
 * - Vérifie l’accessibilité globale de l’application (axe)
 * Helpers centralisés en haut de fichier.
 * -----------------------------------------------------
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from 'jest-axe';
import App from '../App.vue';
import { createTestingPinia } from '@pinia/testing';

describe('App.vue accessibilité', () => {
  it('ne présente pas de violations d’accessibilité majeures (axe)', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createTestingPinia()],
        stubs: ['router-link', 'router-view'],
      },
      attachTo: document.body, // pour axe
    });
    const results = await axe(wrapper.element);
    expect(results.violations.length).toBe(0);
  });
});
