import {CliCmdDefinition, CmdOptions} from "../types";
import {generate, GenerateOptions} from "../generate";
import {AttrsResolver} from "../resolvers/attrs";

export const gen: CliCmdDefinition = {
  name: 'gen',
  description: 'Generate file according to templates',
  default: true,
  action,
  arguments: [{
    flags: '<generator>',
    description: 'Generator to generate'
  }, {
    flags: '<action>',
    description: 'Generator action'
  }, {
    flags: '[name]',
    description: 'Specify name attribute'
  }],
  options: [{
    flags: '--dry',
    description: 'Perform a dry run. files will be generated but not saved.',
  }, {
    flags: '-f --force',
    description: 'Overwrite files that already exist without confirmation',
  }, {
    flags: '-n --name <name>',
    description: 'Simplified definition of `name` attribute ',
  }, {
    flags: '-D --data <var>=<value>',
    description: 'Set data <var> to <value>',
    type: 'repeatable',
  }]
}

async function action({conf, opts, logger}: CmdOptions) {
  const {data, ...others} = opts;
  others.attrs = AttrsResolver.resolve(data);
  return await generate(<GenerateOptions>others, conf, logger);
}

