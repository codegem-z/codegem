#!/usr/bin/env node
import * as path from 'path';
import fs from 'fs-extra';
import swc from '@swc/core';
import yargs from 'yargs-parser';

const args = yargs(process.argv.slice(2));

import CodeGenerator from './code_generator.js';

async function readConfig() {
  const workPath = process.cwd();
  const configTsPath = path.resolve(workPath, './codegemrc.ts');
  const output = swc.transformFileSync(configTsPath, {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      target: 'es2021',
      keepClassNames: true,
      loose: true,
    },
    module: {
      type: 'es6',
      strict: false,
      strictMode: true,
      lazy: false,
      noInterop: false,
    },
    sourceMaps: false,
  });
  try {
    const configJsPath = path.resolve(
      workPath,
      './node_modules/codegem_cache/codegemrc.mjs',
    );
    fs.outputFileSync(configJsPath, output.code);
    const { default: config } = await import(configJsPath);
    fs.remove(path.dirname(configJsPath));
    return config;
  } catch (error) {
    console.error(error);
    process.exit();
  }
}

async function run() {
  const options = await readConfig();

  const debug = 'debug' in args ? true : false;

  const name = 'name' in args ? args.name : null;

  const ctx = { debug, name };

  const codeGenerator = new CodeGenerator(options, ctx);

  codeGenerator.init();
}

// --help or --h
if ('help' in args || 'h' in args) {
  console.log('\n  Tip:\n');
  console.log('代码生成器框架');
} else {
  run();
}
