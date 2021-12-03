// import { defineConfig } from "./src/mod";

function loadFile(url: string) {
  return async () => {
    return url;
  };
}

function pluginTest() {
  return {
    name: 'test',
    generatedHook: async (files) => {
      console.log('[generatedHook]:test');
      files[0].code = 'generatedHook-test';
      return files;
    },
  };
}

function createIcon(
  type: 'ts' | 'js',
): (source: any[]) => { pathname: string; code: string }[] {
  return (source: any[]) => [{ pathname: `hello.${type}`, code: source[0] }];
}

export default {
  output: 'example/generated', // 根目录;所有生成文件统一生成在这个目录下
  factory: [
    {
      use: [loadFile('http://www.test.json')],
      machine: createIcon('js'),
      output: 'example/generated/hello', // 优先级 > root output
    },
  ],
  plugin: [pluginTest()],
};
