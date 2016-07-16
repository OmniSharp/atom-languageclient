/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { Disposable, DisposableBase } from 'ts-disposables';
import { CancellationToken, ErrorCodes, NotificationHandler, NotificationType, RequestHandler, RequestType, ResponseError } from 'vscode-jsonrpc';
import { inject } from '../services/_decorators';
import { ClientState, ILanguageProtocolClient, ILanguageProtocolClientOptions, ISyncExpression } from '../services/_public';
import { InitializeError, InitializeParams, InitializeResult, ServerCapabilities, TextDocumentSyncKind } from '../vscode-languageserver-types';
import { ShowMessageRequest } from '../vscode-protocol';
import { IConnection } from './Connection';
import { createObservable } from '../helpers/createObservable';
import { ProjectProvider } from '../atom/ProjectProvider';

export class Delayer extends DisposableBase {
    private _observer: Observer<() => void>;
    private _force: Observer<void>;
    constructor() {
        super();
        const observable = createObservable<() => void>(observer => {
            this._observer = observer;
        }).publish();
        const force = this._force = new Subject<void>();
        observable.connect();
        this._disposable.add(
            observable.bufferToggle(
                observable.throttleTime(100),
                () => Observable.merge(Observable.timer(100), force).take(1)
            ).subscribe(fns => {
                _.each(fns, fn => fn());
            })
        );
    }
    public queue(func: () => void) {
        this._observer.next(func);
    }
    public force() {
        this._force.next(undefined);
    }
}

export class LanguageProtocolClient extends DisposableBase implements ILanguageProtocolClient {
    private _capabilities: ServerCapabilities;
    private _connection: IConnection;
    private _projectProvider: ProjectProvider;
    private _state: ClientState;
    private _options: ILanguageProtocolClientOptions;
    private _documentDelayer: Delayer;

    public get state() { return this._state; }
    public get capabilities() { return this._capabilities; }

    constructor(
        projectProvider: ProjectProvider,
        @inject(IConnection) connection: IConnection,
        @inject(ILanguageProtocolClientOptions) options: ILanguageProtocolClientOptions,
        @inject(ISyncExpression) syncExpression: ISyncExpression) {
        super();
        this._projectProvider = projectProvider;
        this._connection = connection;
        this._options = options;
        this._state = ClientState.Initial;
        this._documentDelayer = new Delayer();

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
            /*
            switch (message.type) {
                case MessageType.Error:
                    this.outputChannel.appendLine(`[Error] ${message.message}`);
                    break;
                case MessageType.Warning:
                    this.outputChannel.appendLine(`[Warn] ${message.message}`);
                    break;
                case MessageType.Info:
                    this.outputChannel.appendLine(`[Info] ${message.message}`);
                    break;
                default:
                    this.outputChannel.appendLine(message.message);
            }
            */
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
            // this._telemetryEmitter.fire(data);
        });
        this._connection.listen();
        return this._initialize();
    }

    private _initialize(): Promise<InitializeResult> {
        const initParams: InitializeParams = {
            processId: process.pid,
            rootPath: this._projectProvider.getPaths()[0] || process.cwd(),
            capabilities: {},
            initializationOptions: this._options.initializationOptions
        };
        return this._connection.initialize(initParams)
            .then(
            (result) => {
                this._state = ClientState.Running;
                this._capabilities = result.capabilities;
                return result;
            },
            (error: ResponseError<InitializeError>) => {
                if (error.data.retry) {
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

    public sendRequest<P, R, E>(type: RequestType<P, R, E>, params: P, token?: CancellationToken): Thenable<R> {
        return this.doSendRequest(this._connection, type, params, token);
    }

    private doSendRequest<P, R, E>(connection: IConnection, type: RequestType<P, R, E>, params: P, token?: CancellationToken): Thenable<R> {
        if (this._isConnectionActive) {
            this._documentDelayer.force();
            return connection.sendRequest(type, params, token);
        } else {
            return Promise.reject<R>(new ResponseError(ErrorCodes.InternalError, 'Connection is closed.'));
        }
    }

    public sendNotification<P>(type: NotificationType<P>, params?: P): void {
        if (this._isConnectionActive) {
            this._documentDelayer.force();
            this._connection.sendNotification(type, params);
        }
    }

    public onNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>): void {
        this._connection.onNotification(type, handler);
    }

    public onRequest<P, R, E>(type: RequestType<P, R, E>, handler: RequestHandler<P, R, E>): void {
        this._connection.onRequest(type, handler);
    }

    // public get onTelemetry(): Event<any> {
    //     return this._telemetryEmitter.event;
    // }
}
