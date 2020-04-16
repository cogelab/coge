import * as path from 'path';
import {ParamsResolver} from '../resolvers/params';

const fixture = dir => path.join(__dirname, 'fixtures/templates', dir)

describe('params', () => {
  beforeEach(() => {
    process.env.COGE_TMPLS = undefined
  })
  it('dont take template folder in template', async () => {
    const args = await ParamsResolver.resolve(
      { templates: fixture('template-folder-in-templates/_templates') },
      {generator: 'dont-take-this', action: 'foo'},
    )
    expect(args).toEqual({
      action: 'foo',
      pattern: undefined,
      folder: `${fixture(
        'template-folder-in-templates/_templates',
      )}/dont-take-this/foo`,
      generator: 'dont-take-this',
      templates: fixture('template-folder-in-templates/_templates'),
    })
  })

  it('env var overrides local templates but still take explicitly given templates', async () => {
    process.env.COGE_TMPLS = fixture('templates-override/tmpls')
    const args = await ParamsResolver.resolve(
      { templates: fixture('templates-override/_templates') },
      {generator: 'dont-take-this', action: 'foo'},
    )
    expect(args).toEqual({
      action: 'foo',
      pattern: undefined,
      generator: 'dont-take-this',
      folder: `${fixture(
        'templates-override/_templates',
      )}/dont-take-this/foo`,
      templates: fixture('templates-override/_templates'),
    })
  })
})
