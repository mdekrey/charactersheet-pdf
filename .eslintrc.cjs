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
			files: ['**/*.{ts,mts,cts}'],
			extends: [
				// Recommended typescript changes, which removes some "no-undef" checks that TS handles
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:@typescript-eslint/recommended',
			],
		},
		{
			plugins: ['@typescript-eslint'],
			extends: [],
			files: ['src/**/*.{ts,mts,cts}'],
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: __dirname,
			},
		},
	],
};
