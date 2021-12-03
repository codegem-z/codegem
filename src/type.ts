export type FileType = { pathname: string; code: string };

export type Machine = (source: any[], ctx: Ctx) => FileType[];

export interface Plugin {
  name: string;
  generatedHook?: (ctx: any) => Promise<any>;
}

export type Use = (ctx: Ctx) => Promise<any>;

export interface Factory {
  use: Use[];
  machine: Machine;
  output?: string;
}

export interface Option {
  factory: Factory[];
  output?: string;
  plugin?: Plugin[];
}

export interface Ctx {
  debug: boolean;
}
