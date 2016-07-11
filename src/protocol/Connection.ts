/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { Observable } from 'rxjs';

import {
    CancellationToken, ClientMessageConnection, Message,
    MessageReader, MessageWriter, NotificationHandler,
    NotificationType, RequestHandler, RequestType,
    Trace, Tracer,
    createClientMessageConnection
} from 'vscode-jsonrpc';

import {
    DidChangeConfigurationNotification,
    DidChangeConfigurationParams, DidChangeTextDocumentNotification, DidChangeTextDocumentParams,
    DidChangeWatchedFilesNotification, DidChangeWatchedFilesParams, DidCloseTextDocumentNotification,
    DidCloseTextDocumentParams, DidOpenTextDocumentNotification, DidOpenTextDocumentParams,
    DidSaveTextDocumentNotification, DidSaveTextDocumentParams, ExitNotification,
    InitializeParams, InitializeRequest, InitializeResult,
    LogMessageNotification, LogMessageParams,
    PublishDiagnosticsNotification, PublishDiagnosticsParams,
    ShowMessageNotification, ShowMessageParams,
    ShutdownRequest, TelemetryEventNotification
} from './utils/protocol';

import { ConsoleLogger } from './ConsoleLogger';

export interface IConnection {

    listen(): void;

    sendRequest<P, R, E>(type: RequestType<P, R, E>, params: P, token?: CancellationToken): Promise<R>;
    sendNotification<P>(type: NotificationType<P>, params: P): void;
    onNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>): void;
    onRequest<P, R, E>(type: RequestType<P, R, E>, handler: RequestHandler<P, R, E>): void;
    trace(value: Trace, tracer: Tracer): void;

    initialize(params: InitializeParams): Promise<InitializeResult>;
    shutdown(): Promise<void>;
    exit(): void;

    onLogMessage(handle: NotificationHandler<LogMessageParams>): void;
    onShowMessage(handler: NotificationHandler<ShowMessageParams>): void;
    onTelemetry(handler: NotificationHandler<any>): void;

    didChangeConfiguration(params: DidChangeConfigurationParams): void;
    didChangeWatchedFiles(params: DidChangeWatchedFilesParams): void;

    didOpenTextDocument(params: DidOpenTextDocumentParams): void;
    didChangeTextDocument(params: DidChangeTextDocumentParams): void;
    didCloseTextDocument(params: DidCloseTextDocumentParams): void;
    didSaveTextDocument(params: DidSaveTextDocumentParams): void;
    onDiagnostics(handler: NotificationHandler<PublishDiagnosticsParams>): void;

    dispose(): void;
}

export interface IConnectionErrorHandler {
    (error: Error, message: Message, count: number): void;
}

export interface IConnectionCloseHandler {
    (): void;
}

export class Connection implements IConnection {
    private _connection: ClientMessageConnection;

    constructor(inputStream: NodeJS.ReadableStream, outputStream: NodeJS.WritableStream, errorHandler: IConnectionErrorHandler, closeHandler: IConnectionCloseHandler);
    constructor(reader: MessageReader, writer: MessageWriter, errorHandler: IConnectionErrorHandler, closeHandler: IConnectionCloseHandler);
    constructor(input: any, output: any, errorHandler: IConnectionErrorHandler, closeHandler: IConnectionCloseHandler) {
        const logger = new ConsoleLogger();
        const connection = createClientMessageConnection(input, output, logger);
        connection.onError((data) => { errorHandler(data[0], data[1], data[2]); });
        connection.onClose(closeHandler);
        this._connection = connection;
    }

    public listen() {
        this._connection.listen();
    }

    public sendRequest<P, R, E>(type: RequestType<P, R, E>, params: P, token?: CancellationToken) {
        return this._connection.sendRequest(type, params, token);
    }

    public sendNotification<P>(type: NotificationType<P>, params: P) {
        this._connection.sendNotification(type, params);
    }

    public onNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>) {
        this._connection.onNotification(type, handler);
    }
    public onRequest<P, R, E>(type: RequestType<P, R, E>, handler: RequestHandler<P, R, E>) {
        this._connection.onRequest(type, handler);
    }

    public trace(value: Trace, tracer: Tracer) {
        this._connection.trace(value, tracer);
    }

    public initialize(params: InitializeParams) {
        return this._connection.sendRequest(InitializeRequest.type, params);
    }

    public shutdown() {
        return this._connection.sendRequest(ShutdownRequest.type, undefined);
    }

    public exit() {
        this._connection.sendNotification(ExitNotification.type);
    }

    public onLogMessage(handler: NotificationHandler<LogMessageParams>) {
        this._connection.onNotification(LogMessageNotification.type, handler);
    }

    public onShowMessage(handler: NotificationHandler<ShowMessageParams>) {
        this._connection.onNotification(ShowMessageNotification.type, handler);
    }

    public onTelemetry(handler: NotificationHandler<any>) {
        this._connection.onNotification(TelemetryEventNotification.type, handler);
    }

    public didChangeConfiguration(params: DidChangeConfigurationParams) {
        this._connection.sendNotification(DidChangeConfigurationNotification.type, params);
    }

    public didChangeWatchedFiles(params: DidChangeWatchedFilesParams) {
        this._connection.sendNotification(DidChangeWatchedFilesNotification.type, params);
    }

    public didOpenTextDocument(params: DidOpenTextDocumentParams) {
        this._connection.sendNotification(DidOpenTextDocumentNotification.type, params);
    }

    public didChangeTextDocument(params: DidChangeTextDocumentParams | DidChangeTextDocumentParams[] | undefined) {
        this._connection.sendNotification(DidChangeTextDocumentNotification.type, params);
    }

    public didCloseTextDocument(params: DidCloseTextDocumentParams) {
        this._connection.sendNotification(DidCloseTextDocumentNotification.type, params);
    }

    public didSaveTextDocument(params: DidSaveTextDocumentParams) {
        this._connection.sendNotification(DidSaveTextDocumentNotification.type, params);
    }

    public onDiagnostics(handler: NotificationHandler<PublishDiagnosticsParams>) {
        this._connection.onNotification(PublishDiagnosticsNotification.type, handler);
    }

    public dispose() {
        this._connection.dispose();
    }
}
