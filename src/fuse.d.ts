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

    export interface WeightedKey {
        name: string;
        weight: number;
    }
}

declare module 'fuse.js' {
    interface Fuse<T> {
        new (list: T[]): Fuse<T>;
        new (list: T[], options: IFuseOptions);
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
        keys?: string[] | fuse.WeightedKey[];
        verbose?: boolean;
    }

    interface ISearchOptions {
        tokenize?: boolean;
        tokenSeparator?: RegExp;
        location?: number;
        distance?: number;
        threshold?: number;
        maxPatternLength?: number;
    }

    declare const Fuse: IFuse;
    export = Fuse;
}
