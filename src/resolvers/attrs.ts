import {set, undasherize} from "../utils";

export class AttrsResolver {
  static resolve(attrs?: string[]): { [name: string]: any } {
    if (!attrs) return {};
    return attrs.reduce((answer, s) => {
      const parts = s.trim().split(/[=]/);
      const value = parts[1] === undefined ? true : parts[1];
      set(answer, parts[0], value);
      set(answer, undasherize(parts[0], true), value);
      return answer;
    }, {});
  }

}
