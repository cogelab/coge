import {Environment} from "coge-environment";

import {NoTemplates} from "./instructions";

export function printHelp(env: Environment) {
  const {adapter: {logger}} = env;
  if (env.namespaces().length) {
    logger.log('Available Templates:\n');
    logger.log(availableTemplates(env));
  } else {
    logger.log(NoTemplates());
  }
}

export function availableTemplates(env: Environment) {
  const templates = Object.keys(env.getTemplates()).reduce((namesByTemplate, template) => {
    const parts = template.split(':');
    const templateName = <string>parts.shift();

    // If first time we found this template, prepare to save all its sub-templates
    if (!namesByTemplate[templateName]) {
      namesByTemplate[templateName] = [];
    }

    // If sub-template (!== app), save it
    if (parts[0] !== 'app') {
      namesByTemplate[templateName].push(parts.join(':'));
    }

    return namesByTemplate;
  }, {});

  if (Object.keys(templates).length === 0) {
    return '  Couldn\'t find any templates, did you install any?' // 'Troubleshoot issues by running\n\n  $ coge doctor';
  }

  return Object.keys(templates).map(template => {
    const subTemplates = templates[template].map(subTemplate => `    ${subTemplate}`).join('\n');
    return `  ${template}${subTemplates.trim() ? '\n' + subTemplates : ''}`;
  }).join('\n');
}
