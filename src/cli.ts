import {Command} from "commander";
import path = require("path");
import execa = require('execa');
import enquirer = require('enquirer');

import {CliOptions, RunnerConfig} from "./types";
import * as commands from "./cmds";
import {GenericLogger} from "./logger";
import {commandArgsToOpts} from "./utils";

const pkg = require("../package.json");
const defaultTemplates = path.join(__dirname, '../templates');

export async function cli(argv: any[], options: CliOptions = {}) {
  let {logger: l, ...config} = options;
  const logger = l || new GenericLogger(console.log.bind(console));

  const prog = new Command();
  prog.storeOptionsAsProperties(false)
  prog.version(pkg.version);

  const conf = Object.assign(buildRunnerConfig(), config);
  for (const c of Object.values(commands)) {
    // const cmd = prog.command(c.name, c.description, {isDefault: c.default});
    const cmd = c.default ? prog : prog.command(c.name);
    cmd.description(c.description);
    cmd.action(async () => {
      const opts = {...commandArgsToOpts(cmd), ...cmd.opts()};
      return await c.action({conf, opts, logger});
    });

    if (c.help) {
      cmd.usage(c.help);
    }
    if (c.arguments) {
      cmd.arguments(c.arguments);
    }

    if (c.options) {
      for (const o of c.options) {
        const optionals: any[] = [o.description];
        if (o.validator) optionals.push(o.validator);
        if (o.defaultValue) optionals.push(o.defaultValue);
        cmd[o.required ? 'requiredOption' : 'option'](o.flags, ...optionals);
      }
    }
  }

  await prog.parseAsync(argv);
  return (await prog._actionResults)[0];
}

function buildRunnerConfig(): RunnerConfig {
  return {
    templates: defaultTemplates,
    cwd: process.cwd(),
    debug: !!process.env.DEBUG,
    exec: (command, body) => {
      const opts = body && body.length > 0 ? { input: body } : {}
      return execa.shell(command, opts)
    },
    // @ts-ignore
    createPrompter: () => enquirer
  };
}

if (require.main === module) {
  (async () => cli(process.argv))();
}
