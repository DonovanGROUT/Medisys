import { defineStore } from 'pinia';

export type AlertType = 'success' | 'error' | 'info';

export interface AlertState {
  type: AlertType;
  message: string;
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alert: null as AlertState | null,
  }),
  actions: {
    show(type: AlertType, message: string) {
      this.alert = { type, message };
    },
    clear() {
      this.alert = null;
    },
  },
});
