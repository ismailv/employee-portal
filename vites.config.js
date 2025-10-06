import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom', 
    coverage: {
      provider: 'c8',       
      reporter: ['text', 'lcov'], 
      reportsDirectory: 'coverage',
      all: true,           
      include: ['src/**/*.js'], 
      exclude: ['node_modules/', 'tests/'], 
    },
  },
});
