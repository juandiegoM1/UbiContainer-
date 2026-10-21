import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    reporter: ['json', 'html'],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/results.html',
    },
  },
});

