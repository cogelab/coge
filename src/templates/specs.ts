import fs = require('fs-extra');
import toml = require('@iarna/toml');

export interface TemplateSpecs {
  params?: {
    type?: string;
    name: string;
    message: string;
  }[];

  [p: string]: any;
}

export function loadTemplateSpecs(file: string): TemplateSpecs {
  return toml.parse(fs.readFileSync(file).toString('utf8'));
}
