import * as path from "path";
import {Params, RunnerConfig} from "../types";
import {prompt} from "../prompt";

export class ParamsResolver {
  static resolve(
    {templates}: Pick<RunnerConfig, 'templates'>,
    opts: { [k: string]: any },
  ): Params {
    const {generator, action} = opts;
    if (!generator || !action) {
      return {generator, action, templates}
    }

    const [actionName, pattern] = action.split(':');
    const folder = path.join(templates!, generator, actionName);

    return Object.assign({
      templates,
      folder,
      generator,
      action,
      pattern,
    });
  }
}
