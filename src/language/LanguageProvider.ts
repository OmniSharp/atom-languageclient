/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { CompositeDisposable, Disposable, DisposableBase, IDisposable, isDisposable } from 'ts-disposables';
import { Message } from 'vscode-jsonrpc';
import { ILanguageProvider } from '../services/_internal';
import { Delayer, IDocumentDelayer, ILanguageProtocolClient, ILanguageProtocolClientOptions, ISyncExpression } from '../services/_public';
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
    constructor(container: Container) {
        super();
        this._container = container;
    }

    public add(provider: ILanguageProvider): void {
        if (!this._atomTextEditorSource) {
            this._atomTextEditorSource = this._container.resolve(AtomTextEditorSource);
        }

        const syncExpression = SyncExpression.create(provider.clientOptions);
        this._atomTextEditorSource.observeTextEditors
            .filter(editor => syncExpression.evaluate(editor))
            .take(1)
            .toPromise()
            .then(() => {
                const container = this._container.createChild();
                container.registerInstance(ISyncExpression, syncExpression);
                container.registerInstance(ILanguageProtocolClientOptions, provider.clientOptions);
                container.registerSingleton(IDocumentDelayer, Delayer);
                const capabilities = container.registerCapabilities(ILanguageProtocolClient);

                const errorHandler = (error: Error, message: Message, count: number) => {
                    console.error(error, message, count);
                };

                const closeHandler = () => { /* */ };

                const connectionOptions = {
                    closeHandler, errorHandler, output(x: any) { console.log(x); }
                };

                const cd = new CompositeDisposable(container);
                this._disposable.add(cd);

                const connectionRequest = Connection.create(provider.serverOptions, connectionOptions);
                connectionRequest.then(connection => {
                    container.registerInstance(IConnection, connection);
                    container.registerSingleton(LanguageProtocolClient);
                    container.registerAlias(LanguageProtocolClient, ILanguageProtocolClient);

                    const client = container.resolve(LanguageProtocolClient);
                    cd.add(connection, client);

                    return client.start().then(() => client);
                }).then(client => {
                    const disposables = container.resolveEach(capabilities);
                    cd.add(...disposables);
                });
            });
    }
}
