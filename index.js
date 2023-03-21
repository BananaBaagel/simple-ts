import { execSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);

// Check if debug mode is enabled
const debugMode = args.includes('--debug');

// Create project directory
const path = args.length > 0 ? args.join(" ").replace('--debug', '') : "my-project";

// Check if directory already exists
if (fs.existsSync(path)) {
  console.error(`Directory ${path} already exists. Aborting.`);
  process.exit(1);
}

// Create directory
if (debugMode) console.log(`Creating directory ${path}...`);
fs.mkdirSync(path);

// Change to project directory
process.chdir(path);

// Initialize new Node.js project
if (debugMode) console.log('Initializing new Node.js project...');
execSync("npm init -y");

// Install TypeScript as a development dependency
if (debugMode) console.log('Installing TypeScript as a development dependency...');
execSync("npm install --save-dev typescript");

// Create tsconfig.json file
if (debugMode) console.log('Creating tsconfig.json file...');
const tsconfig = {
  compilerOptions: {
    outDir: "./build",
    allowJs: true,
    target: "ES2021",
    moduleResolution: "node",
    module: "Node16"
  },
  include: [
    "./src/**/*"
  ]
};
fs.writeFileSync("tsconfig.json", JSON.stringify(tsconfig, null, 4));

// Create src directory
if (debugMode) console.log('Creating src directory...');
fs.mkdirSync("src");

// Create index.ts file
if (debugMode) console.log('Creating index.ts file...');
const index = `console.log('Hello World!');`;
fs.writeFileSync("src/index.ts", index);

// Update package.json with "start" script
if (debugMode) console.log('Updating package.json file...');
const pkg = JSON.parse(fs.readFileSync('package.json'));

pkg.scripts = {
    "start": 'node build/index.js'
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log("Project created successfully!");
process.exitCode = 0;
