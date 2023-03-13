module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'], // Specify it only for TypeScript files
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'plugin:prettier/recommended'],
  overrides: [],
  plugins: ['react', 'import', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
};
