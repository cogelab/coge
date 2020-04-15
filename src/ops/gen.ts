import {OpResult, RunnerConfig, RenderedAction, Logger} from '../types'
import {createResult} from '../utils'

import path = require('path');
import fs = require('fs-extra');

const {red} = require('chalk');

export async function gen(
  action: RenderedAction,
  args: any,
  {cwd, createPrompter}: RunnerConfig,
  logger: Logger
): Promise<OpResult> {
  const {
    attributes: {to, inject, unless_exists},
  } = action
  const result = createResult('add', to)
  const prompter = createPrompter!()
  if (!to || inject) {
    return result('ignored')
  }
  const absTo = path.resolve(cwd, to)
  const shouldNotOverwrite =
    unless_exists !== undefined && unless_exists === true

  if (!process.env.COGE_OVERWRITE && (await fs.pathExists(absTo))) {
    if (
      shouldNotOverwrite ||
      !(await prompter
        .prompt({
          prefix: '',
          type: 'confirm',
          name: 'overwrite',
          message: red(`  exists: ${to}. Overwrite? (y/N): `),
        }).then(({overwrite}) => overwrite))
    ) {
      logger.warn(`  skipped: ${to}`)
      return result('skipped')
    }
  }

  if (!args.dry) {
    await fs.ensureDir(path.dirname(absTo))
    await fs.writeFile(absTo, action.body)
  }
  logger.ok(`  generated: ${to}`)
  return result('generated')
}
