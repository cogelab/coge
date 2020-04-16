export function CliOptionsRepeat(value, previous) {
  return (previous || []).concat([value]);
}
