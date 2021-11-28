export type FileType = { pathname: string; code: string };

export type Machine = (source: any[]) => FileType[];

export type Use = () => Promise<any>;

export interface Factory {
  use: Use[];
  machine: Machine;
  output?: string;
}

export interface Option {
  output?: string;
  factory: Factory[];
}
