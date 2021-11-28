#!/usr/bin/env node
import * as path from "path";
import fs from 'fs-extra'
import swc from '@swc/core';
import CodeGenerator from "./code_generator.js";

async function readConfig() {
  const workPath = process.cwd();
  const configTsPath =path.resolve(workPath, "./codegemrc.ts")
  const output = swc.transformFileSync(configTsPath, {
    "jsc": {
      "parser": {
        "syntax": "typescript",
        "tsx": true,
      },
      "target": "es2021",
      "keepClassNames": true,
      "loose": true
    },
    "module": {
      "type": "es6",
      "strict": false,
      "strictMode": true,
      "lazy": false,
      "noInterop": false
    },
    "sourceMaps": false
  })
  const configJsPath = path.resolve(workPath, "./build/codegemrc.js")
  fs.writeFileSync(configJsPath, output.code)
  const { default: config } = await import(configJsPath);
  return config;
}

async function run() {
  const options = await readConfig();
  console.log("debug", options);

  const codeGenerator = new CodeGenerator(options);

  codeGenerator.init();
}

run();
