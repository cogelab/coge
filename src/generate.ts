import * as fs from "fs-extra";
import {RunnerConfig, Logger, Op} from "./types";
import {ConfigResolver} from "./resolvers/config";
import {printHelp} from "./help";
import {ParamsResolver} from "./resolvers/params";

import {render} from "./render";
import {resolveOps} from "./ops";
import {undasherize} from "./utils";

export async function generate(opts: any, conf: RunnerConfig, logger: Logger) {
  const resolvedConfig = await ConfigResolver.resolve(conf);
  const {templates} = resolvedConfig;
  try {
    const actions = await doGenerate(opts, resolvedConfig, logger);
    return {success: true, actions, time: 0}
  } catch (err) {
    logger.log(err.toString())
    if (resolvedConfig.debug) {
      logger.log('details -----------')
      logger.log(err.stack)
      logger.log('-------------------')
    }
    printHelp(templates, logger);
    return { success: false, actions: [], time: 0 };
  }
}

async function doGenerate(opts: any, conf: RunnerConfig, logger: Logger) {
  const {cwd, templates} = conf;
  const {attr} = opts;
  const params = Object.assign(await ParamsResolver.resolve(conf, opts, resolveAttrs(attr || [])), {cwd});
  const {generator, folder} = params;

  opts.dry && logger.log('(dry mode)')
  if (!generator) {
    throw new Error('please specify a generator.')
  }

  logger.log(`Loaded templates: ${templates!.replace(`${cwd}/`, '')}`)

  if (!(await fs.pathExists(folder!))) {
    throw new Error(`I can't find generator '${generator}'.

      You can try:
      1. 'coge generator init' to initialize your project, and
      2. 'coge generator new ${generator}' to build the generator you wanted.
      `)
  }

  // lazy loading these dependencies gives a better feel once
  // a user is exploring coge (not specifying what to execute)
  const renderedActions = await render(params, conf);
  const messages: string[] = []
  const answer: Op[] = []
  for (const action of renderedActions) {
    const {message} = action.attributes
    if (message) {
      messages.push(message)
    }
    const ops = resolveOps(action.attributes)
    for (const op of ops) {
      answer.push(await op(action, opts, conf, logger))
    }
  }
  if (messages.length > 0) {
    logger.colorful(`${opts.generator}:\n${messages.join('\n')}`)
  }
  return answer;
}

function resolveAttrs(attrs: string[]): { [name: string]: any } {
  return attrs.reduce((answer, s) => {
    const parts = s.trim().split(/[=]/);
    answer[parts[0]] = answer[undasherize(parts[0], true)] = parts[1] || true;
    return answer;
  }, {});
}

