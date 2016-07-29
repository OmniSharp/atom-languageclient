/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:variable-name no-any */

/**
 * A generic interface for resolving instances from the DI container
 */
export const IResolver = Symbol.for('IResolver');
/**
 * A generic interface for resolving instaneces from the DI container
 */
export interface IResolver {
    resolve<T>(key: { new (...args: any[]): T; }): T;
    resolve<T>(key: any): T;
    resolveAll<T>(key: any): T[];
    registerFolder(...paths: string[]): Promise<this>;
    registerInstance(key: any, instance: any): this;
    registerSingleton(fn: Function): this;
    registerSingleton(key: any, fn: Function): this;
    registerTransient(fn: Function): this;
    registerTransient(key: any, fn: Function): this;
    registerAlias(originalKey: any, aliasKey: any): this;
    autoRegister(fn: Function): this;
    autoRegister(key: string | symbol | Object, fn: Function): this;
}
