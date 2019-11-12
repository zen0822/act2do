module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    'browser': true,
    'node': true,
    'es6': true
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      jsx: true
    },
    extraFileExtensions: ['.json'],
    project: [
      '*/tsconfig.json'
    ],
    sourceType: 'module',
    tsconfigRootDir: './'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 2,
        '@typescript-eslint/no-var-requires': 2
      }
    }
  ],
  plugins: [
    '@typescript-eslint',
    'html',
    'react',
    'json',
    'promise',
    'import',
    'node',
    'react-hooks'
  ],
  globals: {
    'document': true,
    'window': true,
    '$': true,
    'exit': true,
    'workbox': true
  },
  rules: {
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/interface-name-prefix': [0, {
      'prefixWithI': 'always'
    }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'quotes': ['error', 'single', {
      'allowTemplateLiterals': true
    }],
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0,
    'no-unused-vars': 0,
    'no-multiple-empty-lines': 0,
    'no-useless-escape': 0,
    'import/no-webpack-loader-syntax': 0,
    indent: ['error', 2, {
      SwitchCase: 1
    }],
    'no-trailing-spaces': ['error', {
      'skipBlankLines': true
    }],
    'no-template-curly-in-string': 0,
    'operator-linebreak': 0
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
