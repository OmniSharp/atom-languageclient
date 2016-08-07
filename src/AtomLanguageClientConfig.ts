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
    private _services = new Map<string, IAtomConfig.Setting>();
    private _configure = new Map<string, () => { onEnabled?(): IDisposable; }>();
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

    public addService(name: string, setting: IAtomConfig.Setting, service: () => { onEnabled?(): IDisposable; }) {
        this._services.set(name, setting);
        this._configure.set(`services.${name}`, service);
        this._update();
    }

    public get schema() { return this._schema; }

    private _update = _.debounce(() => {
        this._configure.forEach((value, name) => {
            let disposable: IDisposable | null = null;
            const feature = value();
            if (!feature.onEnabled) {
                this._services.delete(name.split('.')[1]);
                return;
            }
            this._disposable.add(
                this._atomConfig.observe<boolean>(name)
                    .subscribe(enabled => {
                        if (enabled && !disposable) {
                            disposable = feature.onEnabled!();
                        } else if (!enabled && disposable) {
                            disposable.dispose();
                            disposable = null;
                        }
                    })
            );
        });
        this._configure.clear();

        const properties: any = {};
        this._settings.forEach((setting, key) => {
            properties[key] = setting;
        });

        const serviceProperties: any = {};
        this._services.forEach((setting, key) => {
            serviceProperties[key] = setting;
        });

        properties['services'] = {
            type: 'object',
            properties: serviceProperties
        };
        this._schema = properties;
        this._atomConfig.setSchema(packageName, {
            type: 'object',
            properties
        });
    }, 1000);
}
