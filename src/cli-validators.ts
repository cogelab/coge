export function Repest(value, previous) {
  return (previous || []).concat([value]);
}
