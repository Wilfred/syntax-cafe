/* eslint-env node */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["simple-import-sort"],
  rules: {
    "linebreak-style": ["error", "unix"],
    "no-alert": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "warn",
    "no-dupe-else-if": "warn",
    "no-unused-expressions": "warn",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-useless-call": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-rename": "warn",
    "no-useless-return": "warn",
    "no-var": "error",
    "object-shorthand": ["warn", "properties"],
    "prefer-arrow-callback": "error",
    "prefer-const": ["warn", { destructuring: "all" }],
    "react/prop-types": "warn",
    "simple-import-sort/sort": "warn",
    semi: ["error", "always"]
  }
};
