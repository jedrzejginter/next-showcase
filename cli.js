#!/usr/bin/env node
const { mkdirSync, writeFileSync } = require('fs');
const globby = require('globby');
const { dirname } = require('path');

const allStoriesPaths = globby.sync(['src/**/*.stories.(j|t)sx']);

function getGroupNameFromPath(storiesPath) {
  if (/\/atoms\//i.test(storiesPath)) {
    return 'Components (Atoms)';
  }

  if (/\/molecules\//i.test(storiesPath)) {
    return 'Components (Molecules)';
  }

  if (/\/organisms\//i.test(storiesPath)) {
    return 'Components (Organisms)';
  }

  if (/\/templates\//i.test(storiesPath)) {
    return 'Components (Templates)';
  }

  if (/\/pages\//i.test(storiesPath)) {
    return 'Pages';
  }

  if (/\/views\//i.test(storiesPath)) {
    return 'Views';
  }

  if (/\/components\//i.test(storiesPath)) {
    return 'Components';
  }

  if (/\/icons\//i.test(storiesPath)) {
    return 'Icons';
  }

  if (/\/assets\//i.test(storiesPath)) {
    return 'Assets';
  }

  return 'Other';
}

const modules = allStoriesPaths.map((storiesPath) => {
  // slice the 'src/' part
  // src/components/Button/Button.stories.ts
  //    -> components/Button/Button.stories.ts
  const pathNoSource = storiesPath.replace(/^src\//, '');
  const lastChunk = pathNoSource.split('/').pop();
  const modName = lastChunk.replace(/\.stories\.[jt]sx/, '');

  // Try to obtain group based on path, very opinionated.
  const group = getGroupNameFromPath(storiesPath);

  // Replace slashed with double underscore.
  // Example: components/Button -> components__Button.
  const importName = modName.replace(/\//g, '__');

  return {
    // Modules group.
    group,
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
// THIS FILE IS AUTOGENERATED.
// IT SHOULD NEITHER BE MODIFIED MANUALLY NOR COMMITTED TO ANY VERSION
// CONTROL SYSTEM.

/* prettier-ignore-start */
/* eslint-disable */
import Showcase from '${importPath}';

export default function ShowcasePage() {
  const storiesModules = {
  ${modules
    .map(
      (mod) => `  '${mod.source}': {
      name: '${mod.name}',
      group: '${mod.group}',
      source: '${mod.source}',
      loader: () => import('../../${mod.source}'),
    },`,
    )
    .join('\n')}
  };

  return (
    <Showcase
      renderId={${Date.now()}}
      storiesModules={storiesModules}
    />
  );
}

ShowcasePage.IS_SHOWCASE_PAGE = true;
/* eslint-enable */
/* prettier-ignore-end */
`;

// written in process.cwd() context
const targetFile = 'pages/_next-showcase/index.tsx';

mkdirSync(dirname(targetFile), { recursive: true });
writeFileSync(targetFile, file.trim(), 'utf-8');
