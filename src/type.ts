export type FileType = { pathname: string; code: string };

export type Machine = (source: any[], ctx: Ctx) => FileType[];

export type Use = (ctx: Ctx) => Promise<any>;

export interface Factory {
  use: Use[];
  machine: Machine;
  output?: string;
}

export interface Option {
  output?: string;
  factory: Factory[];
}

export interface Ctx {
  debug: boolean;
}
