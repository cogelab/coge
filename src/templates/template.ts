import * as path from "path";
import * as isScoped from "is-scoped";
import * as globby from "globby";
import {Environment, Meta} from "coge-environment";
import {loadTemplateSpecs, TemplateSpecs} from "./specs";
import {ErrorWithInstruction} from "../errors";
import {AvailableTemplatesForGenerator, GeneratorNotFound} from "../instructions";
import {Prompter} from "../types";

export interface TemplateInfo {
  dir: string;
  meta: Meta;
  specs: TemplateSpecs;
  pattern?: string;
}

interface TemplatePromptOptions {
  prompter: Prompter<any, any>;
  context: Record<string, any>;
}

interface TemplateCtorOptions extends TemplateInfo {
}

interface TemplateCtor {
  new(opts: TemplateCtorOptions);
}

export interface Template {
  _info: TemplateInfo;
  questions?: Record<string, any>[];
  params?: (opts: TemplatePromptOptions) => Promise<any>;
  prompt?: (opts: TemplatePromptOptions) => Promise<any>;
  locals?: (locals: Record<string, any>) => Promise<Record<string, any> | undefined>;
  filter?: (files: string[], locals: Record<string, any>) => Promise<string[]>
}

export function loadTemplate(env: Environment, namespace: string): Template {

  let generator = ''
  let pattern: string | undefined = undefined;
  let meta = env.get(namespace);
  if (!meta) {
    const parts = namespace.split(':');
    generator = parts[0];
    if (parts.length >= 2) {
      pattern = parts.pop();
      meta = env.get(parts.join(':'));
    }
  }
  if (!meta) {
    throw notFoundTemplate(env, namespace, generator);
  }

  const dir = path.dirname(meta.resolved);
  const specs = loadTemplateSpecs(meta.resolved);

  const info = {meta, specs, dir, pattern};
  const template = create(dir, {...info});
  template._info = info;
  return template;
}

function create(cwd, opts): Template {
  // TODO prompt.js will be removed
  const file = globby.sync('{index,main,prompt}.js', {
    cwd,
    absolute: true,
  })[0];

  if (file) {
    try {
      const module = require(file);
      if (typeof module === 'function') {
        return new module(opts);
      }
      if (Array.isArray(module)) {
        return <Template>{questions: module};
      }
      return <Template>module;
    } catch (e) {
      // no-op
    }
  }
  return <Template>{}
}

function notFoundTemplate(env: Environment, namespace: string, generator: string) {
  const installed = !!env.namespaces().find(n => n.startsWith(generator));
  const name = getTemplateName(namespace);
  const hint = getTemplateHint(name);
  if (installed) {
    return new ErrorWithInstruction(
      `Generator '${hint}' doesn\'t have an template with namespace '${namespace}'.`,
      AvailableTemplatesForGenerator(env, name, hint)
    );
  } else {
    return new ErrorWithInstruction(
      `You don't seem to have a generator with the name '${hint}' installed.`,
      GeneratorNotFound(env, name, hint)
    );
  }
}

function getTemplateName(namespace: string) {
  return namespace.split(':')[0];
}

function getTemplateHint(namespace) {
  if (isScoped(namespace)) {
    const splitName = namespace.split('/');
    return `${splitName[0]}/gen-${splitName[1]}`;
  }
  return `gen-${namespace}`;
}
