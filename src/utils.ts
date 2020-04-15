export function undasherize(str: string, low_first_letter?: boolean) {
  let answer = str.split(/[-_]/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
  return low_first_letter ? answer[0].toLowerCase() + answer.slice(1) : answer;
}

export function createResult(type, subject, start = new Date()) {
  return (status, payload?, end = new Date()) => ({
    type,
    subject,
    status,
    timing: end.getTime() - start.getTime(),
    ...(payload && {payload}),
  })
}

export function commandArgsToOpts(cmd) {
  let {args, _args: defs} = cmd;
  if (!defs || !defs.length || !args || !args.length) {
    return {};
  }
  if (defs.length > args.length) {
    defs = defs.slice(0, args.length);
  }
  return defs.reduce((answer, def, idx) => {
    answer[def.name] = args[idx];
    return answer;
  }, {});
}
