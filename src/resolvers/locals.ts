import {Params, RunnerConfig} from "../types";
import {prompt} from "../prompt";

export class LocalsResolver {
  static async resolve(
    {createPrompter}: Partial<RunnerConfig>,
    params: Params,
    provided?: { [k: string]: any },
  ): Promise<any> {
    const {folder} = params;
    const answer = createPrompter ? await prompt(createPrompter, folder!, provided || {}) : {};
    return Object.assign(answer, provided);
  }
}
