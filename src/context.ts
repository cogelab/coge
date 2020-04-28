import * as path from "path";
import * as execa from "execa";
import {Environment, EnvironmentOptions, LookupOptions, PromptModule} from "coge-environment";
import {Context, LogLevel, Prompter} from "./types";
import {FileResolver} from "./resolvers/file";
import {FileLoader} from "./loders";
import toArray from "@tiopkg/utils/array/toArray";

export interface DefaultContextOptions extends EnvironmentOptions {
  loglevel?: LogLevel;
  cwd?: string;
  lookup?: Partial<LookupOptions> | boolean;
  prompt?: PromptModule;
  exec?: (action: string, body: string | Buffer) => any;
}

const LogColors = () => ({
  shell: 'blue',
})

const resolver = new FileResolver('.coge.js', FileLoader);


export class DefaultContext implements Context {
  cwd: string;
  env: Environment;
  loglevel: LogLevel;

  static async create();
  static async create(env: Environment);
  static async create(opts: DefaultContextOptions);
  static async create(env: Environment, opts: DefaultContextOptions);
  static async create(env?: Environment | DefaultContextOptions, opts?: DefaultContextOptions) {
    const context = new DefaultContext(env, opts);
    Object.assign(context, await resolver.resolve(context.cwd));
    return context;
  }

  protected constructor(env?: Environment | DefaultContextOptions, opts?: DefaultContextOptions) {
    if (!(env instanceof Environment)) {
      opts = env;
      env = undefined;
    }
    opts = opts || {};
    this.cwd = opts.cwd || process.cwd();
    if (opts.exec) this.exec = opts.exec;

    const {prompt} = opts;
    this.env = env || Environment.createEnv({prompt});

    this.loglevel = opts.loglevel || 'info';

    Object.assign(this.logger.colors, LogColors());

    // lookup built-in templates
    this.lookupLocal(path.resolve(__dirname, '..'), ['generators']);

    // lookup local templates
    if (path.relative(this.cwd, path.resolve(__dirname, '..'))) {
      this.lookupLocal(this.cwd, ['generators']);
    }

    // lookup template-* modules
    if (opts.lookup) {
      this.env.lookup(typeof opts.lookup === 'boolean' ? {} : opts.lookup);
    }

  }

  get logger() {
    return this.env.adapter.logger;
  }

  get prompter(): Prompter<any, any> {
    return this.env.adapter;
  }

  exec(action: string, body: string | Buffer) {
    const opts = body && body.length > 0 ? {input: body} : {}
    return execa(action, {shell: true, ...opts});
  }

  lookup(options?: Partial<LookupOptions> | boolean) {
    return this.env.lookup(options);
  }

  lookupLocal(root: string, folders: string | string[]) {
    toArray(folders).forEach((folder) => {
      this.env.lookup({localOnly: true, npmPaths: path.resolve(root, folder)});
      this.env.lookup({localOnly: true, packagePaths: path.resolve(root, folder)});
    });
  }

}
