module.exports = {
  hooks: {
    'pre-commit': 'lint-staged && lerna run test'
  }
}