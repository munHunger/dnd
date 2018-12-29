module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  extends: "standard",
  globals: {
    __static: true
  },
  plugins: ["html"],
  rules: {
    semi: 0,
    quotes: 0,
    "space-before-function-paren": 0,
    "no-path-concat": 0,
    // allow paren-less arrow functions
    "arrow-parens": 0,
    curly: 0,
    eqeqeq: 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0
  }
};
