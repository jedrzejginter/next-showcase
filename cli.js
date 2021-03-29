#!/usr/bin/env node
const { mkdirSync, writeFileSync } = require('fs');
const globby = require('globby');
const { dirname } = require('path');

const allStoriesPaths = globby.sync(['src/**/*.stories.(j|t)sx']);

const modules = allStoriesPaths.map((storiesPath) => {
  // Get module name.
  // Example: src/components/Button/Button.stories.ts -> components/Button
  const modName = dirname(storiesPath).replace(/^src\//, '');

  // Replace slashed with double underscore.
  // Example: components/Button -> components__Button.
  const importName = modName.replace(/\//g, '__');

  return {
    // This will be used for calculating name and group displayed in
    // showcase sidebar/nav.
    name: importName,
    // Prepare import path for 'import' (just cut the extension,
    // so TypeScript won't complain).
    source: `${storiesPath.replace(/\.[jt]sx?$/, '')}`,
  };
});

// Switch import source for local testing.
const importPath = process.env.NO_NPM
  ? '../../src'
  : '@ginterdev/next-showcase';

const file = `
// This file is autogenerated. It should neither be modified manually nor
// committed to any version control system.

/* eslint-disable */
import Showcase from '${importPath}';

const moduleLoaders = {
${modules
  .map((mod) => `  '${mod.name}': () => import('../../${mod.source}'),`)
  .join('\n')}
};

export default function ShowcasePage() {
  return <Showcase moduleLoaders={moduleLoaders} renderId={${Date.now()}} />;
}
/* eslint-enable */
`;

// written in process.cwd() context
const targetFile = 'pages/_next-showcase/index.tsx';

mkdirSync(dirname(targetFile), { recursive: true });
writeFileSync(targetFile, file.trim(), 'utf-8');
