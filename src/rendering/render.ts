import fs = require('fs-extra');
import ejs = require('ejs');
import fm = require('front-matter');
import path = require('path');
import walk = require('ignore-walk');

import {Context, RenderedAction} from '../types'
import {buildContext} from './context';
import last from "@tiopkg/utils/array/last";
import {Template} from "../templates";

const ignores = [
  'coge.toml',
  'prompt.js',
  'index.js',
  '.cogeignore',
  '.DS_Store',
  '.Spotlight-V100',
  '.Trashes',
  'ehthumbs.db',
  'Thumbs.db',
];

function extractFolder(file: string) {
  const dir = path.dirname(file);
  const parts = dir.split(path.sep);
  return last(parts);
}

function renderTemplate(tmpl: any, locals?: Record<string, any>, context?: Context, extra?: Record<string, any>) {
  return typeof tmpl === 'string' ? ejs.render(tmpl, buildContext(locals, context, extra || {})) : tmpl;
}

async function listFiles(dir: string) {
  return walk
    .sync({path: dir, ignoreFiles: ['.cogeignore']})
    .map(f => path.join(dir, f));
}

export const render = async (
  context: Context,
  template: Template,
  locals?: Record<string, any>,
): Promise<RenderedAction[]> => {
  const info = template._info;
  const files = (await listFiles(info.dir))
    .sort((a, b) => a.localeCompare(b))  // TODO: add a test to verify this sort
    .filter(file => !ignores.find(ig => file.endsWith(ig)))
    .filter(file => (info.pattern ? file.match(info.pattern) : true));

  const entries = await Promise.all(files.map(file => fs.readFile(file).then(text => ({file, text: text.toString()}))));
  return entries
    .map(({file, text}) => ({file, ...fm<Record<string, any>>(text)}))
    .map(({file, attributes, body}) => ({
      file,
      attributes: Object.entries(attributes).reduce((obj, [key, value]) => ({
        ...obj,
        [key]: renderTemplate(value, locals, context, {folder: extractFolder(file)}),
      }), {}),
      body: renderTemplate(body, locals, context, {folder: extractFolder(file)}),
    }));
}

