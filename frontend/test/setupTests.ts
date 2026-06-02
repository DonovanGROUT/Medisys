/// <reference types="vitest" />
// setupTests.ts
// Ce fichier est exécuté automatiquement avant les tests (si référencé dans la config Vitest)
// Il permet de stubber globalement les composants comme router-link pour éviter les warnings Vue.

import { config } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { beforeEach } from 'vitest';

// Initialiser stubs s'il n'existe pas
if (!config.global.stubs) {
  config.global.stubs = {};
}

config.global.stubs['router-link'] = {
  template: '<a><slot /></a>',
};

beforeEach(() => {
  createTestingPinia();
});

export {};
