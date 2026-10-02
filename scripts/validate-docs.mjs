import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
function visit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'build'].includes(entry.name)) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (entry.name.endsWith('.md')) {
      const text = readFileSync(path, 'utf8');
      for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const target = match[1].split('#')[0];
        if (target && !/^[a-z]+:/i.test(target) && !existsSync(resolve(dirname(path), target))) throw new Error(`Broken local link in ${path}: ${target}`);
      }
    }
  }
}
visit('.');
console.log('Local documentation links passed.');
