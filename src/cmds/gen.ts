import {CliCmdDefinition, CmdOptions} from "../types";
import {generate, GenerateOptions} from "../generate";
import {Repest} from "../cli-validators";

export const gen: CliCmdDefinition = {
  name: 'gen',
  description: 'Generate file according to templates',
  default: true,
  action,
  arguments: '<generator> <action> [name]',
  options: [{
    flags: '--dry',
    description: 'perform a dry run. files will be generated but not saved.',
  }, {
    flags: '-f, --force',
    description: 'force to perform the run without interactive confirming',
  }, {
    flags: '-n, --name <name>',
    description: 'simplified definition of `name` attribute ',
  }, {
    flags: '-A <attr>=<value>',
    description: 'set <attr> to <value>',
    validator: Repest
  }]
}

async function action({conf, opts, logger}: CmdOptions) {
  return await generate(<GenerateOptions>opts, conf, logger);
}

