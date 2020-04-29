import {Prompter} from './types'
import {Template} from "./templates";

export async function prompt<Q, T>(
  prompter: Prompter<any, any>,
  template: Template,
  context?: Record<string, any>,
): Promise<T | object> {

  const questions = template._info.specs.params || template.questions;

  context = context || {};
  if (Array.isArray(questions)) {
    // prompt _only_ for things we've not seen on the CLI
    return prompter.prompt(questions.filter(p =>
      context![p.name] == null ||
      context![p.name].length === 0,
    ));
  }

  if (template.prompt) {
    return template.prompt({prompter, context});
  }

  if (template.params) {
    return template.params({prompter, context});
  }

  return {};

}
