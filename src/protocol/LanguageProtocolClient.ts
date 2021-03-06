/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { Observable } from 'rxjs';
import { ClientState, IDocumentDelayer, ILanguageProtocolClient, ILanguageProtocolClientOptions, IProjectProvider, ISyncExpression } from 'atom-languageservices';
import { inject } from 'atom-languageservices/decorators';
import { ShowMessageRequest } from 'atom-languageservices/protocol';
import { InitializeError, InitializeParams, InitializeResult, MessageType } from 'atom-languageservices/types';
import { ServerCapabilities } from 'atom-languageservices/types-extended';
import { Disposable, DisposableBase } from 'ts-disposables';
import { CancellationTokenSource, ErrorCodes, NotificationHandler, NotificationType, RequestHandler, RequestType, ResponseError } from 'vscode-jsonrpc';
import { observePromise } from '../helpers/observePromise';
import { IConnection } from './Connection';

export class LanguageProtocolClient extends DisposableBase implements ILanguageProtocolClient {
    private _capabilities: ServerCapabilities;
    private _connection: IConnection;
    private _projectProvider: IProjectProvider;
    private _state: ClientState;
    private _options: ILanguageProtocolClientOptions;
    private _documentDelayer: IDocumentDelayer;

    public get state() { return this._state; }
    public get capabilities() { return this._capabilities; }
    public get options() { return this._options; }
    public get name() { return this._options.diagnosticCollectionName || this._options.outputChannelName || 'languageprotocol'; }
    public get rootPath() { return this._projectProvider.getPaths()[0] || process.cwd(); }

    constructor(
        @inject(IProjectProvider) projectProvider: IProjectProvider,
        @inject(IConnection) connection: IConnection,
        @inject(ILanguageProtocolClientOptions) options: ILanguageProtocolClientOptions,
        @inject(ISyncExpression) syncExpression: ISyncExpression,
        @inject(IDocumentDelayer) documentDelayer: IDocumentDelayer) {
        super();
        this._projectProvider = projectProvider;
        this._connection = connection;
        this._options = options;
        this._state = ClientState.Initial;
        this._documentDelayer = documentDelayer;

        this._disposable.add(
            this._documentDelayer,
            Disposable.create(() => {
                this.stop();
            })
        );
    }

    public start() {
        this._state = ClientState.Starting;
        this._connection.onLogMessage((message) => {
            let obj: any = message.message;
            try {
                obj = JSON.parse(obj);
            } catch (e) { }
            switch (message.type) {
                case MessageType.Error:
                    console.error(`[Error]`, obj);
                    break;
                case MessageType.Warning:
                    console.warn(`[Warn]`, obj);
                    break;
                case MessageType.Info:
                    console.info(`[Info]`, obj);
                    break;
                default:
                    console.log(message.message);
            }
        });
        this._connection.onShowMessage((message) => {
            // switch (message.type) {
            //     case MessageType.Error:
            //         Window.showErrorMessage(message.message);
            //         break;
            //     case MessageType.Warning:
            //         Window.showWarningMessage(message.message);
            //         break;
            //     case MessageType.Info:
            //         Window.showInformationMessage(message.message);
            //         break;
            //     default:
            //         Window.showInformationMessage(message.message);
            // }
        });
        this._connection.onRequest(ShowMessageRequest.type, (params) => {
            return <any>null;
            // let messageFunc: <T extends MessageItem>(message: string, ...items: T[]) => Thenable<T> = null;
            // switch (params.type) {
            //     case MessageType.Error:
            //         messageFunc = Window.showErrorMessage;
            //         break;
            //     case MessageType.Warning:
            //         messageFunc = Window.showWarningMessage;
            //         break;
            //     case MessageType.Info:
            //     default:
            //         messageFunc = Window.showInformationMessage;
            //         break;
            // }
            // return messageFunc(params.message, ...params.actions);
        });
        this._connection.onTelemetry((data) => {
            console.log(data);
        });
        this._connection.listen();
        return this._initialize();
    }

    private _initialize(): Promise<InitializeResult> {
        const initParams: InitializeParams = {
            processId: process.pid,
            rootPath: this.rootPath,
            capabilities: { highlightProvider: true },
            initializationOptions: this._options.initializationOptions
        };
        return this._connection.initialize(initParams)
            .then(
            (result) => {
                this._state = ClientState.Running;
                this._capabilities = <ServerCapabilities>result.capabilities;
                if (!this._capabilities.extended) {
                    this._capabilities.extended = {};
                }
                return result;
            },
            (error: ResponseError<InitializeError>) => {
                console.error(error);
                if (error && error.data && error.data.retry) {
                    // Window.showErrorMessage(error.message, { title: 'Retry', id: 'retry' })
                    //     .then(item => {
                    //         if (is.defined(item) && item.id === 'retry') {
                    //             this.initialize(connection);
                    //         } else {
                    //             this.stop();
                    //         }
                    //     });
                } else {
                    // if (error.message) {
                    //     Window.showErrorMessage(error.message);
                    // }
                    // this.stop();
                }
                this.stop();
            });
    }

    public stop() {
        if (!this._connection) {
            this._state = ClientState.Stopped;
            return;
        }
        this._state = ClientState.Stopping;
        this._cleanUp();
        // unkook listeners
        this._connection.shutdown().then(() => {
            this._connection.exit();
            this._connection.dispose();
            this._state = ClientState.Stopped;
        });
    }

    private _cleanUp(): void {
        this.dispose();
    }

    private get _isConnectionActive(): boolean {
        return this._state === ClientState.Running;
    }

    public sendRequest<P, R, E>(type: RequestType<P, R, E>, params: P): Observable<R> {
        return this._doSendRequest<P, R>(this._connection, type, params);
    }

    private _doSendRequest<P, R>(connection: IConnection, type: { method: string; }, params: P): Observable<R> {
        if (this._isConnectionActive) {
            this._documentDelayer.force();
            return observePromise<R>((token) => connection.sendRequest(<any>type, params, token));
            // return connection.sendRequest(<any>type, params, token);
        } else {
            return Observable.throw<R>(new ResponseError(ErrorCodes.InternalError, 'Connection is closed.'));
        }
    }

    public sendNotification<P>(type: NotificationType<P>, params?: P): void {
        if (this._isConnectionActive) {
            // this._documentDelayer.force();
            this._connection.sendNotification(<any>type, params);
        }
    }

    public onNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>): void {
        this._connection.onNotification(<any>type, handler);
    }

    public onRequest<P, R, E>(type: RequestType<P, R, E>, handler: RequestHandler<P, R, E>): void {
        this._connection.onRequest(<any>type, handler);
    }

    // public get onTelemetry(): Event<any> {
    //     return this._telemetryEmitter.event;
    // }
}
