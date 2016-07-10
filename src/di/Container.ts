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
import { DisposableBase } from 'ts-disposables';

const $readdir = Observable.bindNodeCallback(readdir);
const $exists = Observable.bindCallback(exists);

export interface IResolver {
    resolve<T>(key: T): T;
    resolveAll<T>(key: any): T[];
}

export class Container extends DisposableBase implements IResolver {
    private _container: AureliaContainer;
    private _keysToActivate: any[] = [];

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
            );
    }

    public register(fn: any, key?: any) {
        if (metadata.get('di:activate', fn)) {
            this._keysToActivate.push(key || fn);
        }
        this._container.autoRegister(fn, key);
        return this;
    }

    public registerAll(fns: any[], key?: any) {
        if (key) {
            _.each(fns, fn => this.register(fn, key));
        } else {
            _.each(fns, fn => this.register(fn));
        }
        return this;
    }

    public resolve<T>(key: { new (...args: any[]): T; }): T {
        return this._container.get(key);
    }

    public resolveAll<T>(key: any): T[] {
        return this._container.getAll(key);
    }

    public activate() {
        _.each(this._keysToActivate, key => this._container.get(key));
        return true;
    }

    private _registerServices(fromPath: string, files: string[]) {
        const [specialKeys, normalKeys] = _(files)
            .filter(file => _.endsWith(file, '.js'))
            .map(file => `${fromPath}/${file}`)
            .map(path => require(path))
            .flatMap(_.values)
            .partition(fn => !!metadata.get('di:key', fn))
            .value();

        _.each(specialKeys, fn => {
            this.register(fn, metadata.get('di:key', fn));
        });

        _.each(normalKeys, fn => this.register(fn));
        return this;
    }
}
