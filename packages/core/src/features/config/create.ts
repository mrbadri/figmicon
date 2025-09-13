import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import type { ConfigOptions } from '@/features/config/types';
import configTemplate from '@/features/config/config.template.hbs';
// import prettier from 'prettier';

// Register helpers (can be done once at module load)
Handlebars.registerHelper('json', (value) => JSON.stringify(value));
Handlebars.registerHelper('default', function (value, defaultValue) {
  return value !== undefined ? value : defaultValue;
});

export const createConfigFile = async (cwd: string, values?: Partial<ConfigOptions>) => {
  const template = Handlebars.compile<Partial<ConfigOptions> | undefined>(configTemplate);
  const rawOutput = template(values || {});
  // TODO: Add prettier
  // const formatted = await prettier.format(rawOutput, { parser: 'babel-ts' });
  const dest = path.join(cwd, 'icon.config.ts');

  fs.writeFileSync(dest, rawOutput, 'utf8');
  return dest;
};
