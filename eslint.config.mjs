import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import ts from 'typescript-eslint'

export default defineConfig(
	{ ignores: ['out/**/*'] },

	// js/ts lint settings
	js.configs.recommended,
	...ts.configs.recommendedTypeChecked,
	...ts.configs.stylisticTypeChecked,

	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.mjs'],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-namespace': 'off',
			// Disable rules that conflict with regular tsc type checking
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-error': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
		},
	},

	// Import sorting
	importPlugin.flatConfigs.recommended,
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
				},
			},
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-duplicates': 'error',
		},
	},

	// Must be last
	prettier,
)
