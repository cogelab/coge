import {OpResult, RenderedAction, OpSession} from '../types'
import {createResult} from '../utils'
import {GenerateOptions} from "../generate";

const notEmpty = x => x && x.length > 0

export async function shell(
  {context: {cwd, env, exec}}: OpSession,
  {attributes: {sh}, body}: RenderedAction,
  opts: GenerateOptions,
): Promise<OpResult> {
  const {logger} = env.adapter;
  const result = createResult('shell', sh)
  if (notEmpty(sh)) {
    if (!opts.dry) {
      await exec(sh, body)
    }
    logger.status('shell', sh);

    return result('executed')
  }
  return result('ignored')
}
