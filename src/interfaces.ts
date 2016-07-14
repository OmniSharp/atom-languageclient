/**
 * A generic interface for resolving instaneces from the DI container
 */
export interface IResolver {
    resolve<T>(key: T): T;
    resolve<T>(key: any): T;
    resolveAll<T>(key: any): T[];
    registerFolder(...paths: string[]): Promise<this>;
    registerInstance(key: any, instance: any): this;
    registerSingleton(key: any, fn: Function): this;
    registerTransient(key: any, fn: Function): this;
    registerAlias(originalKey: any, aliasKey: any): this;
    autoRegister(fn: Function): this;
    autoRegister(key: string | symbol | Object, fn: Function): this;
}

/**
 * Defines the interface for consuming this service
 * http://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/
 */
export interface ILanguageService {
    resolver: IResolver;
}


/**
 * Defines the interface for providing a language to be consumed
 * http://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/
 */
export interface ILanguageProvider {
    onDidDispose(cb: () => void): { dispose(): void; };
    dispose(): void;
}
