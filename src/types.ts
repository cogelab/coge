import {Environment, PromptModule, Generator} from "coge-environment";
import {GenerateOptions} from "./generate";

type CliCmdValidatorFn = (str: string) => any;
type CliCmdValidatorArg = string[] | string | RegExp | CliCmdValidatorFn | Number;
type CliCmdOptionType = 'int' | 'float' | 'bool' | 'list' | 'repeatable';
type CliCompleteFn = () => Promise<string[]>;

export type CliCmdActionCallback = (context: Context, args: { [p: string]: any }, opts: { [p: string]: any }) => Promise<any>;

export type LogLevel = 'info' | 'debug';

export interface CliCmdArgument {
  flags: string;
  description: string;
  type?: CliCmdOptionType;
  validator?: CliCmdValidatorArg;
  defaultValue?: any;
  complete?: CliCompleteFn;
}

export interface CliCmdOption {
  flags: string;
  description: string;
  type?: CliCmdOptionType;
  validator?: CliCmdValidatorArg;
  defaultValue?: any;
  required?: boolean;
  complete?: CliCompleteFn;
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

export interface Loader {
  exists: (file: string) => Promise<boolean>;
  load: (file: string) => Promise<Record<string, any>>;
  none: (file: string) => Record<string, any>;
}

export interface RunnerSettings {
  cwd?: string;
  prompt?: PromptModule;
}

export interface Prompter<Q, T> {
  prompt: (questions: Q) => Promise<T>
}

export interface RenderedAction {
  file?: string
  attributes: any
  body: string
}

export interface TemplateHelpersBuilder {
  (locals: Record<string, any>, context: Context): Record<string, any>;
}

export interface Context extends Record<string, any> {
  cwd: string;
  env: Environment;
  loglevel?: LogLevel;
  helpers?: TemplateHelpersBuilder | Record<string, any>;
}

export interface TemplateSpecs {
  params?: {
    type?: string;
    name: string;
    message: string;
  }[];

  [p: string]: any;
}

export interface GeneratorEntry {
  generator: Generator;
  dir: string;
  specs: TemplateSpecs;
  pattern?: string;
}

export interface OpSession {
  context: Context;
  overwrite?: boolean;
}

export type OpResult = any
export type Op = (session: OpSession, action: RenderedAction, opts: GenerateOptions) => Promise<OpResult>



