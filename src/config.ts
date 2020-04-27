import fs = require('fs-extra');
import toml = require('@iarna/toml');
import {TemplateConfig} from "./types";

export function loadTemplateConfig(file: string): TemplateConfig {
  return toml.parse(fs.readFileSync(file).toString('utf8'));
}
