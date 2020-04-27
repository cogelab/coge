import {Context} from "../../types";
import {Environment} from "coge-environment";

export class MockContext implements Context {
  cwd: string;
  env: Environment;

  constructor(options?: Partial<Context>) {
    Object.assign(this, {
      cwd: process.cwd(),
      env: new Environment(),
    }, options);
  }
}
