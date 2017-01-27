/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
// import { Observable } from 'rxjs';
import { Delayer, IDocumentDelayer, ILanguageProtocolClient, ILanguageProtocolClientOptions, ILanguageProvider, ISyncExpression } from 'atom-languageservices';
import { CompositeDisposable, DisposableBase } from 'ts-disposables';
import { Message } from 'vscode-jsonrpc';
import { AtomTextEditorSource } from '../atom/AtomTextEditorSource';
import { Connection, IConnection } from '../protocol/Connection';
import { Container } from '../di/Container';
import { LanguageProtocolClient } from '../protocol/LanguageProtocolClient';
import { SyncExpression } from './SyncExpression';

/**
 * Takes in all the different languages provided by other packages and configures them.
 */
export class LanguageProvider extends DisposableBase {
    private _container: Container;
    private _atomTextEditorSource: AtomTextEditorSource;
    private _connections: Map<ILanguageProvider, Set<ILanguageProtocolClient>>;
    private _activated: boolean;
    private _activatedPromise: Promise<void>;

    constructor(container: Container, activated: Promise<void>) {
        super();
        this._container = container;
        this._connections = new Map<ILanguageProvider, Set<ILanguageProtocolClient>>();
        this._activatedPromise = activated;
        activated.then(() => this._activated = true);
    }

    public add(provider: ILanguageProvider): void {
        if (!this._activated) {
            this._activatedPromise.then(() => this.add(provider));
            return;
        }

        if (!this._atomTextEditorSource) {
            this._atomTextEditorSource = this._container.resolve(AtomTextEditorSource);
        }

        if (!this._connections.has(provider)) {
            this._connections.set(provider, new Set<ILanguageProtocolClient>());
        }

        const connections = this._connections.get(provider) !;
        const syncExpression = SyncExpression.create(provider.clientOptions);
        this._atomTextEditorSource.observeTextEditors
            .filter(editor => syncExpression.evaluate(editor))
            // .concatMap(editor => {
            //     // Allow multiple language servers to run a given language.
            //     // Based on the context of the language server (could be from a different project, for example)
            //     if (provider.chooseConnection) {
            //         return Observable.fromPromise(provider.chooseConnection({
            //             connections: _.toArray(connections),
            //             editor
            //         }))
            //         .filter(x => x).map(() => editor);
            //     }

            //     return Observable.of(editor);
            // })
            .take(1)
            .toPromise()
            .then(() => {
                return this._createClient(provider, syncExpression);
            })
            .then(client => {
                connections.add(<any>client);
            });
    }

    private _createClient(provider: ILanguageProvider, syncExpression: ISyncExpression) {
        let connection: IConnection;
        let client: LanguageProtocolClient;
        const container = this._container.createChild();
        container.registerInstance(ISyncExpression, syncExpression);
        container.registerInstance(ILanguageProtocolClientOptions, provider.clientOptions);
        container.registerSingleton(IDocumentDelayer, Delayer);
        const capabilities = container.registerCapabilities(ILanguageProtocolClient);

        const errorHandler = (error: Error, message: Message, count: number) => {
            console.error(error, message, count);
        };

        const closeHandler = () => {
            /* */
        };

        const connectionOptions = {
            /* tslint:disable-next-line:no-any */
            closeHandler, errorHandler, output(x: any) { console.log(x); }
        };

        const cd = new CompositeDisposable(container);
        this._disposable.add(cd);

        const connectionRequest = Connection.create(provider.serverOptions, connectionOptions);
        return connectionRequest.then(conn => {
            connection = conn;
            container.registerInstance(IConnection, connection);
            container.registerSingleton(LanguageProtocolClient);
            container.registerAlias(LanguageProtocolClient, ILanguageProtocolClient);

            client = container.resolve(LanguageProtocolClient);
            cd.add(connection, client);
            return client.start().then(() => client);
        }).then(() => {
            const disposables = container.resolveEach(
                _(capabilities)
                    .filter(c => c.isCompatible(client.capabilities))
                    .map(x => x.ctor)
                    .value()
            );
            for (const item of disposables) {
                if (item instanceof Error) {
                    console.error(item, (<any>item).innerError);
                } else if (item.dipose) {
                    cd.add(item);
                }
            }
            if (provider.onConnected) {
                provider.onConnected(client);
            }
            return client;
        });
    }
}
