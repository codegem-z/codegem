import fs from 'fs-extra';
import * as path from 'path';
import { Factory, Option, FileType, Use, Ctx } from './type.js';
import { Log } from 'codegem-tools';
interface EnhanceFactory extends Factory {
  id: symbol;
}

export default class CodeGenerator {
  option: Option;
  ctx: Ctx;
  log: Log;
  storage: { [k: symbol]: any[] } = {};
  factory: EnhanceFactory[] = [];
  constructor(option: Option, ctx: Ctx) {
    this.option = option;
    this.ctx = ctx;
    this.log = new Log(ctx);
  }

  init() {
    this.log.info('init');
    this.option.factory.forEach((factory: any, index) => {
      const factoryId = Symbol(index);
      this.factory.push({ ...factory, ...{ id: factoryId } });
      this.createStorage(factoryId, []);
    });
    this.factory.forEach((factory) => {
      this.loading(factory.id, factory.use);
    });
  }

  // 开辟存储区域
  createStorage(factoryId: symbol, source: any) {
    this.storage[factoryId] = source;
  }

  // 根据 factoryID 获取 factory option
  getFactory(factoryId: symbol) {
    const [factory] = this.factory.filter((it) => it.id === factoryId);
    return factory;
  }

  async loading(factoryId: symbol, loads: Use[]) {
    try {
      const source = await Promise.all(
        loads.map(async (it) => {
          return await it(this.ctx);
        }),
      );
      this.createStorage(factoryId, source);
      // TODO: 开始运行
      this.run(factoryId);
    } catch (error) {}
  }

  run(factoryId: symbol) {
    const factory = this.getFactory(factoryId);
    const { machine } = factory;
    const source = this.storage[factoryId];
    this.log.debug('原始数据', source);
    const files = machine(source, this.ctx);
    this.writeFile(files, factory.output || this.option.output);
  }

  writeFile(files: FileType[], rootPath?: string) {
    files.forEach((file) => {
      if (file.pathname && file.code) {
        if (path.isAbsolute(file.pathname)) {
          // TODO: 判断路径有效
          fs.outputFileSync(file.pathname, file.code);
        } else {
          if (rootPath) {
            const filePath = path.resolve(rootPath, file.pathname);
            this.log.debug(filePath, file.code);
            // TODO: 判断路径有效
            fs.outputFileSync(filePath, file.code);
          } else {
            console.warn('缺少根目录');
          }
        }
      }
    });
  }
}
