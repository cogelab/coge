import path = require('path');
import fs = require('fs');
import {Prompter} from './types'

interface InteractionParams {
  params(opts: { args }): Promise<any>;
}

interface InteractionPrompt {
  prompt(opts: { prompter, inquirer, args }): Promise<any>;
}

type InteractionOptions = { type: string, name: string, message: string }[];

type Interaction = InteractionParams | InteractionPrompt | InteractionOptions;

const InteractionFiles = ['prompt.js', 'index.js'];
export async function prompt<Q, T>(
  createPrompter: () => Prompter<Q, T>,
  folder: string,
  opts: Record<string, any>,
): Promise<T | object> {
  const file = InteractionFiles
    .map(f => path.resolve(path.join(folder, f)))
    .find(f => fs.existsSync(f));

  const interaction: any = file && await require(file);

  if (!interaction || (!interaction.params && !interaction.prompt && !interaction.filter)) {
    return Promise.resolve({})
  }

  // short circuit without prompter
  // $FlowFixMe
  if (interaction.params) {
    return interaction.params({args: opts});
  }

  // lazy loads prompter
  // everything below requires it
  const prompter = createPrompter()
  if (interaction.prompt) {
    return interaction.prompt({prompter, inquirer: prompter, args: opts});
  }

  return prompter.prompt(
    // prompt _only_ for things we've not seen on the CLI
    interaction.filter(p =>
      opts[p.name] == null ||
      opts[p.name].length === 0,
    ),
  )
}
