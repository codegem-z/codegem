export declare type FileType = {
    pathname: string;
    code: string;
};
export declare type Machine = (source: any[]) => FileType[];
export declare type Use = () => Promise<any>;
export interface Factory {
    use: Use[];
    machine: Machine;
    output?: string;
}
export interface Option {
    output?: string;
    factory: Factory[];
}
