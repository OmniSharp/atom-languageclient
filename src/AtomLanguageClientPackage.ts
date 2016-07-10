/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { CompositeDisposable } from 'ts-disposables';
import { AtomLanguageClientSettings, IAtomLanguageClientSettings } from './atom/AtomLanguageClientSettings';
import { AtomLanguageProvider, IAtomLanguageProvider } from './atom/AtomLanguageProvider';
import { AtomLanguageService } from './atom/AtomLanguageService';
import { Container } from './di/Container';

export class AtomLanguageClientPackage implements IAtomPackage<AtomLanguageClientSettings> {
    private _container: Container;
    private _disposable: CompositeDisposable;
    private _settings: AtomLanguageClientSettings;
    private _atomLanguageProvider: AtomLanguageProvider;
    private _atomLanguageService: AtomLanguageService;
    private _stateChange: ReplaySubject<boolean>;

    /* tslint:disable:no-any */
    public activate(settings: IAtomLanguageClientSettings) {
        this._container = new Container();
        this._disposable = new CompositeDisposable();
        this._settings = settings instanceof AtomLanguageClientSettings ? settings : new AtomLanguageClientSettings(settings);
        this._stateChange = new ReplaySubject<boolean>(1);

        this._atomLanguageProvider = new AtomLanguageProvider(this._container);
        this._atomLanguageService = new AtomLanguageService(this._container, this._stateChange.asObservable());

        this._disposable.add(
            this._container,
            this._atomLanguageProvider,
            this._atomLanguageService
        );

        Observable.merge(
            this._container.registerFolder(__dirname, 'services')
        )
            .map(() => true)
            .subscribe({
                error: e => this._stateChange.error(e),
                complete: () => this._stateChange.next(true)
            });
    }

    /* tslint:disable-next-line:function-name */
    public ['provide-atom-language-client']() {
        return this._atomLanguageService;
    }

    /* tslint:disable-next-line:function-name */
    public ['consume-atom-language'](service: IAtomLanguageProvider) {
        return this._atomLanguageProvider.add(service);
    }

    /* tslint:disable-next-line:no-any */
    public static deserialize(state: IAtomLanguageClientSettings) {
        return new AtomLanguageClientSettings(state);
    }

    public serialize() {
        return this._settings.serialize(AtomLanguageClientPackage);
    }

    public deactivate() {
        this._disposable.dispose();
    }

    public static get version() { return 1; }
}

atom.deserializers.add(AtomLanguageClientPackage);
