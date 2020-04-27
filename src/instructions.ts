import {Environment} from "coge-environment";
import chalk from "chalk";

export const NoTemplates = () => `No templates found.

This means 'coge' didn't find a templates folder right here,
or anywhere up the folder tree starting here.

Here's how to start using coge:

$ coge init
$ coge template:new coco

(edit your template in templates/template-coco)

$ coge coco:gen

See https://github.com/cogelab/coge for more.
`

export const TemplateNotFound = (env: Environment, name: string, hint: string) => `
Help is on the way:

  1. You can see available generators via ${chalk.yellow('npm search coge-template')}.
     Install them with ${chalk.yellow('npm install ' + hint)}.

  2. You can try:
     1) ${chalk.yellow('coge init')} to initialize your project, and
     2) ${chalk.yellow('coge template:new ' + name)} to build the template you wanted.

To see all your installed templates run ${chalk.yellow('coge list')}.

If ${chalk.yellow('coge list')} cannot find the template, run ${chalk.yellow('coge doctor')} to troubleshoot your system.
`
