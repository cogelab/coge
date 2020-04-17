import * as fs from "fs-extra";
import chalk from 'chalk';
import {RunnerConfig, Logger, Op} from "./types";
import {ConfigResolver} from "./resolvers/config";
import {printHelp} from "./help";
import {ParamsResolver} from "./resolvers/params";

import {render} from "./render";
import {resolveOps} from "./ops";
import {LocalsResolver} from "./resolvers/locals";
import {AttrsResolver} from "./resolvers/attrs";
import {ErrorWithInstruction} from "./errors";

export interface GenerateOptions {
  generator: string;
  action: string;
  force?: boolean;
  dry?: boolean;
  name?: string;
  attr?: string[];
}

export async function generate(opts: GenerateOptions, conf: RunnerConfig, logger: Logger) {
  const resolvedConfig = await ConfigResolver.resolve(conf);
  const {templates} = resolvedConfig;
  try {
    const actions = await doGenerate(opts, resolvedConfig, logger);
    return {success: true, actions, time: 0}
  } catch (err) {
    logger.err(err.toString());
    if (err instanceof ErrorWithInstruction) {
      logger.log(err.instruction);
    }
    if (resolvedConfig.debug) {
      logger.log('\n-------------------')
      logger.log(err.stack)
      logger.log('-------------------')
    }
    printHelp(templates, logger);
    return {success: false, actions: [], time: 0};
  }
}

async function doGenerate(opts: GenerateOptions, conf: RunnerConfig, logger: Logger) {
  const {cwd, templates} = conf;
  const {attr, name} = opts;

  const params = ParamsResolver.resolve(conf, opts);
  const attrs = Object.assign(AttrsResolver.resolve(attr), {cwd}, name && {name});
  const locals = await LocalsResolver.resolve(conf, params, attrs);
  const {generator, folder} = params;

  opts.dry && logger.log('(dry mode)')
  if (!generator) {
    throw new Error('Please specify a generator.')
  }

  logger.log(`Loaded templates: ${templates!.replace(`${cwd}/`, '')}`)

  if (!(await fs.pathExists(folder!))) {
    throw new ErrorWithInstruction(`I can't find generator '${generator}'`, `
      You can try:
      1. ${chalk.yellow("coge generator init")} to initialize your project, and
      2. ${chalk.yellow("coge generator new " + generator)} to build the generator you wanted.`);
  }

  // lazy loading these dependencies gives a better feel once
  // a user is exploring coge (not specifying what to execute)
  const renderedActions = await render(params, locals, conf);
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
