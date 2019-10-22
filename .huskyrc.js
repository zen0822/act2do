module.exports = {
  hooks: {
    'pre-commit': 'yarn run precommit && lerna run test'
  }
}