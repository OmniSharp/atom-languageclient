/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs';
import { CloseAction, ErrorAction, ILanguageProtocolClient, ILanguageProtocolServerOptions, ILanguageProvider, ILanguageService, TransportKind } from 'atom-languageservices';
import { join } from 'path';
import { CompositeDisposable } from 'ts-disposables';
import { Message, NotificationType } from 'vscode-jsonrpc';
import { AtomLanguageJsonSettings, IAtomLanguageJsonSettings } from './atom/AtomLanguageJsonSettings';
import { SchemaAssociationNotification } from './server/server'

export class AtomLanguageJsonPackage implements IAtomPackage<IAtomLanguageJsonSettings> {
    private _disposable: CompositeDisposable;
    private _settings: AtomLanguageJsonSettings;
    private _stateChange: ReplaySubject<boolean>;
    private _languageService: ILanguageService;
    private _client: ILanguageProtocolClient;
    private _associations: Json.SchemaAssociations = {};

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
    public ['consume-json-validation'](validations: Json.Validation | Json.Validation[]) {
        if (!_.isArray(validations)) {
            validations = [validations];
        }
        _.each(validations, validation => {
            let {fileMatch, url} = validation;
            if (fileMatch && url) {
                if (fileMatch.charAt(0) !== '/' && !fileMatch.match(/\w+:\/\//)) {
                    fileMatch = '/' + fileMatch;
                }
                let association = this._associations[fileMatch];
                if (!association) {
                    association = [];
                    this._associations[fileMatch] = association;
                }
                association.push(url);
            }
        });

        if (this._client) {
            const notification = new NotificationType<Json.SchemaAssociations, any>('json/schemaAssociations');
            this._client.sendNotification(notification, this._associations);
        }
    }

    /* tslint:disable-next-line:function-name */
    public ['provide-atom-language'](): ILanguageProvider {
        // The server is implemented in node
        const serverModule = join(__dirname, 'server/server.js');
        const serverOptions: ILanguageProtocolServerOptions = {
            run: { module: serverModule, transport: TransportKind.ipc },
            debug: { module: serverModule, transport: TransportKind.ipc }
        };

        return <ILanguageProvider>{
            clientOptions: {
                diagnosticCollectionName: 'json',
                documentSelector: 'json',
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
                outputChannelName: 'json',
                initializationOptions: {},
                synchronize: {
                    extensionSelector: [
                        '.json',
                        '.bowerrc',
                        '.jshintrc',
                        '.jscsrc',
                        '.eslintrc',
                        '.babelrc',
                        '.webmanifest'
                    ]
                }
            },
            serverOptions,
            onConnected: (client) => {
                this._client = client;
                this._client.sendNotification(SchemaAssociationNotification.type, this._associations);
            },
            dispose() { /* */ }
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
