// http://flight-manual.atom.io/behind-atom/sections/serialization-in-atom/
interface IAtomPackage<TSettings> {
    serialize(): any;
    activate(state: TSettings): void;
    deactivate(): void;
}

declare type Thenable<T> = Promise<T>;
declare module 'file-url' {
    var method: (str: string) => string;
    export = method;
}
