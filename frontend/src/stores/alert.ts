/**
 * =============================================================
 * Store d’alerte globale (Pinia)
 * -------------------------------------------------------------
 * Gère l’affichage des messages d’alerte (succès, erreur, info) côté frontend.
 *
 * - Fournit les actions show/clear
 * - Stocke l’état de l’alerte courante et le timeout associé
 * - Utilisé pour afficher les notifications globales dans l’UI
 *
 * Convention : store typé, actions documentées, bloc JSDoc en tête de fichier.
 * =============================================================
 */

import { defineStore } from 'pinia';

export type AlertType = 'success' | 'error' | 'info';

export interface AlertState {
  type: AlertType;
  message: string;
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alert: null as AlertState | null,
    timeoutId: null as ReturnType<typeof setTimeout> | null,
  }),
  actions: {
    show(type: AlertType, message: string, duration = 3500) {
      this.alert = { type, message };
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.clear();
      }, duration);
    },
    clear() {
      this.alert = null;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    },
  },
});
