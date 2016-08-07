/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { IAtomConfig } from 'atom-languageservices';
import { injectable } from 'atom-languageservices/decorators';
import { DisposableBase, IDisposable } from 'ts-disposables';
import { packageName } from './constants';
import { AtomConfig } from './atom/AtomConfig';

@injectable
export class AtomLanguageClientConfig extends DisposableBase {
    private _atomConfig: AtomConfig;
    private _settings = new Map<string, IAtomConfig.Setting>();
    private _schema: { [index: string]: IAtomConfig.Setting; } = {};

    constructor(atomConfig: AtomConfig) {
        super();
        this._atomConfig = atomConfig;

        this.add('developerMode', {
            title: 'Developer Mode',
            description: 'Outputs detailed server calls in console.log',
            type: 'boolean',
            default: false
        });
    }

    public add(name: string, setting: IAtomConfig.Setting) {
        this._settings.set(name, setting);

        this._update();
    }

    public addFeature(name: string, setting: IAtomConfig.Setting, feature: { onEnabled(): IDisposable; }) {
        this.add(name, setting);

        let disposable: IDisposable | null = null;
        this._disposable.add(
            this._atomConfig.observe<boolean>(name)
                .subscribe(enabled => {
                    if (enabled && !disposable) {
                        disposable = feature.onEnabled();
                    } else if (!enabled && disposable) {
                        disposable.dispose();
                        disposable = null;
                    }
                })
        );
    }

    public get schema() { return this._schema; }

    private _update = _.debounce(() => {
        const properties: any = {};
        this._settings.forEach((setting, key) => {
            properties[key] = setting;
        });
        this._schema = properties;
        this._atomConfig.setSchema(packageName, {
            type: 'object',
            properties
        });
    }, 1000);
}
