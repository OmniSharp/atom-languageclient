/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Disposable, DisposableBase, IDisposable, isDisposable } from 'ts-disposables';
import { ILanguageProvider } from '../services/_internal';
import { ILanguageProtocolClientOptions, ISyncExpression } from '../services/_public';
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

        const container = this._container.createChild();
        const syncExpression = SyncExpression.create(provider.clientOptions);
        container.registerInstance(ISyncExpression, syncExpression);

        const connection = Connection.create()


        this._disposable.add(new LanguageProtocolContainer(provider));
    }
}

export class LanguageProtocolContainer extends DisposableBase {
    private _syncExpression: ISyncExpression;
    private _options: ILanguageProtocolClientOptions;
    public constructor(provider: ILanguageProvider) {
        super();
        if (isDisposable(provider)) {
            this._disposable.add(provider);
        }

        this._options = provider.clientOptions;
        this._syncExpression = this._buildSyncExpressions();
    }

    private _buildSyncExpressions() {

    }
}
