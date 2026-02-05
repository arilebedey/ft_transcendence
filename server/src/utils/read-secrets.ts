import { readFileSync } from 'fs';
import { join } from 'path';

export function readSecret(filename: string): string {
  const secretPath = join(process.cwd(), 'secrets', filename);
  return readFileSync(secretPath, 'utf-8').trim();
}
