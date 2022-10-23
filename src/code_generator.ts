import fs from 'fs-extra';
import * as path from 'path';
import { AsyncSeriesWaterfallHook } from 'tapable';
import { Log } from 'codegem-tools';
import { Factory, Option, FileType, Use, Ctx, Plugin } from './type.js';

// machine 运行完成，生成代码以后的钩子
const generatedHook = new AsyncSeriesWaterfallHook(['name']);

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
    let factories: Factory[] = this.option.factory;
    if (this.ctx.name) {
      factories = this.option.factory.filter((it) => it.name === this.ctx.name);
    }
    if (factories.length === 0) return null;
    factories.forEach((factory: any, index) => {
      const factoryId = Symbol(index);
      this.factory.push({ ...factory, ...{ id: factoryId } });
      this.createStorage(factoryId, []);
    });

    this.option.plugin?.map((plugin) => {
      this.registerPlugin(plugin);
    });

    this.factory.forEach((factory) => {
      this.loading(factory.id, factory.use);
    });
  }

  // 注册插件
  registerPlugin(plugin: Plugin) {
    const { name } = plugin;
    if (plugin.generatedHook) {
      generatedHook.tapPromise(name, plugin.generatedHook);
    }
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

  // 加载器运行
  async loading(factoryId: symbol, loads: Use[]) {
    try {
      const source = await Promise.all(
        loads.map(async (it) => {
          return await it(this.ctx);
        }),
      );
      this.createStorage(factoryId, source);
      // NOTE: 加载数据
      this.log.info('load data...');
      this.run(factoryId);
    } catch (error) {}
  }

  run(factoryId: symbol) {
    const factory = this.getFactory(factoryId);
    const { machine } = factory;
    const source = this.storage[factoryId];
    this.log.debug('[meta data]', source);
    const files = machine(source, this.ctx);
    this.log.info('generate code...');
    // NOTE: 要触发对应的钩子
    generatedHook.promise(files).then((res: FileType[]) => {
      this.writeFile(res, factory.output || this.option.output);
    });
  }

  writeFile(files: FileType[], rootPath?: string) {
    files.forEach((file) => {
      if (file.pathname && file.code) {
        if (path.isAbsolute(file.pathname)) {
          this.log.debug(file.pathname, file.code);
          // NOTE: 判断路径有效
          fs.outputFileSync(file.pathname, file.code);
        } else {
          if (rootPath) {
            const filePath = path.resolve(rootPath, file.pathname);
            this.log.debug(filePath, file.code);
            // NOTE: 判断路径有效
            fs.outputFileSync(filePath, file.code);
          } else {
            this.log.warn('miss root path');
          }
        }
      }
    });
    this.log.success('success');
  }
}
