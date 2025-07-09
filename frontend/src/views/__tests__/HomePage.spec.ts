/**
 * HomePage.spec.ts
 * -------------------------------------------------
 * Sommaire des blocs de tests :
 * - Affichage général & DOM
 * - Boutons principaux (navigation)
 * - Accessibilité (présence alt, structure)
 * - Robustesse (rendu sans crash)
 * Helpers centralisés en haut de fichier.
 * -------------------------------------------------
 */

import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import HomePage from '../HomePage.vue';
import type { ComponentPublicInstance } from 'vue';

// Stub router-link pour simuler un vrai lien avec href
const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
};

function mountHomePage(): VueWrapper<ComponentPublicInstance> {
  return mount(HomePage, {
    global: {
      stubs: {
        'router-link': RouterLinkStub,
        BaseIcon: true,
      },
    },
  });
}

describe('HomePage.vue', () => {
  describe('Affichage général & DOM', () => {
    it('rend la page d’accueil et affiche le titre', () => {
      const wrapper = mountHomePage();
      expect(wrapper.text()).toContain('Bienvenue dans Medisys');
    });
  });

  describe('Boutons principaux', () => {
    it('affiche le bouton "Voir les patients"', () => {
      const wrapper = mountHomePage();
      const btn = wrapper.find('a[href="/patients"]');
      expect(btn.exists()).toBe(true);
      expect(btn.text()).toMatch(/patients/i);
    });
    it('affiche le bouton "Prendre un rendez-vous"', () => {
      const wrapper = mountHomePage();
      const btn = wrapper.find('a[href="/appointments"]');
      expect(btn.exists()).toBe(true);
      expect(btn.text()).toMatch(/rendez-vous/i);
    });
  });

  describe('Accessibilité', () => {
    it('l’illustration possède un alt explicite', () => {
      const wrapper = mountHomePage();
      const img = wrapper.find('img');
      expect(img.exists()).toBe(true);
      expect(img.attributes('alt')).toMatch(/illustration/i);
    });
  });

  describe('Robustesse', () => {
    it('ne crash pas au rendu', () => {
      expect(() => mountHomePage()).not.toThrow();
    });
  });
});
