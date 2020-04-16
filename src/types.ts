// export interface Logger {
//   debug(str: string|object): void;
//   debug(format: string, ...mixed: any[]): void;
//   info(str: string|object): void;
//   info(format: string, ...mixed: any[]): void;
//   log(str: string|object): void;
//   log(format: string, ...mixed: any[]): void;
//   warn(str: string|object): void;
//   warn(format: string, ...mixed: any[]): void;
//   error(str: string|object): void;
//   error(format: string, ...mixed: any[]): void;
// }

export interface Logger {
  ok: (msg: string) => void
  notice: (msg: string) => void
  warn: (msg: string) => void
  err: (msg: string) => void
  log: (msg: string) => void
  colorful: (msg: string) => void
}

type CliCmdValidatorFn = <T>(value: string, previous: T) => T;
type CliCmdValidator = RegExp | CliCmdValidatorFn;

type CliCmdActionCallback = (opts: CmdOptions) => Promise<any>;

export interface CliCmdOption {
  flags: string;
  description: string;
  validator?: CliCmdValidator;
  defaultValue?: any;
  required?: boolean;
}

export interface CliCmdDefinition {
  name: string;
  description: string;
  default?: boolean;
  alias?: string;
  help?: string;
  arguments?: string;
  options?: CliCmdOption[];
  action: CliCmdActionCallback;
}

export interface CliOptions extends Partial<RunnerConfig> {
  logger?: Logger;
}

export interface Loader {
  exists: (arg0: string) => Promise<boolean>
  load: (arg0: string) => Promise<Record<string, any>>
  none: (arg0: string) => Record<string, any>
}

export interface Prompter<Q, T> {
  prompt: (arg0: Q) => Promise<T>
}

export interface RenderedAction {
  file?: string
  attributes: any
  body: string
}

export interface RunnerConfig {
  cwd: string
  templates: string
  exec: (sh: string, body: string) => void
  debug: boolean
  helpers: any
  createPrompter: <Q, T>() => Prompter<Q, T>
}

export type Params = {
  templates: string;
  generator: string;
  action: string;
  folder?: string;
  pattern?: string;
  dry?: boolean;
  // name?: string;
}

export type CmdOptions = {
  conf: RunnerConfig;
  opts: { [k: string]: any };
  logger: Logger;
}

export type OpResult = any
export type Op = (action: RenderedAction, opts: any, conf: RunnerConfig, logger: Logger) => Promise<OpResult>

