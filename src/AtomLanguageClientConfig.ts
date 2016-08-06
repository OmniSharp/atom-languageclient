/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IAtomConfig } from 'atom-languageservices';
import { injectable } from 'atom-languageservices/decorators';
import { packageName } from './constants';
import { AtomConfig } from './atom/AtomConfig';

@injectable
export class AtomLanguageClientConfig {
    private _atomConfig: AtomConfig;
    private _settings = new Map<string, IAtomConfig.Setting>();

    constructor(atomConfig: AtomConfig) {
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
    }

    public update() {
        const properties: any = {};
        this._settings.forEach((setting, key) => {
            properties[key] = setting;
        });
        this._atomConfig.setSchema(packageName, {
            type: 'object',
            properties
        });
    }
}
