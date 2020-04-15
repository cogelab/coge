import path = require('path');
import fs = require('fs');
import {Prompter} from './types'

interface Interactor {
}

const InteractorFiles = ['prompt.js', 'index.js'];

export async function prompt<Q, T>(
  createPrompter: () => Prompter<Q, T>,
  folder: string,
  opts: Record<string, any>,
): Promise<T | object> {
  const file = InteractorFiles
    .map(f => path.resolve(path.join(folder, f)))
    .find(f => fs.existsSync(f))

  if (!file) {
    return Promise.resolve({})
  }

  // short circuit without prompter
  // $FlowFixMe
  const interactor: any = require(file)
  if (typeof interactor.params === 'function') {
    return interactor.params({args: opts})
  }

  // lazy loads prompter
  // everything below requires it
  const prompter = createPrompter()
  if (interactor.prompt) {
    return interactor.prompt({prompter, inquirer: prompter, args: opts})
  }

  return prompter.prompt(
    // prompt _only_ for things we've not seen on the CLI
    interactor.filter(p =>
      opts[p.name] == null ||
      opts[p.name].length === 0,
    ),
  )
}
