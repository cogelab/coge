import {CliCmdDefinition, Context} from "../types";
import {availableTemplates} from "../help";

export const list: CliCmdDefinition = {
  name: 'list',
  alias: 'ls',
  description: 'List available templates',
  action
}

async function action(context: Context) {
  const {env} = context;
  const {adapter: {logger}} = env;

  logger.log('Available Templates:\n')
  logger.log(availableTemplates(env))
}

