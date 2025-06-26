// setupTests.ts
// Ce fichier est exécuté automatiquement avant les tests (si référencé dans la config Vitest)
// Il permet de stubber globalement les composants comme router-link pour éviter les warnings Vue.

import { config } from '@vue/test-utils';

config.global.stubs = {
  ...config.global.stubs,
  'router-link': {
    template: '<a><slot /></a>',
  },
};
