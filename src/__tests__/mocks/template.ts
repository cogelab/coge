import {Template, TemplateInfo} from "../../templates";

export function mockTemplate(info: Partial<TemplateInfo>, template?: Partial<Template>): Template {
  template = template || {};
  template._info = <TemplateInfo>info;
  return <Template>template;
}
