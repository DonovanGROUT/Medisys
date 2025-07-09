/// <reference types="vitest" />
// setupTests.ts
// Ce fichier est exécuté automatiquement avant les tests (si référencé dans la config Vitest)
// Il permet de stubber globalement les composants comme router-link pour éviter les warnings Vue.

import { config } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { beforeEach } from 'vitest';

config.global.stubs = {
  ...config.global.stubs,
  'router-link': {
    template: '<a><slot /></a>',
  },
};

beforeEach(() => {
  setActivePinia(createPinia());
});

export {};
