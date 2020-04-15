import chalk from 'chalk';
import template = require('chalk/templates');
import {Logger} from './types';

const {yellow, red, green, magenta} = chalk;

export class GenericLogger implements Logger {
  log: (message?: any, ...optionalParams: any[]) => void

  constructor(log) {
    this.log = log
  }

  colorful(msg) {
    this.log(template(chalk, msg))
  }

  notice(msg) {
    this.log(magenta(msg))
  }

  warn(msg) {
    this.log(yellow(msg))
  }

  err(msg) {
    this.log(red(msg))
  }

  ok(msg) {
    this.log(green(msg))
  }
}
