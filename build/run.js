var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as path from "path";
import fs from 'fs-extra';
import swc from '@swc/core';
import CodeGenerator from "./code_generator.js";
function readConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const workPath = process.cwd();
        const configTsPath = path.resolve(workPath, "./codegemrc.ts");
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
        });
        const configJsPath = path.resolve(workPath, "./build/codegemrc.js");
        fs.writeFileSync(configJsPath, output.code);
        const { default: config } = yield import(configJsPath);
        return config;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = yield readConfig();
        console.log("debug", options);
        const codeGenerator = new CodeGenerator(options);
        codeGenerator.init();
    });
}
run();
//# sourceMappingURL=run.js.map