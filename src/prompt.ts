import path = require('path');
import fs = require('fs-extra');
import {Prompter, TemplateEntry} from './types'

interface Interaction {
  params?: (opts: {context: Record<string, any>})=> Promise<any>;
  prompt?: (opts: {prompter: Prompter<any, any>, context: Record<string, any>}) => Promise<any>;
}

const InteractionFiles = ['prompt.js', 'index.js'];

export async function prompt<Q, T>(
  prompter: Prompter<any, any>,
  template: TemplateEntry,
  context?: Record<string, any>,
): Promise<T | object> {

  let {params} = template.config;
  if (!params) {
    const file = InteractionFiles
      .map(f => path.resolve(path.join(template.dir, f)))
      .find(f => fs.existsSync(f));

    params = file && await require(file);

    if (!params) {
      return Promise.resolve({})
    }
  }

  context = context || {};
  if (Array.isArray(params)) {
    // prompt _only_ for things we've not seen on the CLI
    params = params.filter(p =>
      context![p.name] == null ||
      context![p.name].length === 0,
    );
    return prompter.prompt(params);
  }

  const interaction = <Interaction>params;

  // short circuit without prompter
  // $FlowFixMe
  if (interaction.params) {
    return interaction.params({context});
  }

  // lazy loads prompter
  // everything below requires it
  if (interaction.prompt) {
    return interaction.prompt({prompter, context});
  }

  return {};

}
