import fs = require('fs-extra');
import ejs = require('ejs');
import fm = require('front-matter');
import path = require('path');
import walk = require('ignore-walk');

import {Params, RenderedAction, RunnerConfig} from './types'
import {context} from './context';

// for some reason lodash/fp takes 90ms to load.
// inline what we use here with the regular lodash.
const map = f => arr => arr.map(f)
const filter = f => arr => arr.filter(f)

const ignores = [
  'prompt.js',
  'index.js',
  '.cogeignore',
  '.DS_Store',
  '.Spotlight-V100',
  '.Trashes',
  'ehthumbs.db',
  'Thumbs.db',
]
const renderTemplate = (tmpl, locals, config) =>
  typeof tmpl === 'string' ? ejs.render(tmpl, context(locals, config)) : tmpl

async function listFiles(dir: string) {
  return walk
    .sync({path: dir, ignoreFiles: ['.cogeignore']})
    .map(f => path.join(dir, f));
}

export const render = async (
  params: Partial<Params>,
  locals?: {[name: string]: any},
  config?: RunnerConfig,
): Promise<RenderedAction[]> => {
  return params.folder ? listFiles(params.folder)
    .then(things => things.sort((a, b) => a.localeCompare(b))) // TODO: add a test to verify this sort
    .then(filter(f => !ignores.find(ig => f.endsWith(ig)))) // TODO: add a
    // test for ignoring prompt.js and index.js
    .then(filter(file => (params.pattern ? file.match(params.pattern) : true)))
    .then(map(file => fs.readFile(file).then(text => ({file, text: text.toString()}))))
    .then(_ => Promise.all(_))
    .then(map(({file, text}) => Object.assign({file}, fm(text))))
    .then(map(({file, attributes, body}) => ({
      file,
      attributes: Object.entries(attributes).reduce((obj, [key, value]) => ({
        ...obj,
        [key]: renderTemplate(value, locals, config),
      }), {}),
      body: renderTemplate(body, locals, config),
    }))) : [];
}

