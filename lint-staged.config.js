module.exports = {
  '{app,package}/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'git add'
  ]
}
