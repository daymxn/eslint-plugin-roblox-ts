// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	// @ts-expect-error - eslint-plugin-prettier/recommended uses incorrect FlatConfig type
	eslintPluginPrettierRecommended,
	{
		rules: {
			"prettier/prettier": [
				"warn",
				{
					semi: true,
					trailingComma: "all",
					singleQuote: false,
					printWidth: 120,
					tabWidth: 4,
					useTabs: true,
					arrowParens: "avoid",
				},
			],
			"@typescript-eslint/array-type": [
				"warn",
				{
					default: "generic",
					readonly: "generic",
				},
			],
		},
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ["*.mjs"],
				},
				ecmaVersion: 2018,
				sourceType: "module",
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
);
