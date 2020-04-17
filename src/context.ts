import inflection = require('inflection');
import changeCase = require('change-case');

import {RunnerConfig} from "./types";
import {undasherize} from "./utils";

// supports kebab-case to KebabCase
//@ts-ignore
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
  action: '',
};

const capitalizedLocals = (locals: any) => Object.entries(locals).reduce(doCapitalization, {});

export const context = (locals: any, config?: Partial<RunnerConfig>) => {
  const localsWithDefaults = Object.assign({}, localsDefaults, locals);
  const configHelpers = config && (typeof config.helpers === "function" ? config.helpers(locals, config) : config.helpers) || {};
  return Object.assign(localsWithDefaults, capitalizedLocals(localsWithDefaults), {
    h: {...helpers, ...configHelpers}
  });
};
