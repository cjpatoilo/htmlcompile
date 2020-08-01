#!/usr/bin/env node
'use strict'
const htmlcompile = require('.')
const pkg = require('./package.json')
const argv = process.argv.slice(2)

if (argv.indexOf('--version') !== -1 || argv.indexOf('-v') !== -1) {
  console.log(pkg.version)
  process.exit(0)
}

if (argv.indexOf('--help') !== -1 || argv.indexOf('-h') !== -1) {
  console.log(`
  Usage:

    $ htmlcompile <input> [<output>] [<options>]

  Options:

    -h, --help              Display help information
    -v, --version           Output version

  Examples:

    $ htmlcompile src
    $ htmlcompile src dist
`)
  process.exit(0)
}

htmlcompile(argv[0], argv[1])
