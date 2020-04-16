import {CliCmdDefinition, CmdOptions} from "../types";
import {generate, GenerateOptions} from "../generate";
import {CliOptionsRepeat} from "../cli-validators";

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
    description: 'overwrite files that already exist without confirmation',
  }, {
    flags: '-n, --name <name>',
    description: 'simplified definition of `name` attribute ',
  }, {
    flags: '-A <attr>=<value>',
    description: 'set <attr> to <value>',
    validator: CliOptionsRepeat
  }, {
    flags: '--af',
    description: 'attribute file to load'
  }, {
    flags: '--ap',
    description: 'attribute path to merge from attribute file'
  }]
}

async function action({conf, opts, logger}: CmdOptions) {
  return await generate(<GenerateOptions>opts, conf, logger);
}

