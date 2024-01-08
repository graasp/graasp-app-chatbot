export const getInitials = (name: string): string =>
  name
    .split(/[^a-z]/i)
    .map((c) => Array.from(c).filter((l) => l.match(/[a-z]/i))[0])
    .join('');
