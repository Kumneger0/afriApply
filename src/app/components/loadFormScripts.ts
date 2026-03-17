import { readFileSync } from 'fs';
import { join } from 'path';

export function loadFormScripts(): string {
  return readFileSync(join(import.meta.dir, 'form-scripts.js'), 'utf-8');
}