#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import { join } from 'path';
import { Command } from 'commander';
import Chalk from 'chalk';

// Create a new Command instance
const program = new Command();

// Configure the program
program
  .name('simple-banana-ts')
  .option('-d, --debug', Chalk.blue('Enables debugging logs'), false)
  .option('-m, --module', Chalk.blue('Configure TypeScript to build using ESM instead of CommonJS'), false)
  .argument('[project-name]', Chalk.yellow('The name of the project you are creating'), 'my-project');

// Parse the command-line arguments
program.parse();

// Extract the options and arguments from the parsed arguments
const options = program.opts();
const args = program.args;

// Check if debug mode is enabled
const debugMode = options.debug as boolean;
if (debugMode) console.log('Debugging enabled...');


// Create project directory
const projectName = args.length > 0 ? args.join(' ') : 'my-project';

// Check if directory already exists
if (fs.existsSync(projectName)) {
  console.error(`Directory ${projectName} already exists. Aborting.`);
  process.exit(1);
}

// Create project directory
if (debugMode) console.log(`Creating directory ${projectName}...`);
fs.mkdirSync(projectName);

// Change to project directory
process.chdir(projectName);

// Initialize new Node.js project
if (debugMode) console.log('Initializing new Node.js project...');
execSync('npm init -y');

// Install TypeScript as a development dependency
if (debugMode) console.log('Installing TypeScript as a development dependency...');
execSync('npm install --save-dev typescript');

// Create tsconfig.json file
if (debugMode) console.log('Creating tsconfig.json file...');
const tsconfig = {
  compilerOptions: {
    outDir: './build',
    allowJs: true,
    target: 'ES2022',
    moduleResolution: options.module ? 'node16' : 'node',
    module: 'ES2022',
  },
  include: ['./src/**/*'],
};
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 4));

// Create src directory
if (debugMode) console.log('Creating src directory...');
fs.mkdirSync('src');

// Create index.ts file
if (debugMode) console.log('Creating index.ts file...');
const index = `console.log('Hello World!');`;
fs.writeFileSync('src/index.ts', index);

// Update package.json with "start" script
if (debugMode) console.log('Updating package.json file...');
const pkg = JSON.parse(fs.readFileSync('package.json').toString());

pkg.scripts = {
  start: 'node build/index.js',
};
pkg.type = options.module ? 'module' : 'commonjs';
pkg.name = projectName;

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

// Build index.ts
if (debugMode) console.log('Building index.ts...');
execSync(join('node_modules', '.bin', 'tsc.cmd'));

console.log('Project created successfully!');
process.exitCode = 0;
