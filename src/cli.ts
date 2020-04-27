// @ts-ignore
import {Caporal} from 'caporal';
import * as Program from "caporal/lib/program";
import values from "@tiopkg/utils/object/values";

import * as commands from "./cmds";
import {CliCmdActionCallback, CliCmdDefinition, RunnerSettings} from "./types";
import {DefaultContext} from "./context";

const pkg = require("../package.json");

export async function cli(argv: any[], settings?: RunnerSettings) {
  return createProgram(argv, settings);
}

async function createProgram(argv: any[], settings?: RunnerSettings) {
  const program: Caporal = new Program();
  program.version(pkg.version);
  values(commands).forEach(def => registerCommand(program, def, settings));
  return await program.parse(argv);
}

function registerCommand(program: Caporal, def: CliCmdDefinition, settings?: RunnerSettings) {
  const cmd = def.default ? program.description(def.description) : program.command(def.name, def.description);
  cmd.action((args, opts) => perform(def.action, args, opts, settings));

  if (def.help) {
    cmd.help(def.help);
  }

  if (def.arguments) {
    for (const a of def.arguments) {
      const arg = cmd.argument(a.flags, a.description, a.validator, a.defaultValue);
      if (a.complete) {
        arg.complete(a.complete);
      }
    }
  }

  if (def.options) {
    for (const o of def.options) {
      const opt = cmd.option(o.flags, o.description,
        o.validator || (o.type && program[o.type.toUpperCase()]),
        o.defaultValue,
        o.required
      );
      if (o.complete) {
        opt.complete(o.complete);
      }
    }
  }
}

async function perform(
  action: CliCmdActionCallback,
  args: { [k: string]: any },
  opts: { [k: string]: any },
  settings?: RunnerSettings,
) {
  settings = settings || {};
  return action(await DefaultContext.create({
    ...settings,
    lookup: {localOnly: !opts.global}
  }), args, opts);
}

if (require.main === module) {
  (async () => cli(process.argv))();
}
