#!/usr/bin/env node
const { execSync } = require('child_process');
const { join } = require('path');

const argv = process.argv.slice(2);
const cliExecutable = join(__dirname, './cli.js');

if (argv.includes('--once')) {
  execSync(cliExecutable, {
    stdio: 'inherit',
  });

  return;
}

const onchangeArgv = argv.includes('--quiet') ? '-i' : '-i -v';
const onchangeExecutable = argv.includes('--no-npx')
  ? 'onchange'
  : 'npx onchange';

execSync(
  `${onchangeExecutable} ${onchangeArgv} '**/*.stories.*' -- ${cliExecutable}`,
  {
    stdio: 'inherit',
  },
);
