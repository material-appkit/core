module.exports = {
  parser: "babel-eslint",
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  plugins: [
    "react",
    "jsx-a11y",
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "arrow-parens": [
      "error",
      "always",
    ],
    "arrow-body-style": 0,
    "class-methods-use-this": 0,
    "comma-dangle": [
      2,
      "always-multiline",
    ],
    "function-paren-newline": 0,
    "import/imports-first": 0,
    "import/newline-after-import": 0,
    "import/no-dynamic-require": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-named-as-default": 0,
    "import/no-unresolved": 2,
    "import/no-webpack-loader-syntax": 0,
    "import/prefer-default-export": 0,
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    "jsx-a11y/aria-props": 2,
    "jsx-a11y/heading-has-content": 0,
    "jsx-a11y/label-has-for": [
      2,
      {
        components: [
          "Label",
        ],
        required: {
          every: [
            "id",
          ],
        },
        allowChildren: false,
      },
    ],
    "jsx-a11y/mouse-events-have-key-events": 2,
    "jsx-a11y/role-has-required-aria-props": 2,
    "jsx-a11y/role-supports-aria-props": 2,
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: [
          "Link",
        ],
        specialLink: [
          "to",
        ],
      },
    ],
    "max-len": 0,
    "newline-per-chained-call": 0,
    "no-confusing-arrow": 0,
    "no-console": 1,
    "no-underscore-dangle": 0,
    "no-unused-vars": 1,
    "no-use-before-define": 0,
    "padded-blocks": [
      0,
      "always",
    ],
    "prefer-destructuring": 0,
    "prefer-template": 2,
    "react/forbid-prop-types": 0,
    "react/jsx-first-prop-new-line": [
      2,
      "multiline",
    ],
    "react/jsx-filename-extension": 0,
    "react/jsx-no-target-blank": 0,
    "react/require-default-props": 0,
    "react/require-extension": 0,
    "react/self-closing-comp": 0,
    "react/no-did-mount-set-state": 0,
    "react/sort-comp": 0,
    "require-yield": 0,
  },
  settings: {
    "import/resolver": {
      node: {
        paths: "./src",
      },
    },
  },
};
