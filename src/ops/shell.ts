import {OpResult, Logger, RenderedAction, RunnerConfig} from '../types'
import {createResult} from '../utils'
import {GenerateOptions} from "../generate";

const notEmpty = x => x && x.length > 0

export async function shell(
  {attributes: {sh}, body}: RenderedAction,
  opts: GenerateOptions,
  {exec}: RunnerConfig,
  logger: Logger
): Promise<OpResult> {
  const result = createResult('shell', sh)
  if (notEmpty(sh)) {
    if (!opts.dry) {
      await exec(sh, body)
    }
    logger.ok(`       shell: ${sh}`)

    return result('executed')
  }
  return result('ignored')
}
