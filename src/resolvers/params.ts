import * as path from "path";
import {Params, RunnerConfig} from "../types";
import {prompt} from "../prompt";

export class ParamsResolver {
  static async resolve(
    {templates, createPrompter}: Pick<RunnerConfig, 'templates'> & Partial<RunnerConfig>,
    opts: { [k: string]: any },
    attrs?: { [k: string]: any },
  ): Promise<Params> {
    const {generator, action, name} = opts;
    if (!generator || !action) {
      return {generator, action, templates}
    }

    const [actionName, pattern] = action.split(':');
    const folder = path.join(templates, generator, actionName);
    const promptArgs = createPrompter ? await prompt(createPrompter, folder, {
      // NOTE we might also want the rest of the generator/action/etc. params here
      // but there is no use-case yet
      ...(name ? {name} : {}),
      ...attrs
    }) : {};

    return Object.assign({
      templates,
      folder,
      generator,
      action,
      pattern,
    }, promptArgs, attrs, name && {name});
  }
}
