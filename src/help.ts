import {Logger} from './types'
import fs = require('fs');
import path = require('path');
import chalk = require('chalk');

const pkg = require('../package.json')

const availableGroups = (templates: string) => {
  const generators = fs
    .readdirSync(templates)
    .filter(_ => fs.lstatSync(path.join(templates, _)).isDirectory())
  return generators.reduce((acc, generator) => {
    acc[generator] = fs.readdirSync(path.join(templates, generator))
    return acc
  }, {})
}

const printHelp = (templates: string, logger: Logger) => {
  logger.log(`${pkg.name} v${pkg.version}`)
  logger.log('\nAvailable actions:')
  if (!templates) {
    logger.log(`No generators or actions found.

      This means I didn't find a _templates folder right here,
      or anywhere up the folder tree starting here.

      Here's how to start using coge:

      $ coge generator init
      $ coge generator new my-generator

      (edit your generator in _templates/my-generator)

      $ coge my-generator

      See https://github/taoyuan/coge for more.

      `)
    return
  }
  Object.entries(availableGroups(templates)).forEach(([k, v]) => {
    // @ts-ignore
    logger.log(`${chalk.bold(k)}: ${v.join(', ')}`)
  })
}

export {availableGroups, printHelp}
