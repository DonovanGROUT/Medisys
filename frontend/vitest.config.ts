import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setupTests.ts'],
    globals: true,
    coverage: {
      exclude: [
        'postcss.config.js',
        'tailwind.config.js',
        'vite.config.ts',
        'vitest.config.ts',
        'dist/**',
        'src/types/**',
        'src/stores/alert.ts',
        'src/stores/user.ts',
        'src/main.ts',
        'src/router.ts',
        'src/App.vue',
        'src/vite-env.d.ts',
        'src/services/*.d.ts',
        'src/__tests__/*.d.ts', // Ajout pour exclure les fichiers de type de test
        'src/components/AppointmentItem.vue', // Exclu car aucune fonction locale à tester
      ],
    },
  },
});
