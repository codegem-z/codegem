var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs-extra";
import * as path from "path";
export default class CodeGenerator {
    constructor(option) {
        this.storage = {};
        this.factory = [];
        this.option = option;
    }
    init() {
        this.option.factory.forEach((factory, index) => {
            const factoryId = Symbol(index);
            this.factory.push(Object.assign(Object.assign({}, factory), { id: factoryId }));
            this.createStorage(factoryId, []);
        });
        this.factory.forEach((factory) => {
            this.loading(factory.id, factory.use);
        });
    }
    // 开辟存储区域
    createStorage(factoryId, source) {
        this.storage[factoryId] = source;
    }
    // 根据 factoryID 获取 factory option
    getFactory(factoryId) {
        const [factory] = this.factory.filter((it) => it.id === factoryId);
        return factory;
    }
    loading(factoryId, loads) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const source = yield Promise.all(loads.map((it) => __awaiter(this, void 0, void 0, function* () {
                    return yield it();
                })));
                this.createStorage(factoryId, source);
                // TODO: 开始运行
                this.run(factoryId);
            }
            catch (error) { }
        });
    }
    run(factoryId) {
        const factory = this.getFactory(factoryId);
        const { machine } = factory;
        const source = this.storage[factoryId];
        console.log("--原始数据", source);
        const files = machine(source);
        this.writeFile(files, factory.output || this.option.output);
    }
    writeFile(files, rootPath) {
        files.forEach((file) => {
            if (file.pathname && file.code) {
                if (path.isAbsolute(file.pathname)) {
                    // TODO: 判断路径有效
                    fs.outputFileSync(file.pathname, file.code);
                }
                else {
                    if (rootPath) {
                        const filePath = path.resolve(rootPath, file.pathname);
                        console.log("debug", filePath, file.code);
                        // TODO: 判断路径有效
                        fs.outputFileSync(filePath, file.code);
                    }
                    else {
                        console.warn("缺少根目录");
                    }
                }
            }
        });
    }
}
//# sourceMappingURL=code_generator.js.map