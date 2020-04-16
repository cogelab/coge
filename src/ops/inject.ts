import fs = require('fs-extra');
import path = require('path')
import {OpResult, RenderedAction, RunnerConfig, Logger} from '../types'
import {createResult} from '../utils'
import {injector} from '../injector'
import {GenerateOptions} from "../generate";

export async function inject(
  action: RenderedAction,
  opts: GenerateOptions,
  {cwd}: RunnerConfig,
  logger: Logger
): Promise<OpResult> {
  const {
    attributes: {to, inject},
  } = action

  const result = createResult('inject', to)

  if (!(inject && to)) {
    return result('ignored')
  }

  const absTo = path.resolve(cwd, to)

  if (!(await fs.pathExists(absTo))) {
    logger.err(`Cannot inject to ${to}: doesn't exist.`)
    return result('error', {
      error: `Cannot inject to ${to}: doesn't exist.`,
    })
  }

  const content = (await fs.readFile(absTo)).toString()
  const injectResult = injector(action, content)

  if (!opts.dry) {
    await fs.writeFile(absTo, injectResult)
  }
  logger.notice(`      inject: ${to}`)

  return result('inject')
}
