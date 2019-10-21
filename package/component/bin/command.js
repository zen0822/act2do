#!/usr/bin/env node

const yargs = require('yargs')

return yargs
  .command({
    command: 'set config <path>',
    desc: '@act2do/build command dev',
    builder(yargs) {
      yargs.options({
        path: {
          demandOption: true,
          describe: 'Configuration path.',
          type: 'string'
        }
      })
    },
    handler: (argv) => {
      console.log(JSON.Stringify(argv))
    }
  })
  .help()
  .argv

