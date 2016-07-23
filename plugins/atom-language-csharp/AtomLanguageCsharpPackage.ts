/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs';
import { join } from 'path';
import { CompositeDisposable } from 'ts-disposables';
import { Message } from 'vscode-jsonrpc';
import { ILanguageProvider, ILanguageService } from '../../src/services/_internal';
import { CloseAction, ErrorAction, ILanguageProtocolServerOptions, TransportKind } from '../../src/services/_public';
import { AtomLanguageCsharpSettings, IAtomLanguageCsharpSettings } from './atom/AtomLanguageCsharpSettings';

export class AtomLanguageCsharpPackage implements IAtomPackage<IAtomLanguageCsharpSettings> {
    private _disposable: CompositeDisposable;
    private _settings: AtomLanguageCsharpSettings;
    private _stateChange: ReplaySubject<boolean>;
    private _languageService: ILanguageService;

    /* tslint:disable:no-any */
    public activate(settings: IAtomLanguageCsharpSettings) {
        this._disposable = new CompositeDisposable();
        this._settings = settings instanceof AtomLanguageCsharpSettings ? settings : new AtomLanguageCsharpSettings(settings);
        this._stateChange = new ReplaySubject<boolean>(1);
    }

    /* tslint:disable-next-line:function-name */
    public ['consume-atom-language-client'](service: ILanguageService) {
        this._languageService = service;
    }

    /* tslint:disable-next-line:function-name */
    public ['provide-atom-language'](): ILanguageProvider {
        const serverModule = join(__dirname, 'node_modules/omnisharp-client/languageserver/server.js');
        const serverOptions: ILanguageProtocolServerOptions = {
            run: { module: serverModule, transport: TransportKind.stdio },
            debug: { module: serverModule, transport: TransportKind.stdio }
        };

        return <ILanguageProvider>{
            clientOptions: {
                diagnosticCollectionName: 'c#',
                documentSelector: 'c#',
                errorHandler: {
                    error: (error: Error, message: Message, count: number) => {
                        console.error(error, message, count);
                        return ErrorAction.Continue;
                    },
                    closed() {
                        console.error('closed');
                        return CloseAction.Restart;
                    }
                },
                outputChannelName: 'c#',
                initializationOptions: {},
                synchronize: {
                    extensionSelector: ['.cs']
                }
            },
            serverOptions,
            dispose() { /* */ }
        };
    }

    /* tslint:disable-next-line:no-any */
    public static deserialize(state: IAtomLanguageCsharpSettings) {
        return new AtomLanguageCsharpSettings(state);
    }

    public serialize() {
        return this._settings.serialize(AtomLanguageCsharpPackage);
    }

    public deactivate() {
        this._disposable.dispose();
    }

    public static get version() { return 1; }
}

atom.deserializers.add(AtomLanguageCsharpPackage);
