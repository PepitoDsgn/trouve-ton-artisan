import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Projet en JavaScript sans PropTypes
      'react/prop-types': 'off',
      // L'apostrophe est valide en JSX et omniprésente dans les textes en français
      'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
      // Variables ignorées volontairement lors d'une déstructuration (ex. maxAge)
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
];
