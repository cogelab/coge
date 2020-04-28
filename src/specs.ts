import fs = require('fs-extra');
import toml = require('@iarna/toml');
import {TemplateSpecs} from "./types";

export function loadTemplateSpecs(file: string): TemplateSpecs {
  return toml.parse(fs.readFileSync(file).toString('utf8'));
}
