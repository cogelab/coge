import chalk from 'chalk';

import {render} from "./rendering";
import {resolveOps} from "./ops";
import {ErrorWithInstruction} from "./errors";
import {assign} from "./utils";
import {Context, Op, OpSession} from "./types";

import {prompt} from "./prompt";
import {loadTemplate} from "./templates";

export interface GenerateOptions {
  global?: boolean;
  force?: boolean;
  dry?: boolean;
  attrs?: Record<string, any>;
}

export async function generate(context: Context, generator: string, opts: GenerateOptions) {
  const {logger} = context.env.adapter;
  try {
    const actions = await doGenerate(context, generator, opts);
    return {success: true, actions, time: 0}
  } catch (err) {
    logger.log(chalk.red(err.toString()));
    if (err instanceof ErrorWithInstruction) {
      logger.log(err.instruction);
    }
    if (context.debug) {
      logger.log('')
      logger.log('-------------------')
      logger.log(err.stack)
      logger.log('-------------------')
    }
    return {success: false, actions: [], time: 0};
  }
}

async function doGenerate(context: Context, generator: string, opts: GenerateOptions) {
  const {cwd, env} = context;
  const {logger} = env.adapter;

  opts.dry && logger.log('(dry mode)');
  if (!generator) {
    throw new Error('Please specify a generator.');
  }

  const template = loadTemplate(env, generator);
  const attrs = assign({cwd}, opts.attrs);
  const answers = await prompt(env.adapter, template, attrs);

  const locals = Object.assign({}, answers, attrs, {cwd});

  // lazy loading these dependencies gives a better feel once
  // a user is exploring coge (not specifying what to execute)
  const renderedActions = await render(context, template, locals);
  const messages: string[] = [];
  const result: Op[] = [];
  const session: OpSession = {context};
  for (const action of renderedActions) {
    const {message} = action.attributes
    if (message) {
      messages.push(message)
    }
    const ops = resolveOps(action.attributes)
    for (const op of ops) {
      result.push(await op(session, action, opts))
    }
  }
  if (messages.length > 0) {
    logger.colorful(`${generator}:\n${messages.join('\n')}`);
  }
  return result;
}

