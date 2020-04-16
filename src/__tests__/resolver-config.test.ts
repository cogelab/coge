import {ConfigResolver} from "../resolvers/config";
import {fixture} from "./support";

const templateParams = ({cwd, templates,}: {
  cwd: string
  templates: string
}) => {
  return {
    cwd,
    templates,
    exec: () => {
    },
    debug: false,
    helpers: {},
    createPrompter: () => require('enquirer'),
  }
}
describe('resolver/config', () => {
  it('no file exists in 1/_templates so take "2"', async () => {
    expect(
      (await ConfigResolver.resolve(templateParams({cwd: '/1', templates: '2'})))
        .templates,
    ).toEqual('2')
  })

  it('when templates exist', async () => {
    expect(
      (await ConfigResolver.resolve(
        templateParams({cwd: fixture('app'), templates: '2'}),
      )).templates,
    ).toEqual(fixture('/app/_templates'))
  })

  it('take other_templates if explicitly given', async () => {
    process.env.COGE_TMPLS = fixture('app-custom/other-templates')
    expect(
      (await ConfigResolver.resolve(
        templateParams({cwd: fixture('app-custom'), templates: '2'}),
      )).templates,
    ).toEqual(fixture('app-custom/other-templates'))
    process.env.COGE_TMPLS = undefined;
  })
});
