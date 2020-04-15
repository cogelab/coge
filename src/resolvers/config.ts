import * as path from 'path'
import * as fs from 'fs-extra'
import {FileResolver} from './file'
import {RunnerConfig} from '../types'

export class ConfigResolver {
  protected resolver: FileResolver;

  static resolve(conf: RunnerConfig);
  static resolve(file: string, conf: RunnerConfig);
  static resolve(file: string | RunnerConfig, conf?: RunnerConfig): Promise<RunnerConfig> {
    if (!(typeof file === 'string')) {
      conf = file;
      file = '';
    }
    return new this(file).resolve(conf!);
  }

  constructor(file?: string) {
    file = file || '.coge.js';
    this.resolver = new FileResolver(file, {
      exists: fs.pathExists,
      // $FlowFixMe
      load: f => Promise.resolve(require(f)),
      none: _ => ({}),
    });
  }

  async resolve(config: RunnerConfig): Promise<RunnerConfig> {
    let {cwd, templates} = config;
    cwd = cwd || process.cwd();

    const resolvedTemplates =
      [process.env.COGE_TMPLS, path.join(cwd, '_templates')].find(_ => _ && fs.existsSync(_)) || templates;

    return {
      ...config,
      templates: resolvedTemplates,
      ...(await this.resolver.resolve(cwd)),
    }
  }
}
