import tseslint from "typescript-eslint";
import js from "@eslint/js";

export default tseslint.config(
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        URL: 'readonly',
        console: 'readonly',
        document: 'readonly',
        performance: 'readonly',
        process: 'readonly',
      },
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  }
);
