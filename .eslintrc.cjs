/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	plugins: ['@typescript-eslint'],
	extends: [
		// The order of these matter:
		// eslint baseline
		'eslint:recommended',
		// disables eslint rules in favor of using prettier separately
		'prettier',
	],
	rules: {
		// https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
		'no-undef': 'off',
	},
	ignorePatterns: ['/dist/**/*'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	overrides: [
		{
			files: ['**/*.{ts}'],
			extends: [
				// Recommended typescript changes, which removes some "no-undef" checks that TS handles
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:@typescript-eslint/recommended',
			],
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.node.json',
				tsconfigRootDir: __dirname,
			},
			rules: {
				'@typescript-eslint/consistent-type-imports': [
					'error',
					{
						disallowTypeAnnotations: false,
					},
				],
				// no-unsafe-assignment complains when passing components as variables
				'@typescript-eslint/no-unsafe-assignment': [0],
			},
		},
		{
			plugins: ['@typescript-eslint'],
			extends: [],
			files: ['src/**/*.{ts}'],
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: __dirname,
			},
		},
	],
};
