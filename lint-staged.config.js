const micromatch = require('micromatch')

module.exports = {
  'app/**/*.{js,jsx,ts,tsx}': (file) => {
    const match = micromatch.not(file, ['dist', 'tsDist'])

    return match.map(file => `eslint ${file} --fix`)
  }
}
