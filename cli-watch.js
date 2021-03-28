#!/usr/bin/env node
const { execSync } = require('child_process');
const { join } = require('path');

execSync(
  `npx onchange -i -v '**/*.stories.*' -- ${join(__dirname, './cli.js')}`,
  {
    stdio: 'inherit',
  },
);
