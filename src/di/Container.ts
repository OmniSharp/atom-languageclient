/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-require-imports no-any */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Container as AureliaContainer } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import { exists, readdir } from 'fs';
import { join } from 'path';
import { CompositeDisposable, DisposableBase, IDisposable } from 'ts-disposables';
import { IResolver } from '../interfaces';
import * as symbols from './symbols';

const $readdir = Observable.bindNodeCallback(readdir);
const $exists = Observable.bindCallback(exists);

export interface ICapability {
    item: any;
    params: any[];
}

export class Container extends DisposableBase implements IResolver {
    private _container: AureliaContainer;
    private _capabilities: ICapability[] = [];

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
        this._container.registerAlias(originalKey, key);
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
            // Capabilities aren't registered now...
            this._capabilities.push({
                item: fn,
                params: <any[]>(<any>fn).inject || <any>metadata.get(metadata.paramTypes, fn!)
            });
            return this;
        }

        const decoKey = metadata.get(symbols.key, fn!);
        if (decoKey) {
            this._container.autoRegister(decoKey, fn);
            return this;
        }

        this._container.autoRegister(key, fn);
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

    public resolve<T>(key: { new (...args: any[]): T; }): T {
        return this._container.get(key);
    }

    public resolveAll<T>(key: any): T[] {
        return this._container.getAll(key);
    }

    public resolveEach(items: any[]): any[] {
        return _.map(items, item => {
            return this.resolve(item);
        });
    }

    public createChild() {
        return Container._child(this);
    }

    public registerCapabilities(key: any): any[] {
        const capabilities = _(this._capabilities)
            .filter(x => _.includes(x.params, key))
            .map(x => x.item)
            .value();

        _.each(capabilities, capability => {
            this.registerTransient(capability);
        });

        return capabilities;
    }

    private _registerServices(fromPath: string, files: string[]) {
        const [specialKeys, normalKeys] = _(files)
            .filter(file => _.endsWith(file, '.js'))
            .map(file => `${fromPath}/${file}`)
            .map(path => require(path))
            .flatMap(_.values)
            .partition(fn => !!metadata.get(symbols.key, fn))
            .value();

        _.each(specialKeys, fn => {
            this.autoRegister(metadata.get(symbols.key, fn), fn);
        });

        _.each(normalKeys, fn => this.autoRegister(fn));
        return this;
    }
}
