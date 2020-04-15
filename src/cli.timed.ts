// this require is used in dev only anyways
// eslint-disable-next-line
require('time-require');

(async () => require('./cli').cli(process.argv))();
