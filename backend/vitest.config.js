const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    setupFiles: ['./tests/setup.js'],
    // Cada arquivo roda em um worker isolado, com seu próprio SQLite em memória.
    fileParallelism: true,
  },
});
