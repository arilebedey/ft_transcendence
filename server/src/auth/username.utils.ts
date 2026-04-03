export function normalizeUsername(name: string): string {
  let username = name.toLowerCase().replace(/[^a-z0-9_]/g, '');

  if (username[0] === '_') username = username.slice(1);

  if (!username) username = 'user';

  return username.slice(0, 12);
}

export function fallbackUsername(base: string, id: string | number): string {
  const trimmed = base.slice(0, 12 - 7);
  return `${trimmed}_${id.toString().slice(0, 6)}`;
}
