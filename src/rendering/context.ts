import inflection = require('inflection');
import changeCase = require('change-case');

import {Context} from "../types";
import {undasherize} from "../utils";

// supports kebab-case to KebabCase
// @ts-ignore
inflection.undasherize = undasherize;

const helpers = {
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  },
  inflection,
  changeCase
};

const doCapitalization = (hsh, [key, value]) => {
  hsh[key] = value;

  if (localsToCapitalize.includes(key)) hsh[helpers.capitalize(key)] = helpers.capitalize(value);

  return hsh;
};

const localsToCapitalize = ['name'];
const localsDefaults = {
  name: 'unnamed',
  group: '',
  folder: '',  // the folder of the template file
  dir: '',     // the relative directory to template root
  trd: '',     // the relative directory to template root
  drd: '',     // the relative directory to cwd
};

const capitalizedLocals = (locals: any) => Object.entries(locals).reduce(doCapitalization, {});

export const buildContext = (locals: any, context?: Context, ...extras: Record<string, any>[]) => {
  const localsWithDefaults = Object.assign({}, localsDefaults, locals, ...extras);
  const configHelpers = typeof context?.helpers === "function" ? context.helpers(locals, context) : (context?.helpers || {});
  return Object.assign(localsWithDefaults, capitalizedLocals(localsWithDefaults), {
    h: {...helpers, ...configHelpers}
  });
};
