import * as path from "path";
import chalk from 'chalk';
import * as isScoped from 'is-scoped';

import {render} from "./rendering";
import {resolveOps} from "./ops";
import {ErrorWithInstruction} from "./errors";
import {Environment} from "coge-environment";
import {assign} from "./utils";
import {loadTemplateConfig} from "./config";
import {Context, Op, OpSession, TemplateEntry} from "./types";

import {prompt} from "./prompt";
import {TemplateNotFound} from "./instructions";
import {printHelp} from "./help";

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
    // if (err instanceof ErrorWithInstruction) {
    //   logger.log(err.instruction);
    // }
    // if (resolvedConfig.debug) {
      logger.log('')
      logger.log('-------------------')
      logger.log(err.stack)
      logger.log('-------------------')
    // }
    // printHelp(context.env);
    return {success: false, actions: [], time: 0};
  }
}

async function doGenerate(context: Context, generator: string, opts: GenerateOptions) {
  const {cwd, env} = context;
  const {logger} = env.adapter;

  opts.dry && logger.log('(dry mode)');
  if (!generator) {
    throw new Error('Please specify a template.');
  }

  const entry = createTemplateEntry(env, generator);
  const attrs = assign({cwd}, opts.attrs);
  const answers = await prompt(env.adapter, entry, attrs);
  const locals = Object.assign({}, answers, attrs, {cwd});

  // lazy loading these dependencies gives a better feel once
  // a user is exploring coge (not specifying what to execute)
  const renderedActions = await render(context, entry, locals);
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
    // logger.colorful(`${generator}:\n${messages.join('\n')}`);
    logger.ok(`${generator}:\n${messages.join('\n')}`);
  }
  return result;
}

function createTemplateEntry(env: Environment, namespace: string): TemplateEntry {
  let pattern;
  let template = env.get(namespace);
  if (!template) {
    const parts = namespace.split(':');
    if (parts.length >= 2) {
      pattern = parts.pop();
      template = env.get(parts.join(':'));
    }
  }
  if (!template) {
    const name = getTemplateName(namespace);
    const hint = getTemplateHint(name);
    throw new ErrorWithInstruction(
      `You don't seem to have a template with the name '${hint}' installed.`, TemplateNotFound(env, name, hint)
    );
  }

  const dir = path.dirname(template.resolved);
  const config = loadTemplateConfig(template.resolved);
  return {template, config, dir, pattern};
}

function getTemplateName(namespace: string) {
  return namespace.split(':')[0];
}

function getTemplateHint(namespace) {
  if (isScoped(namespace)) {
    const splitName = namespace.split('/');
    return `${splitName[0]}/template-${splitName[1]}`;
  }
  return `template-${namespace}`;
}
