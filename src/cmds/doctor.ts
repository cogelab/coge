import {CliCmdDefinition, CmdOptions} from "../types";
import {CliOptionsRepeat} from "../cli-validators";
import {generate, GenerateOptions} from "../generate";

export const doctor: CliCmdDefinition = {
  name: 'doctor',
  description: 'Issues diagnosis',
  action,
  arguments: [],
  options: []
}

async function action({conf, opts, logger}: CmdOptions) {
  console.log('doctor');
}
