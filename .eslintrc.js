module.exports = {
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
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
    "prefer-const": "warn",
    "sort-imports": "warn",
    semi: ["error", "always"]
  }
};
