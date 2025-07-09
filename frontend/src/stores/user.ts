/**
 * =============================================================
 * Store utilisateur (Pinia)
 * -------------------------------------------------------------
 * Gère l’état d’authentification et le nom d’utilisateur côté frontend.
 *
 * - Fournit les actions login/logout
 * - Stocke l’état d’authentification et le username
 * - Utilisé pour la gestion de session côté client
 *
 * Convention : store typé, actions documentées, bloc JSDoc en tête de fichier.
 * =============================================================
 */

import { defineStore } from 'pinia';

export interface UserState {
  isAuthenticated: boolean;
  username: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isAuthenticated: false,
    username: null,
  }),
  actions: {
    login(username: string) {
      this.isAuthenticated = true;
      this.username = username;
    },
    logout() {
      this.isAuthenticated = false;
      this.username = null;
    },
  },
});
