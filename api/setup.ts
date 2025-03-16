import * as fs from 'fs/promises';

// generates an absolute path, relative to the current file.
const absolute = (specifier) => new URL(import.meta.resolve(specifier)).pathname

await fs.cp(
  absolute('./local_templates/node23/'),
  absolute('./template/node23/'),
  {recursive: true}
)
