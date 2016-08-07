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

declare interface ProxyHandler<T> {
    getPrototypeOf?(target: T): any;
    setPrototypeOf?(target: T, v: any): boolean;
    isExtensible?(target: T): boolean;
    preventExtensions?(target: T): boolean;
    getOwnPropertyDescriptor?(target: T, p: PropertyKey): PropertyDescriptor;
    has?(target: T, p: PropertyKey): boolean;
    get?(target: T, p: PropertyKey, receiver: any): any;
    set?(target: T, p: PropertyKey, value: any, receiver: any): boolean;
    defineProperty?(target: T, p: PropertyKey, attributes: PropertyDescriptor): boolean;
    enumerate?(target: T): PropertyKey[];
    ownKeys?(target: T): PropertyKey[];
    apply?(target: T, thisArg: any, argArray?: any): any;
    construct?(target: T, thisArg: any, argArray?: any): any;
}

declare class Proxy {
    constructor(target: T, handler: ProxyHandler<T>);
    public static revocable<T>(target: T, handler: ProxyHandler<T>): { proxy: T; revoke: () => void; };
}
