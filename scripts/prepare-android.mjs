import { cp, mkdir, rm, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const webDir = path.join(root, 'www');

await rm(webDir, { recursive: true, force: true });
await mkdir(webDir, { recursive: true });

async function copyRequired(source, destination = source) {
  const from = path.join(root, source);
  const to = path.join(webDir, destination);
  await access(from, constants.R_OK);
  await cp(from, to, { recursive: true });
}

async function copyOptional(source) {
  try {
    await access(path.join(root, source), constants.R_OK);
    await copyRequired(source);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    console.log(`Optional asset folder/file not found: ${source}`);
  }
}

for (const file of ['index.html', 'css', 'js', 'manifest.json', 'icon.png']) {
  await copyRequired(file);
}

// Japanese card scans are bundled locally when present in the repository.
await copyOptional('images');

console.log('Android web bundle prepared in ./www');
