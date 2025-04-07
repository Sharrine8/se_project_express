const eslintPluginImport = require("eslint-plugin-import");
const eslintPluginPrettier = require("eslint-plugin-prettier");

module.exports = [
  {
    // Language options
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {},
    },
    // Plugins should be defined as an object
    plugins: {
      import: eslintPluginImport, // Add import plugin
      prettier: eslintPluginPrettier, // Add Prettier plugin
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
      "no-underscore-dangle": ["off", { allow: ["id"] }],
      "prettier/prettier": "error", // Enforce Prettier formatting rules
    },
  },
];
