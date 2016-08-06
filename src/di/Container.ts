/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-require-imports no-any */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { IResolver } from 'atom-languageservices';
import * as symbols from 'atom-languageservices/symbols';
import { ServerCapabilities } from 'atom-languageservices/types-extended';
import { Container as AureliaContainer } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import { AggregateError } from 'aurelia-pal';
import { exists, readdir } from 'fs';
import { join } from 'path';
import { DisposableBase } from 'ts-disposables';

const interfaceRegex = /^I((?:[A-Z^I]))/;
const $readdir = Observable.bindNodeCallback(readdir);
const $exists = Observable.bindCallback(exists);

export interface ICapability {
    ctor: any;
    isCompatible: (serverCapabilities: ServerCapabilities) => boolean;
    params: any[];
}

export class Container extends DisposableBase implements IResolver {
    private _container: AureliaContainer;
    private _capabilities: ICapability[] = [];
    private _classNames = new Map<string, any>();
    private _interfaceSymbols = new Map<string, symbol>();

    public constructor(container?: AureliaContainer) {
        super();
        this._container = container || new AureliaContainer();

        this._disposable.add(() => {
            (<any>this._container)._resolvers.clear();
            (<any>this._container)._resolvers = null;
            (<any>this._container)._configuration = null;
            (<any>this._container).parent = null;
            (<any>this._container).root = null;
        });
    }

    private static _child(container: Container) {
        const childAureliaContainer = container._container.createChild();
        const childContainer = new Container(childAureliaContainer);
        childContainer._capabilities = container._capabilities;
        return childContainer;
    }

    public registerFolder(...paths: string[]) {
        const path = join(...paths);
        return $exists(path)
            .filter(x => x)
            .mergeMap(() => $readdir(path)
                .map(files => this._registerServices(path, files))
            )
            .toPromise();
    }

    public registerInstance(key: any, instance: any) {
        this._container.registerInstance(key, instance);
        return this;
    }

    public registerSingleton(fn: Function): this;
    public registerSingleton(key: any, fn: Function): this;
    public registerSingleton(key: any, fn?: Function) {
        this._container.registerSingleton(key, fn);
        return this;
    }

    public registerTransient(fn: Function): this;
    public registerTransient(key: any, fn: Function): this;
    public registerTransient(key: any, fn?: Function) {
        this._container.registerTransient(key, fn);
        return this;
    }

    public registerAlias(originalKey: any, aliasKey: any) {
        if (originalKey.name && this._interfaceSymbols.has(originalKey.name)) {
            if (this._interfaceSymbols.get(originalKey.name) !== aliasKey) {
                this._interfaceSymbols.delete(originalKey.name);
            }
        }
        this._container.registerAlias(originalKey, aliasKey);
        return this;
    }

    public autoRegister(fn: Function): this;
    public autoRegister(key: string | symbol | Object, fn: Function): this;
    public autoRegister(key: any, fn?: Function) {
        if (fn === undefined) {
            fn = key;
            key = fn;
        }

        const decoCapability = metadata.get(symbols.capability, fn!);
        if (decoCapability) {
            const isCompatible = <any>metadata.get(symbols.isCompatible, fn!) || (() => true);
            // Capabilities aren't registered now...
            this._capabilities.push({
                ctor: fn,
                isCompatible,
                params: <any[]>(<any>fn).inject || <any>metadata.get(metadata.paramTypes, fn!)
            });
            return this;
        }

        const aliasKey = metadata.get(symbols.alias, fn!);
        const decoKey = metadata.get(symbols.key, fn!);
        if (decoKey) {
            this._container.autoRegister(decoKey, fn);
            if (aliasKey) {
                this.registerAlias(decoKey, aliasKey);
            }

            return this;
        }

        this._container.autoRegister(key, fn);
        if (aliasKey) {
            this.registerAlias(key, aliasKey);
        }
        return this;
    }

    public autoRegisterAll(fns: any[], key?: any) {
        if (key) {
            _.each(fns, fn => this.autoRegister(fn, key));
        } else {
            _.each(fns, fn => this.autoRegister(fn));
        }
        return this;
    }

    public resolve<T>(key: { new (...args: any[]): T; }): T;
    public resolve<T>(key: any): T;
    public resolve<T>(key: { new (...args: any[]): T; }): T {
        return this._container.get(key);
    }

    public resolveAll<T>(key: any): T[] {
        return this._container.getAll(key);
    }

    public resolveEach(items: any[]): any[] {
        return _.map(items, item => {
            try {
                return this.resolve(item);
            } catch (e) {
                return AggregateError(`Could not resolve ${item.name ? item.name : item}`, e);
            }
        });
    }

    public createChild() {
        return Container._child(this);
    }

    public registerCapabilities(key: any): { ctor: Function; isCompatible: (serverCapabilities: ServerCapabilities) => boolean; }[] {
        const capabilities = _(this._capabilities)
            .filter(x => _.includes(x.params, key))
            .value();

        _.each(capabilities, capability => {
            this.registerTransient(capability.ctor);
        });

        return capabilities;
    }

    public registerInterfaceSymbols() {
        this._classNames.forEach((value, key) => {
            if (this._interfaceSymbols.has(key)) {
                this.registerAlias(value, this._interfaceSymbols.get(key));
            }
        });
    }

    private _registerServices(fromPath: string, files: string[]) {
        const services = _.chain(files)
            .filter(file => _.endsWith(file, '.js'))
            .filter(file => !_.startsWith(file, '_'))
            .map(file => `${fromPath}/${file}`)
            .map(path => require(path))
            .flatMap(obj => _.map(obj, (value: any, key: string) => ({ key, value })))
            .commit();

        const [specialKeys, normalKeys] = services
            .filter(x => !x.key.match(interfaceRegex))
            .map(x => x.value)
            .each(fn => {
                if (fn.name) {
                    this._classNames.set(fn.name, fn);
                }
            })
            .partition(fn => !!metadata.get(symbols.key, fn))
            .value();

        for (const x of services.filter(x => !!x.key.match(interfaceRegex)).value()) {
            this._interfaceSymbols.set(x.key.replace(interfaceRegex, '$1'), x.value);
        }

        _.each(specialKeys, fn => {
            this.autoRegister(metadata.get(symbols.key, fn), fn);
        });

        _.each(normalKeys, fn => this.autoRegister(fn));
        return this;
    }
}
