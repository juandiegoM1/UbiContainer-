import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    reporters: ['json', 'html'],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/results.html',
    },
  },
});

