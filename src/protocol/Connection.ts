/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { ChildProcess, spawn } from 'child_process';

import {
    CancellationToken, ClientMessageConnection, IPCMessageReader, IPCMessageWriter,
    Message, MessageReader, MessageWriter, NotificationHandler,
    NotificationType, RequestHandler, RequestType,
    Trace, Tracer,
    createClientMessageConnection
} from 'vscode-jsonrpc';

import { fork } from './utils/electron';
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
import { IExecutable, IExecutableOptions, IForkOptions, INodeModule, IStreamInfo, ServerOptions, TransportKind } from './ServerOptions';

const isDefined = _.negate(_.isUndefined);

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

declare var v8debug: any;

export interface IConnectionOptionsBase {
    errorHandler: IConnectionErrorHandler;
    closeHandler: IConnectionCloseHandler;
}
export interface IConnectionCreateOptions extends IConnectionOptionsBase {
    output(value: string): void;
}
export interface IIpcConnection extends IConnectionOptionsBase {
    process?: ChildProcess;
    writer: MessageWriter;
    reader: MessageReader;
}
export interface IStdioConnection extends IConnectionOptionsBase {
    process?: ChildProcess;
    input: NodeJS.ReadableStream;
    output: NodeJS.WritableStream;
}
export type ConnectionOptions = IIpcConnection | IStdioConnection;

function isStdioConnection(options: any): options is IStdioConnection {
    return options.process;
}

function getEnvironment(env: any): any {
    if (!env) {
        return process.env;
    }
    const result: any = Object.create(null);
    Object.keys(process.env).forEach(key => result[key] = process.env[key]);
    Object.keys(env).forEach(key => result[key] = env[key]);
}

export class Connection implements IConnection {
    public static create(server: ServerOptions, opts: IConnectionCreateOptions, debug: boolean = false): Promise<Connection> {
        // We got a function.
        if (_.isFunction(server)) {
            return server().then((result) => {
                const info = <IStreamInfo>result;
                if (info.writer && info.reader) {
                    return new Connection(_.assign({}, opts, { input: info.reader, output: info.writer }));
                } else {
                    const cp = <ChildProcess>result;
                    return new Connection(_.assign({}, opts, { input: cp.stdout, output: cp.stdin, process: cp }));
                }
            });
        }
        let json: { command?: string; module?: string };
        const runDebug = <{ run: any; debug: any; }>server;
        if (isDefined(runDebug.run) || isDefined(runDebug.debug)) {
            // We are under debugging. So use debug as well.
            if (typeof v8debug === 'object' || debug) {
                json = runDebug.debug;
            } else {
                json = runDebug.run;
            }
        } else {
            json = server;
        }
        if (isDefined(json.module)) {
            const node: INodeModule = <INodeModule>json;
            if (node.runtime) {
                const args: string[] = [];
                const options: IForkOptions = node.options || Object.create(null);
                if (options.execArgv) {
                    options.execArgv.forEach(element => args.push(element));
                }
                args.push(node.module);
                if (node.args) {
                    node.args.forEach(element => args.push(element));
                }
                const execOptions: IExecutableOptions = Object.create(null);
                execOptions.cwd = options.cwd || atom.project.getPaths()[0];
                execOptions.env = getEnvironment(options.env);
                if (node.transport === TransportKind.ipc) {
                    execOptions.stdio = [null, null, null, <any>'ipc'];
                }
                const process = spawn(node.runtime, args, execOptions);
                if (!process || !process.pid) {
                    return Promise.reject<Connection>(`Launching server using runtime ${node.runtime} failed.`);
                }
                // A spawned process doesn't have ipc transport even if we spawn node. For now always use stdio communication.
                if (node.transport === TransportKind.ipc) {
                    process.stdout.on('data', (data: any) => opts.output(data.toString()));
                    process.stderr.on('data', (data: any) => opts.output(data.toString()));

                    const reader = new IPCMessageReader(process);
                    const writer = new IPCMessageWriter(process);
                    return Promise.resolve(new Connection(_.assign({}, opts, { reader, writer, process })));
                } else {
                    return Promise.resolve(new Connection(_.assign({}, opts, { input: process.stdout, output: process.stdin })));
                }
            } else {
                return new Promise<Connection>((resolve, reject) => {
                    const options: IForkOptions = node.options || Object.create(null);
                    options.execArgv = options.execArgv || [];
                    options.cwd = options.cwd || atom.project.getPaths()[0];
                    fork(node.module, node.args || [], options, (error, cp) => {
                        if (error) {
                            reject(error);
                        } else {
                            if (node.transport === TransportKind.ipc) {
                                cp.stdout.on('data', (data: any) => {
                                    opts.output(data.toString());
                                });
                                const reader = new IPCMessageReader(cp);
                                const writer = new IPCMessageWriter(cp);
                                resolve(new Connection(_.assign({}, opts, { reader, writer, process: cp })));
                            } else {
                                resolve(new Connection(_.assign({}, opts, { input: cp.stdout, output: cp.stdin })));
                            }
                        }
                    });
                });
            }
        } else if (isDefined(json.command)) {
            const command: IExecutable = <IExecutable>json;
            const options = command.options || {};
            options.cwd = options.cwd || atom.project.getPaths()[0];
            const process = spawn(command.command, command.args, command.options);
            return Promise.resolve(new Connection(_.assign({}, opts, { input: process.stdout, output: process.stdin, process })));
        }
        return Promise.reject<Connection>(new Error(`Unsupported server configuartion ` + JSON.stringify(server, null, 4)));
    }

    private _connection: ClientMessageConnection;
    private _process: ChildProcess;

    constructor(options: ConnectionOptions) {
        let input: any;
        let output: any;
        const {closeHandler, errorHandler, process} = options;
        if (process) {
            this._process = process;
        }
        if (isStdioConnection(options)) {
            input = options.input;
            output = options.output;
        } else {
            input = options.reader;
            output = options.writer;
        }

        const logger = new ConsoleLogger();
        const connection = createClientMessageConnection(input, output, logger);
        connection.onError((data) => { errorHandler(data[0], data[1], data[2]); });
        connection.onClose(closeHandler);
        this._connection = connection;
    }

    public connection() {
        return this._connection;
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
