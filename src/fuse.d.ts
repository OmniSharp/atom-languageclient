declare module fuse {
    export interface Match {
        key: string;
        indices: [number, number][];
    }
    export interface Result<T> {
        item: T;
        score?: number;
        matches?: Match[];
    }
}

declare module 'fuse.js' {
    declare class Fuse<T> {
        constructor(list: T[]): Fuse<T>;
        constructor(list: T[], options: IFuseOptions);
        search(pattern: string): fuse.Result<T>[];
        search<T>(pattern: string): T[];
        set(list: T[]);
    }

    interface IFuseOptions extends ISearchOptions {
        caseSensitive?: boolean;
        id?: string;
        shouldSort?: boolean;
        include?: ('score' | 'matches')[];
        sortFn?: (a: { score: number }, b: { score: number }) => number;
        getFn?: (obj: any, path: string) => any;
        keys?: string[] | { name: string; weight: number }[];
        verbose?: boolean;
    }

    interface ISearchOptions {
        tokenize?: boolean;
        location?: number;
        distance?: number;
        threshold?: number;
        maxPatternLength?: number;
    }
    export = Fuse;
}
