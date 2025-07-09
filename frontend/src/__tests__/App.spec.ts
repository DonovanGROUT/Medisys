/**
 * -----------------------------------------------------
 * Sommaire des blocs de tests :
 * - Vérifie l’affichage et la logique des boutons d’authentification navbar
 * - Mocke Pinia et les états utilisateur
 * Helpers centralisés en haut de fichier.
 * -----------------------------------------------------
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';
import { createTestingPinia } from '@pinia/testing';

interface UserState {
  isAuthenticated: boolean;
  username: string | null;
}

function factory(userState: UserState = { isAuthenticated: false, username: null }) {
  return mount(App, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: { user: userState },
          createSpy: () => vi.fn(),
        }),
      ],
      stubs: ['router-link', 'router-view'],
    },
  });
}

describe('Navbar authentication buttons', () => {
  it('affiche Connexion et Inscription si aucun utilisateur', () => {
    const wrapper = factory({ isAuthenticated: false, username: null });
    expect(wrapper.text()).toContain('Connexion');
    expect(wrapper.text()).toContain('Inscription');
    expect(wrapper.text()).not.toContain('Déconnexion');
  });

  it('affiche Déconnexion si utilisateur authentifié', () => {
    const wrapper = factory({ isAuthenticated: true, username: 'Test User' });
    expect(wrapper.text()).toContain('Déconnexion');
    expect(wrapper.text()).not.toContain('Connexion');
    expect(wrapper.text()).not.toContain('Inscription');
  });

  it('Déconnexion déclenche la méthode de logout', async () => {
    const logoutMock = vi.fn();
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: { user: { isAuthenticated: true, username: 'Test User' } },
            createSpy: () => logoutMock,
          }),
        ],
        stubs: ['router-link', 'router-view'],
      },
    });
    const btn = wrapper.find('button[aria-label="Déconnexion"]');
    expect(btn.exists()).toBe(true);
    await btn.trigger('click');
    expect(logoutMock).toHaveBeenCalled();
  });
});
