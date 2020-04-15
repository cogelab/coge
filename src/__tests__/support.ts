import * as path from "path";
import {GenericLogger} from "../logger";

export const fixture = dir => path.join(__dirname, 'fixtures/templates', dir);
export const createLogger = () => new GenericLogger(console.log);
