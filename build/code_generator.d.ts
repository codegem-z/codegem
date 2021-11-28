import { Factory, Option, FileType, Use } from "./type.js";
interface EnhanceFactory extends Factory {
    id: symbol;
}
export default class CodeGenerator {
    option: Option;
    storage: {
        [k: symbol]: any[];
    };
    factory: EnhanceFactory[];
    constructor(option: Option);
    init(): void;
    createStorage(factoryId: symbol, source: any): void;
    getFactory(factoryId: symbol): EnhanceFactory;
    loading(factoryId: symbol, loads: Use[]): Promise<void>;
    run(factoryId: symbol): void;
    writeFile(files: FileType[], rootPath?: string): void;
}
export {};
