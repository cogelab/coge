// @ts-ignore
import {Caporal} from 'caporal';
import Program = require("caporal/lib/program");
import path = require("path");
import enquirer = require('enquirer');

import {CliOptions, RunnerConfig} from "./types";
import * as commands from "./cmds";
import {GenericLogger} from "./logger";
import {assign, shell} from "./utils";

const pkg = require("../package.json");
const defaultTemplates = path.join(__dirname, '../templates');


export async function cli(argv: any[], options: CliOptions = {}) {
  return buildProgram(options).parse(argv);
}

function buildProgram(options: CliOptions = {}) {
  let {logger: l, ...config} = options;
  const logger = l || new GenericLogger(console.log.bind(console));

  const prog: Caporal = new Program();
  prog.version(pkg.version);

  const conf = Object.assign(buildRunnerConfig(), config);
  for (const c of Object.values(commands)) {
    // const cmd = prog.command(c.name, c.description, {isDefault: c.default});
    const cmd = c.default ? prog.description(c.description) : prog.command(c.name, c.description);
    cmd.action(async (args, opts) => {
      opts = assign({}, args, opts);
      return await c.action({conf, opts, logger});
    });

    if (c.help) {
      cmd.help(c.help);
    }
    if (c.arguments) {
      for (const a of c.arguments) {
        const arg = cmd.argument(a.flags, a.description, a.validator, a.defaultValue);
        if (a.complete) {
          arg.complete(a.complete);
        }
      }
    }

    if (c.options) {
      for (const o of c.options) {
        const opt = cmd.option(o.flags, o.description,
          o.validator || (o.type && prog[o.type.toUpperCase()]),
          o.defaultValue,
          o.required
        );
        if (o.complete) {
          opt.complete(o.complete);
        }
      }
    }
  }

  return prog;
}

function buildRunnerConfig(): RunnerConfig {
  return {
    templates: defaultTemplates,
    cwd: process.cwd(),
    debug: !!process.env.DEBUG,
    exec: (command, body) => {
      const opts = body && body.length > 0 ? {input: body} : {}
      return shell(command, opts)
    },
    // @ts-ignore
    createPrompter: () => enquirer
  };
}

if (require.main === module) {
  (async () => cli(process.argv))();
}
