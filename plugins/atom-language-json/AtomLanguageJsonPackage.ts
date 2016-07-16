/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { CompositeDisposable } from 'ts-disposables';
import * as constants from '../../src/constants';
import { ILanguageProvider, ILanguageService } from '../../src/interfaces';
import { AtomLanguageJsonSettings, IAtomLanguageJsonSettings } from './atom/AtomLanguageJsonSettings';

export class AtomLanguageJsonPackage implements IAtomPackage<IAtomLanguageJsonSettings> {
    private _disposable: CompositeDisposable;
    private _settings: AtomLanguageJsonSettings;
    private _stateChange: ReplaySubject<boolean>;
    private _languageService: ILanguageService;

    /* tslint:disable:no-any */
    public activate(settings: IAtomLanguageJsonSettings) {
        this._disposable = new CompositeDisposable();
        this._settings = settings instanceof AtomLanguageJsonSettings ? settings : new AtomLanguageJsonSettings(settings);
        this._stateChange = new ReplaySubject<boolean>(1);
    }

    /* tslint:disable-next-line:function-name */
    public ['consume-atom-language-client'](service: ILanguageService) {
        this._languageService = service;
    }

    /* tslint:disable-next-line:function-name */
    public ['provide-atom-language'](): ILanguageProvider {
        return {
            dispose() { },
            options: {

            }
        };
    }

    /* tslint:disable-next-line:no-any */
    public static deserialize(state: IAtomLanguageJsonSettings) {
        return new AtomLanguageJsonSettings(state);
    }

    public serialize() {
        return this._settings.serialize(AtomLanguageJsonPackage);
    }

    public deactivate() {
        this._disposable.dispose();
    }

    public static get version() { return 1; }
}

atom.deserializers.add(AtomLanguageJsonPackage);
