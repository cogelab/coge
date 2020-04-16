import {undasherize} from "../utils";

export class AttrsResolver {
  static resolve(attrs?: string[]): { [name: string]: any } {
    if (!attrs) return {};
    return attrs.reduce((answer, s) => {
      const parts = s.trim().split(/[=]/);
      answer[parts[0]] = answer[undasherize(parts[0], true)] = parts[1] || true;
      return answer;
    }, {});
  }

}
