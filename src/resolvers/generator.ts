/*
 * generator-sample
 * - [.vscode]
 * - [.idea]
 * - action1
 * - action2
 * - not-action
 * - .cogeignore
 * - package.json
 *
 * Specify actions:
 * 1. package.json
 *
 * {
 *   "name": "generator-sample",
 *   ...
 *   "coge": {
 *     "actions": [
 *       "action1",
 *       "action2"
 *     ]
 *   }
 * }
 *
 * 2. add `.cogeignore` file
 *
 * ```
 * not-action
 * ...
 * ```
 */

// npm config ls --json

export interface GeneratorResolverOptions {
  prefix?: string;
  cwd?: string;
  bases?: string | string[];
}

export class GeneratorResolver {

  bases: string[];

  constructor(opts?: {}) {
  }

}
