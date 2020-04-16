export interface Logger {
  ok: (msg: string) => void
  notice: (msg: string) => void
  warn: (msg: string) => void
  err: (msg: string) => void
  log: (msg: string) => void
  colorful: (msg: string) => void
}

type CliCmdValidatorFn = (str: string) => any;
type CliCmdValidatorArg = string[] | string | RegExp | CliCmdValidatorFn | Number;

type CliCmdActionCallback = (opts: CmdOptions) => Promise<any>;

type CliCmdOptionType = 'int' | 'float' | 'bool' | 'list' | 'repeatable';

export interface CliCmdArgument {
  flags: string;
  description: string;
  type?: CliCmdOptionType;
  validator?: CliCmdValidatorArg;
  defaultValue?: any;
}

export interface CliCmdOption {
  flags: string;
  description: string;
  type?: CliCmdOptionType;
  validator?: CliCmdValidatorArg;
  defaultValue?: any;
  required?: boolean;
}

export interface CliCmdDefinition {
  name: string;
  description: string;
  default?: boolean;
  alias?: string;
  help?: string;
  arguments?: CliCmdArgument[];
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

