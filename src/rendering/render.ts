import fs = require('fs-extra');
import ejs = require('ejs');
import fm = require('front-matter');
import path = require('path');
import walk = require('ignore-walk');

import {Context, RenderedAction} from '../types'
import {buildContext} from './context';
import last from "@tiopkg/utils/array/last";
import {Template} from "../template";

const ignores = [
  'template.toml',
  'prompt.js',
  'index.js',
  'main.js',
  '.cogeignore',
  '.DS_Store',
  '.Spotlight-V100',
  '.Trashes',
  'ehthumbs.db',
  'Thumbs.db',
];

export const render = async (
  context: Context,
  template: Template,
  locals?: Record<string, any>,
): Promise<RenderedAction[]> => {
  locals = locals || {};
  const info = template._info;

  // prepare templates
  let files = (await listFiles(info.dir))
    .sort((a, b) => a.localeCompare(b))  // TODO: add a test to verify this sort
    .filter(file => !ignores.find(ig => file.endsWith(ig)));

  if (info.pattern) {
    files = files.filter(file => file.match(info.pattern));
  }

  if (template.filter) {
    files = await template.filter(files, locals);
  }

  // read templates
  const entries = await Promise.all(files.map(file => fs.readFile(file).then(text => ({file, text: text.toString()}))));

  // parse and render templates
  return entries
    .map(({file, text}) => ({file, ...fm<Record<string, any>>(text)}))
    .map(({file, attributes, body}) => {
      const extra = extractFilePath(info.dir, file);
      return {
        file,
        attributes: Object.entries(attributes).reduce((obj, [key, value]) => ({
          ...obj,
          [key]: renderTemplate(value, locals, context, extra),
        }), {}),
        body: renderTemplate(body, locals, context, extra),
      }
    });
}

async function listFiles(dir: string) {
  return walk
    .sync({path: dir, ignoreFiles: ['.cogeignore']})
    .map(f => path.join(dir, f));
}

function extractFilePath(root: string, file: string) {
  const dir = path.relative(root, path.dirname(file));
  const folder = last(dir.split(path.sep));
  return {dir, folder};
}

function renderTemplate(tmpl: any, locals?: Record<string, any>, context?: Context, extra?: Record<string, any>) {
  return typeof tmpl === 'string' ? ejs.render(tmpl, buildContext(locals, context, extra || {})) : tmpl;
}

