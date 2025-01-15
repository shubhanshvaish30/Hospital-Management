export default {
  // Ignore build output directories
  ignores: ['dist', 'build', 'node_modules'],

  // ESLint settings specific to React and TypeScript files
  overrides: [
    {
      // Apply these rules to .jsx, .tsx, .js, and .ts files
      files: ['**/*.{js,jsx,ts,tsx}'],

      // Extend recommended rules
      extends: [
        'eslint:recommended', // Base ESLint rules
        'plugin:react/recommended', // React-specific linting rules
        'plugin:@typescript-eslint/recommended', // TypeScript-specific linting rules
        'plugin:react-hooks/recommended', // React hooks rules
      ],

      // Use the appropriate parser for TypeScript
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020, // Use modern ECMAScript features
        sourceType: 'module', // Use ES module system
        ecmaFeatures: {
          jsx: true, // Enable parsing of JSX
        },
      },

      // Define plugins
      plugins: ['react', 'react-hooks', '@typescript-eslint'],

      // Define custom rules
      rules: {
        // General rules
        'no-unused-vars': 'off', // Turn off to let TypeScript handle it
        '@typescript-eslint/no-unused-vars': ['warn'], // Warn for unused variables in TS
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Turn off explicit return types

        // React rules
        'react/prop-types': 'off', // Disable prop-types (TS covers this)
        'react/react-in-jsx-scope': 'off', // Not needed in React 17+
        'react-hooks/rules-of-hooks': 'error', // Enforce the rules of hooks
        'react-hooks/exhaustive-deps': 'warn', // Warn for missing dependencies in effects

        // React Refresh rule (useful for HMR)
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },

      // React-specific settings
      settings: {
        react: {
          version: 'detect', // Automatically detect React version
        },
      },
    },
  ],
};
