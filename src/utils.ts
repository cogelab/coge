export function undasherize(str: string, low_first_letter?: boolean) {
  let answer = str.split(/[-_]/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
  return low_first_letter ? answer[0].toLowerCase() + answer.slice(1) : answer;
}

/**
 * Sets a value of a property in an object tree.
 * Missing objects will (optionally) be created.
 *
 *     var deepSet = require('deep-set')
 *     var obj = { one: { two: { three: 'sad' } } }
 *     deepSet(obj, 'one.two.three', 'yay')
 *     // { one: { two: { three: 'yay' } } }
 *
 *
 * @param  {object} obj          The object.
 * @param  {string} path         The property path, separated by dots.
 * @param  {*}      value        The value to set.
 * @param  {boolean} create      Whether to create missing objects along the way.
 * @return {object}              The manipulated object.
 */
export function set(obj: object, path: string, value: any, create?: boolean) {
  const properties = path.split('.')
  let currentObject = obj
  let property

  create = create === undefined ? true : create

  while (properties.length) {
    property = properties.shift()

    if (!currentObject) break;

    if (!isObject(currentObject[property]) && create) {
      currentObject[property] = {}
    }

    if (!properties.length) {
      currentObject[property] = value
    }
    currentObject = currentObject[property]
  }

  return obj
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

export function assign(target, ...sources) {
  for (const source of sources) {
    if (!sources) continue;
    for (const key of Object.keys(source)) {
      const val = source[key];
      if (val !== undefined) {
        target[key] = val;
      }
    }
  }
  return target;
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

export function shell(command, options) {
  return require('execa')(command, {shell: true, ...options});
}
