import {CliCmdDefinition, CmdOptions} from "../types";
import {generate} from "../generate";
import {Repest} from "../cli-validators";

export const gen: CliCmdDefinition = {
  name: 'gen',
  description: 'Generate file according to templates',
  default: true,
  action,
  arguments: '<generator> <action> [name]',
  options: [{
    flags: '--dry',
    description: 'Perform a dry run. Files will be generated but not saved.',
  }, {
    flags: '-i, --interactive <interactive>',
    description: 'Execute with interactive mode',
  }, {
    flags: '-n, --name <name>',
    description: 'Specify name',
  }, {
    flags: '-a, --attr <attr>',
    description: 'Set a custom attribute',
    validator: Repest
  }]
}

async function action({conf, opts, logger}: CmdOptions) {
  return await generate(opts, conf, logger);
}

