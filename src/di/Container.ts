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

    public constructor() {
        super();
        this._container = new AureliaContainer();
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

    public registerSingleton(key: any, fn: Function) {
        this._container.registerSingleton(key, fn);
        return this;
    }

    public registerTransient(key: any, fn: Function) {
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

    public resolveCapabilities(key: any, instance: IDisposable): IDisposable {
        const capabilities = _(this._capabilities)
            .filter(x => _.includes(x.params, key))
            .map(x => x.item)
            .value();

        const child = this._container.createChild();

        const resolver: any = child.registerInstance(key, instance);
        const cd = new CompositeDisposable(
            ..._.map(capabilities, capability => {
                child.registerTransient(capability);
                return child.get(capability);
            }));

        cd.add(
            () => {
                // Try our best to clean up after the child container
                resolver.state = null;
                (<any>child)._resolvers.clear();
                (<any>child)._resolvers = null;
                (<any>child)._configuration = null;
                (<any>child).parent = null;
                (<any>child).root = null;
            }
        );
        return cd;
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
