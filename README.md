# Codegem

<p align="center">
<img width="100" src="https://assets-phi.vercel.app/-/codegem/codegem-logo.png"/>
</P>

<p align="center">
 <img src="https://img.shields.io/badge/coverage-80%25-brightgreen">
 <img src="https://img.shields.io/badge/min%20size-1%20kb-blue">
 <img src="https://img.shields.io/npm/dt/codegem.svg?colorB=ff69b4">
 </p>

## Codegem 是什么？

现代前端开发中已有的代码生成器都是独立开发和使用的，因此代码生成器中的「读取元数据」和「生成代码文件」两部分程序逻辑没有抽象出来，当开发新的代码生成器时就无法复用，从而无法专注于元数据处理和代码生成逻辑。Codegem 就是解决这类问题的工具，帮助开发者快速开发新的代码生成器。

## 安装

```bash
pnpm add codegem codegem-load-file codegem-machine-icon
```

## 配置文件

在项目根目录下新建 `codegemrc.ts` 文件，具体配置代码如下：

```ts
import { defineConfig } from 'codegem';
import loadFile from 'codegem-load-file';
import createIcon from 'codegem-machine-icon';

export default defineConfig({
  output: 'example/generated', // 根目录;所有生成文件统一生成在这个目录下
  factory: [
    {
      use: [loadFile('./example/icon/source')],
      machine: createIcon('./example/generated/icon'),
    },
  ],
});
```

## 运行

```bash
npx codegem
```

## 单独运行 factory

```bash
npx codegem --name=example
```

配置中声明 factory name

```ts
export default defineConfig({
  output: 'example/generated', // 根目录;所有生成文件统一生成在这个目录下
  factory: [
    {
      name:'example'
      use: [loadFile('./example/icon/source')],
      machine: createIcon('./example/generated/icon'),
    },
  ],
});
```

命令中不添加 name 参数，默认运行全部 factory

## 详情

更详细的介绍请查看博客文章 [《略窥门径：Codegem 的简介》](https://one-word-phi.vercel.app/post/introduce_of_codegem)
