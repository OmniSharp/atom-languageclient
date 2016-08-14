/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IAtomConfig } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { DisposableBase } from 'ts-disposables';
import { packageName } from '../constants';
import { createObservable } from '../helpers/createObservable';

class PrefixAtomConfig extends DisposableBase implements IAtomConfig {
    private _prefix: string;
    constructor(prefix: string) {
        super();
        this._prefix = prefix;
    }

    public observe<T>(path: string) {
        return createObservable<T>(observer => {
            const disposer = atom.config.observe<T>(this._getPath(path), (value) => {
                observer.next(value);
            });

            return () => disposer.dispose();
        }).publishReplay(1).refCount();
    }


    public onDidChange<T>(path: string) {
        return createObservable<{ keyPath: string; oldValue: T; newValue: T; }>(observer => {
            const disposer = atom.config.onDidChange<T>(this._getPath(path), (value) => {
                observer.next(value);
            });

            return () => disposer.dispose();
        }).publishReplay(1).refCount()
        .startWith({ keyPath: this._getPath(path), oldValue: <any>undefined, newValue: atom.config.get<T>(this._getPath(path)) });
    }

    public get<T>(path: string) {
        return atom.config.get<T>(this._getPath(path));
    }

    public setSchema(packageName: string, schema: IAtomConfig.IObjectSetting) {
        (<any>atom.config).setSchema(packageName, schema);
    }

    public for(packageName: string) {
        const result = new PrefixAtomConfig(packageName);
        this._disposable.add(result);
        return result;
    }

    private _getPath(key: string) {
        if (this._prefix) {
            return `${this._prefix}.${key}`;
        }
        return key;
    }
}

@injectable
@alias(IAtomConfig)
export class AtomConfig extends PrefixAtomConfig {
    constructor() {
        super(packageName);
    }
}
