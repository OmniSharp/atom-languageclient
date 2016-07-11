/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { FSWatcher } from 'fs';
import { ChildProcess, spawn } from 'child_process';
import { watch } from 'chokidar';
import { CompositeDisposable, Disposable, IDisposable } from 'ts-disposables';

import {
    ClientMessageConnection, Emitter, ErrorCodes,
    Event, IPCMessageReader, IPCMessageWriter,
    Logger, Message, MessageConnection,
    MessageReader, MessageWriter, NotificationHandler,
    NotificationType, RequestHandler, RequestType,
    ResponseError, Trace, Tracer,
    createClientMessageConnection, CancellationToken
} from 'vscode-jsonrpc';

import {
    CodeActionContext, CodeLens, Command,
    CompletionItem, CompletionItemKind, CompletionList,
    Definition, Diagnostic, DiagnosticSeverity,
    DocumentHighlight, DocumentHighlightKind, FormattingOptions,
    Hover, Location, MarkedString,
    ParameterInformation, Position, Range,
    SignatureHelp, SignatureInformation, SymbolInformation,
    SymbolKind, TextDocumentIdentifier, TextEdit,
    TextEditChange, WorkspaceChange, WorkspaceEdit
} from 'vscode-languageserver-types';

import * as c from './utils/convert';
import * as a2p from './utils/convert-atom-to-protocol';
import * as p2a from './utils/convert-protocol-to-atom';
import {
    ClientCapabilities, CodeActionParams, CodeActionRequest,
    CodeLensRequest, CodeLensResolveRequest, CompletionRequest,
    CompletionResolveRequest, DefinitionRequest, DidChangeConfigurationNotification,
    DidChangeConfigurationParams, DidChangeTextDocumentNotification, DidChangeTextDocumentParams,
    DidChangeWatchedFilesNotification, DidChangeWatchedFilesParams, DidCloseTextDocumentNotification,
    DidCloseTextDocumentParams, DidOpenTextDocumentNotification, DidOpenTextDocumentParams,
    DidSaveTextDocumentNotification, DidSaveTextDocumentParams, DocumentFormattingParams,
    DocumentFormattingRequest, DocumentHighlightRequest, DocumentOnTypeFormattingParams,
    DocumentOnTypeFormattingRequest, DocumentRangeFormattingParams, DocumentRangeFormattingRequest,
    DocumentSymbolRequest, ExitNotification, FileChangeType,
    FileEvent, HoverRequest, InitializeError,
    InitializeParams, InitializeRequest, InitializeResult,
    LogMessageNotification, LogMessageParams, MessageType,
    PublishDiagnosticsNotification, PublishDiagnosticsParams,
    ReferencesRequest, RenameParams, RenameRequest,
    ServerCapabilities, ShowMessageNotification, ShowMessageParams,
    ShowMessageRequest, ShowMessageRequestParams, ShutdownRequest,
    SignatureHelpRequest, TelemetryEventNotification, TextDocumentPositionParams,
    TextDocumentSyncKind, WorkspaceSymbolParams, WorkspaceSymbolRequest
} from './utils/protocol';

import { ISyncExpression, CompositeSyncExpression, FalseSyncExpression, FunctionSyncExpression, LanguageIdExpression } from './SyncExpression';

// import * as electron from './utils/electron';
import { terminate } from './utils/processes';
// import { Delayer } from './utils/async'

export {
    RequestType, NotificationType, NotificationHandler,
    Position, Range, Location, TextDocumentIdentifier, TextDocumentPositionParams,
    TextEdit, TextEditChange, WorkspaceChange,
    a2p as Code2Protocol, p2a as Protocol2Code
}

import { Connection } from './Connection';
import { fork } from './utils/electron';
import { DiagnosticCollection } from './DiagnosticCollection';
import { DefaultErrorHandler, IErrorHandler, CloseAction, ErrorAction } from './ErrorHandler';
import { ILanguageClientTextEditor } from '../omni/ILanguageClientTextEditor';
import { IStreamInfo, TransportKind, IExecutable, IExecutableOptions, IForkOptions, INodeModule, ServerOptions } from './ServerOptions';
import { OutputChannel } from './OutputChannel';
import { TextEditorSource } from '../omni/TextEditorSource'

declare var v8debug: any;

export interface SynchronizeOptions {
    configurationSection?: string | string[];
    fileEvents?: FSWatcher | FSWatcher[];
    textDocumentFilter?: (textDocument: ILanguageClientTextEditor) => boolean;
}

export interface LanguageClientOptions {
    documentSelector?: string | string[];
    synchronize?: SynchronizeOptions;
    diagnosticCollectionName?: string;
    initializationOptions?: any;
    errorHandler?: IErrorHandler;
}

interface InternalLanguageClientOptions {
    documentSelector?: string | string[];
    synchronize: SynchronizeOptions;
    diagnosticCollectionName?: string;
    initializationOptions?: any;
    errorHandler: IErrorHandler;
}

enum ClientState {
    Initial,
    Starting,
    Running,
    Stopping,
    Stopped
}

export class LanguageClient {

    private _name: string;
    private _serverOptions: ServerOptions;
    private _languageOptions: InternalLanguageClientOptions;
    private _forceDebug: boolean;

    private _state: ClientState;
    private _onReady: Promise<void>;
    private _onReadyCallbacks: { resolve: () => void; reject: () => void; };
    private _connection: Promise<Connection>;
    private _childProcess: ChildProcess;
    private _outputChannel: OutputChannel;
    private _capabilites: ServerCapabilities;

    private _listeners: CompositeDisposable;
    private _providers: CompositeDisposable;
    private _diagnostics: DiagnosticCollection;

    private _syncExpression: ISyncExpression;

    private _fileEvents: FileEvent[];

    private _telemetryEmitter: Emitter<any>;

    private _trace: Trace;
    private _tracer: Tracer;

    private _editorSource: TextEditorSource;

    public constructor(name: string, serverOptions: ServerOptions, languageOptions: LanguageClientOptions, editorSource: TextEditorSource, outputChannel: OutputChannel, forceDebug: boolean = false) {
        this._name = name;
        this._serverOptions = serverOptions;
        this._languageOptions = <any>languageOptions || {};
        this._languageOptions.synchronize = this._languageOptions.synchronize || {};
        this._languageOptions.errorHandler = this._languageOptions.errorHandler || new DefaultErrorHandler(name);
        this._syncExpression = this.computeSyncExpression();
        this._forceDebug = forceDebug;
        this._outputChannel = outputChannel;

        this._state = ClientState.Initial;
        this._diagnostics = new DiagnosticCollection();

        this._fileEvents = [];
        this._onReady = new Promise<void>((resolve, reject) => {
            this._onReadyCallbacks = { resolve, reject };
        });
        this._onReady.then(<any>undefined, () => {
            // Do nothing for now. We shut down after the initialize.
            // However to make the promise reject handler happy we register
            // an empty callback.
        });
        this._telemetryEmitter = new Emitter<any>();
        this._tracer = {
            log: (message: string) => {
                this.outputChannel.appendLine(message);
            }
        };
    }

    private computeSyncExpression(): ISyncExpression {
        let documentSelector = this._languageOptions.documentSelector;
        let textDocumentFilter = this._languageOptions.synchronize.textDocumentFilter;

        if (!documentSelector && !textDocumentFilter) {
            return new FalseSyncExpression();
        }
        if (textDocumentFilter && !documentSelector) {
            return new FunctionSyncExpression(textDocumentFilter);
        }
        if (!textDocumentFilter && documentSelector) {
            if (_.isString(documentSelector)) {
                return new LanguageIdExpression(<string>documentSelector)
            } else {
                return new CompositeSyncExpression(<string[]>documentSelector)
            }
        }
        if (textDocumentFilter && documentSelector) {
            return new CompositeSyncExpression(
                _.isString(documentSelector) ? [<string>documentSelector] : <string[]>documentSelector,
                textDocumentFilter);
        }

        return new FalseSyncExpression();
    }

    public sendRequest<P, R, E>(type: RequestType<P, R, E>, params: P, token?: CancellationToken): Promise<R> {
        return this.onReady().then(() => {
            return this.resolveConnection().then((connection) => {
                return this.doSendRequest(connection, type, params, token);
            });
        });
    }

    private doSendRequest<P, R, E>(connection: Connection, type: RequestType<P, R, E>, params: P, token?: CancellationToken): Promise<R> {
        if (this.isConnectionActive()) {
            return connection.sendRequest(type, params, token);
        } else {
            return Promise.reject<R>(new ResponseError(ErrorCodes.InternalError, 'Connection is closed.'));
        }
    }

    public sendNotification<P>(type: NotificationType<P>, params?: P): void {
        this.onReady().then(() => {
            this.resolveConnection().then((connection) => {
                if (this.isConnectionActive()) {
                    connection.sendNotification(type, params);
                }
            });
        });
    }

    public onNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>): void {
        this.onReady().then(() => {
            this.resolveConnection().then((connection) => {
                connection.onNotification(type, handler);
            })
        });
    }

    public onRequest<P, R, E>(type: RequestType<P, R, E>, handler: RequestHandler<P, R, E>): void {
        this.onReady().then(() => {
            this.resolveConnection().then((connection) => {
                connection.onRequest(type, handler);
            })
        });
    }

    public get onTelemetry(): Event<any> {
        return this._telemetryEmitter.event;
    }

    private get outputChannel(): OutputChannel {
        return this._outputChannel;
    }

    public set trace(value: Trace) {
        this._trace = value;
        this.onReady().then(() => {
            this.resolveConnection().then((connection) => {
                connection.trace(value, this._tracer);
            })
        });
    }

    private logTrace(message: string): void {
        if (this._trace === Trace.Off) {
            return;
        }
        this.outputChannel.appendLine(`[${(new Date().toLocaleTimeString())}] ${message}`);
    }

    public needsStart(): boolean {
        return this._state === ClientState.Initial || this._state === ClientState.Stopping || this._state === ClientState.Stopped;
    }

    public needsStop(): boolean {
        return this._state === ClientState.Starting || this._state === ClientState.Running;
    }

    public onReady(): Promise<void> {
        return this._onReady;
    }

    private isConnectionActive(): boolean {
        return this._state === ClientState.Running;
    }

    public start(): Disposable {
        this._listeners = new CompositeDisposable();
        this._providers = new CompositeDisposable();
        this._diagnostics = new DiagnosticCollection();

        this._state = ClientState.Starting;
        this.resolveConnection().then((connection) => {
            connection.onLogMessage((message) => {
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
            });
            connection.onShowMessage((message) => {
                switch (message.type) {
                    case MessageType.Error:
                        atom.notifications.addError(message.message);
                        break;
                    case MessageType.Warning:
                        atom.notifications.addWarning(message.message);
                        break;
                    case MessageType.Info:
                    default:
                        atom.notifications.addInfo(message.message);
                }
            });
            connection.onRequest(ShowMessageRequest.type, (params) => {
                // TODO: Handle actions
                // params.actions
                let messageFunc: (message: string) => any;
                switch (params.type) {
                    case MessageType.Error:
                        messageFunc = atom.notifications.addError;
                        break;
                    case MessageType.Warning:
                        messageFunc = atom.notifications.addWarning;
                        break;
                    case MessageType.Info:
                    default:
                        messageFunc = atom.notifications.addInfo;
                }
                return messageFunc(params.message);
            });
            connection.onTelemetry((data) => {
                this._telemetryEmitter.fire(data);
            });
            connection.listen();
            this.initialize(connection);
        }, (error) => {
            this._onReadyCallbacks.reject();
            atom.notifications.addError(`Couldn't start client ${this._name}`);
        });
        return new Disposable(() => {
            if (this.needsStop()) {
                this.stop();
            }
        });
    }

    private resolveConnection(): Promise<Connection> {
        if (!this._connection) {
            this._connection = this.createConnection();
        }
        return this._connection;
    }

    private initialize(connection: Connection): Promise<InitializeResult> {
        let initParams: InitializeParams = { processId: process.pid, rootPath: atom.project.getPaths()[0], capabilities: {}, initializationOptions: this._languageOptions.initializationOptions };
        return connection.initialize(initParams).then((result) => {
            this._state = ClientState.Running;
            this._capabilites = result.capabilities;
            connection.onDiagnostics(params => this.handleDiagnostics(params));
            if (this._capabilites.textDocumentSync !== TextDocumentSyncKind.None) {
                this._listeners.add(
                    this._editorSource.observeTextEditor()
                        .subscribe(editor => {
                            this.onDidOpenTextDoument(connection, editor);

                            this._listeners.add(
                                editor.onDidChange(change => {
                                    this.onDidChangeTextDocument(connection, editor);
                                }), editor.onDidDestroy(() => {
                                    this.onDidCloseTextDoument(connection, editor);
                                }), editor.onDidSave(() => {
                                    this.onDidSaveTextDocument(connection, editor);
                                })
                            );
                        }),
                );
            }

            this.hookFileEvents(connection);
            // this.hookConfigurationChanged(connection);
            this.hookCapabilities(connection);
            this._onReadyCallbacks.resolve();
            return result;
        }, (error: ResponseError<InitializeError>) => {
            if (error.data.retry) {
                // atom.notifications.addError(error.message, { title: 'Retry', id: "retry" }).then(item => {
                //     if (c.isDefined(item) && item.id === 'retry') {
                //         this.initialize(connection);
                //     } else {
                //         this.stop();
                //         this._onReadyCallbacks.reject();
                //     }
                // });
            } else {
                if (error.message) {
                    atom.notifications.addError(error.message);
                }
                this.stop();
                this._onReadyCallbacks.reject();
            }
        });
    }

    public stop() {
        if (!this._connection) {
            this._state = ClientState.Stopped;
            return;
        }
        this._state = ClientState.Stopping;
        this.cleanUp();
        // unkook listeners
        this.resolveConnection().then(connection => {
            connection.shutdown().then(() => {
                connection.exit();
                connection.dispose();
                this._state = ClientState.Stopped;
                let toCheck = this._childProcess;
                // Remove all markers
                this.checkProcessDied(toCheck);
            })
        });
    }

    private cleanUp(diagnostics: boolean = true): void {
        this._listeners.dispose();
        this._providers.dispose();
        if (diagnostics) {
            this._diagnostics.clear();
        }
    }

    public notifyConfigurationChanged(settings: any): void {
        this.onReady().then(() => {
            this.resolveConnection().then(connection => {
                if (this.isConnectionActive()) {
                    connection.didChangeConfiguration({ settings });
                }
            }, (error) => {
                console.error(`Syncing settings failed with error ${JSON.stringify(error, null, 4)}`);
            });
        });
    }

    public notifyFileEvent(event: FileEvent): void {
        this._fileEvents.push(event);
        this.onReady().then(() => {
            this.resolveConnection().then(connection => {
                if (this.isConnectionActive()) {
                    connection.didChangeWatchedFiles({ changes: this._fileEvents });
                }
                this._fileEvents = [];
            })
        });
    }

    private onDidOpenTextDoument(connection: Connection, textDocument: ILanguageClientTextEditor): void {
        if (!this._syncExpression.evaluate(textDocument)) {
            return;
        }
        connection.didOpenTextDocument(a2p.toOpenTextDocumentParams(textDocument));
    }

    private onDidChangeTextDocument(connection: Connection, event: ILanguageClientTextEditor): void {
        if (!this._syncExpression.evaluate(event)) {
            return;
        }
        let uri: string = event.getURI();
        if (this._capabilites.textDocumentSync === TextDocumentSyncKind.Incremental) {
            connection.didChangeTextDocument(a2p.toChangeIncrementalTextDocumentParams(event));
        } else {
            connection.didChangeTextDocument(a2p.toChangeFullTextDocumentParams(event));
        }
    }

    private onDidCloseTextDoument(connection: Connection, textDocument: ILanguageClientTextEditor): void {
        if (!this._syncExpression.evaluate(textDocument)) {
            return;
        }
        connection.didCloseTextDocument(a2p.toCloseTextDocumentParams(textDocument));
    }

    private onDidSaveTextDocument(conneciton: Connection, textDocument: ILanguageClientTextEditor): void {
        if (!this._syncExpression.evaluate(textDocument)) {
            return;
        }
        conneciton.didSaveTextDocument(a2p.toSaveTextDocumentParams(textDocument));
    }

    private handleDiagnostics(params: PublishDiagnosticsParams) {
        let uri = params.uri;
        let diagnostics = p2a.fromDiagnostics(params.diagnostics);
        this._diagnostics.set(uri, diagnostics);
    }

    private createConnection(): Promise<Connection> {
        function getEnvironment(env: any): any {
            if (!env) {
                return process.env;
            }
            let result: any = Object.create(null);
            Object.keys(process.env).forEach(key => result[key] = process.env[key]);
            Object.keys(env).forEach(key => result[key] = env[key]);
        }

        let errorHandler = (error: Error, message: Message, count: number) => {
            this.handleConnectionError(error, message, count);
        }

        let closeHandler = () => {
            this.handleConnectionClosed();
        }

        let server = this._serverOptions;
        // We got a function.
        if (_.isFunction(server)) {
            return server().then((result) => {
                let info = result as IStreamInfo;
                if (info.writer && info.reader) {
                    return new Connection(info.reader, info.writer, errorHandler, closeHandler);
                } else {
                    let cp = result as ChildProcess;
                    return new Connection(cp.stdout, cp.stdin, errorHandler, closeHandler);
                }
            });
        }
        let json: { command?: string; module?: string };
        let runDebug = <{ run: any; debug: any; }>server;
        if (c.isDefined(runDebug.run) || c.isDefined(runDebug.debug)) {
            // We are under debugging. So use debug as well.
            if (typeof v8debug === 'object' || this._forceDebug) {
                json = runDebug.debug;
            } else {
                json = runDebug.run;
            }
        } else {
            json = server;
        }
        if (c.isDefined(json.module)) {
            let node: INodeModule = <INodeModule>json;
            if (node.runtime) {
                let args: string[] = [];
                let options: IForkOptions = node.options || Object.create(null);
                if (options.execArgv) {
                    options.execArgv.forEach(element => args.push(element));
                }
                args.push(node.module);
                if (node.args) {
                    node.args.forEach(element => args.push(element));
                }
                let execOptions: IExecutableOptions = Object.create(null);
                execOptions.cwd = options.cwd || atom.project.getPaths()[0];
                execOptions.env = getEnvironment(options.env);
                if (node.transport === TransportKind.ipc) {
                    execOptions.stdio = [null, null, null, <any>'ipc'];
                }
                let process = spawn(node.runtime, args, execOptions);
                if (!process || !process.pid) {
                    return Promise.reject<Connection>(`Launching server using runtime ${node.runtime} failed.`);
                }
                this._childProcess = process;
                // A spawned process doesn't have ipc transport even if we spawn node. For now always use stdio communication.
                if (node.transport === TransportKind.ipc) {
                    process.stdout.on('data', (data: any) => this.outputChannel.append(data.toString()));
                    process.stderr.on('data', (data: any) => this.outputChannel.append(data.toString()));
                    return Promise.resolve(new Connection(new IPCMessageReader(process), new IPCMessageWriter(process), errorHandler, closeHandler));
                } else {
                    return Promise.resolve(new Connection(process.stdout, process.stdin, errorHandler, closeHandler));
                }
            } else {
                return new Promise<Connection>((resolve, reject) => {
                    let options: IForkOptions = node.options || Object.create(null);
                    options.execArgv = options.execArgv || [];
                    options.cwd = options.cwd || atom.project.getPaths()[0];
                    fork(node.module, node.args || [], options, (error, cp) => {
                        if (error) {
                            reject(error);
                        } else {
                            this._childProcess = cp;
                            if (node.transport === TransportKind.ipc) {
                                cp.stdout.on('data', (data: any) => {
                                    this.outputChannel.append(data.toString());
                                });
                                resolve(new Connection(new IPCMessageReader(this._childProcess), new IPCMessageWriter(this._childProcess), errorHandler, closeHandler));
                            } else {
                                resolve(new Connection(cp.stdout, cp.stdin, errorHandler, closeHandler));
                            }
                        }
                    });
                });
            }
        } else if (c.isDefined(json.command)) {
            let command: IExecutable = <IExecutable>json;
            let options = command.options || {};
            options.cwd = options.cwd || atom.project.getPaths()[0];
            let process = spawn(command.command, command.args, command.options);
            this._childProcess = process;
            return Promise.resolve(new Connection(process.stdout, process.stdin, errorHandler, closeHandler));
        }
        return Promise.reject<Connection>(new Error(`Unsupported server configuartion ` + JSON.stringify(server, null, 4)));
    }

    private handleConnectionClosed() {
        // Check whether this is a normal shutdown in progress or the client stopped normally.
        if (this._state === ClientState.Stopping || this._state === ClientState.Stopped) {
            return;
        }
        let action = this._languageOptions.errorHandler.closed();
        if (action === CloseAction.DoNotRestart) {
            this.logTrace('Connection to server got closed. Server will not be restarted.');
            this._state = ClientState.Stopped;
            this.cleanUp();
        } else if (action === CloseAction.Restart && this._state !== ClientState.Stopping) {
            this.logTrace('Connection to server got closed. Server will restart.');
            this.cleanUp(false);
            this._state = ClientState.Initial;
            this.start();
        }
    }

    private handleConnectionError(error: Error, message: Message, count: number) {
        let action = this._languageOptions.errorHandler.error(error, message, count);
        if (action === ErrorAction.Shutdown) {
            this.logTrace('Connection to server is erroring. Shutting down server.')
            this.stop();
        }
    }

    private checkProcessDied(childProcess: ChildProcess): void {
        setTimeout(() => {
            // Test if the process is still alive. Throws an exception if not
            try {
                process.kill(childProcess.pid, <any>0);
                terminate(childProcess);
            } catch (error) {
                // All is fine.
            }
        }, 2000);
    }

    // private hookConfigurationChanged(connection: Connection): void {
    //     if (!this._languageOptions.synchronize.configurationSection) {
    //         return;
    //     }
    //     Workspace.onDidChangeConfiguration(e => this.onDidChangeConfiguration(connection), this, this._listeners);
    //     this.onDidChangeConfiguration(connection);
    // }

    // private onDidChangeConfiguration(connection: Connection): void {
    //     let config = Workspace.getConfiguration(this._name.toLowerCase());
    //     if (config) {
    //         let trace = config.get('trace.server', 'off');
    //         this._trace = Trace.fromString(trace);
    //         connection.trace(this._trace, this._tracer);
    //     }
    //     let keys: string[] = [];
    //     let configurationSection = this._languageOptions.synchronize.configurationSection;
    //     if (_.isString(configurationSection)) {
    //         keys = [configurationSection];
    //     } else if (_.isArray(configurationSection)) {
    //         keys = configurationSection;
    //     }
    //     if (keys) {
    //         if (this.isConnectionActive()) {
    //             connection.didChangeConfiguration({ settings: this.extractSettingsInformation(keys) });
    //         }
    //     }
    // }

    // private extractSettingsInformation(keys: string[]): any {
    //     function ensurePath(config: any, path: string[]): any {
    //         let current = config;
    //         for (let i = 0; i < path.length - 1; i++) {
    //             let obj = current[path[i]];
    //             if (!obj) {
    //                 obj = Object.create(null);
    //                 current[path[i]] = obj;
    //             }
    //             current = obj;
    //         }
    //         return current;
    //     }
    //     let result = Object.create(null);
    //     for (let i = 0; i < keys.length; i++) {
    //         let key = keys[i];
    //         let index: number = key.indexOf('.');
    //         let config: any = null;
    //         if (index >= 0) {
    //             config = Workspace.getConfiguration(key.substr(0, index)).get(key.substr(index + 1));
    //         } else {
    //             config = Workspace.getConfiguration(key);
    //         }
    //         if (config) {
    //             let path = keys[i].split('.');
    //             ensurePath(result, path)[path[path.length - 1]] = config;
    //         }
    //     }
    //     return result;
    // }

    private hookFileEvents(connection: Connection): void {
        let fileEvents = this._languageOptions.synchronize.fileEvents;
        if (!fileEvents) {
            return;
        }
        let watchers: FSWatcher[];
        if (_.isArray(fileEvents)) {
            watchers = <FSWatcher[]>fileEvents;
        } else {
            watchers = [<FSWatcher>fileEvents];
        }
        if (!watchers) {
            return;
        }
        watchers.forEach(watcher => {
            const add = (path: string) => {
                this.notifyFileEvent({
                    uri: path,
                    type: FileChangeType.Created
                });
            };
            watcher.on('add', add);

            const change = (path: string) => {
                this.notifyFileEvent({
                    uri: path,
                    type: FileChangeType.Changed
                });
            };
            watcher.on('change', change)

            const unlink = (path: string) => {
                this.notifyFileEvent({
                    uri: path,
                    type: FileChangeType.Deleted
                });
            };
            watcher.on('unlink', unlink);

            this._listeners.add(
                () => watcher.removeListener('add', add),
                () => watcher.removeListener('change', change),
                () => watcher.removeListener('unlink', unlink)
            );
        })
    }

    private hookCapabilities(connection: Connection): void {
        let documentSelector = this._languageOptions.documentSelector;
        if (!documentSelector) {
            return;
        }
        // this.hookCompletionProvider(documentSelector, connection);
        // this.hookHoverProvider(documentSelector, connection);
        // this.hookSignatureHelpProvider(documentSelector, connection);
        // this.hookDefinitionProvider(documentSelector, connection);
        // this.hookReferencesProvider(documentSelector, connection);
        // this.hookDocumentHighlightProvider(documentSelector, connection);
        // this.hookDocumentSymbolProvider(documentSelector, connection);
        // this.hookWorkspaceSymbolProvider(connection);
        // this.hookCodeActionsProvider(documentSelector, connection);
        // this.hookCodeLensProvider(documentSelector, connection);
        // this.hookDocumentFormattingProvider(documentSelector, connection);
        // this.hookDocumentRangeFormattingProvider(documentSelector, connection);
        // this.hookDocumentOnTypeFormattingProvider(documentSelector, connection);
        // this.hookRenameProvider(documentSelector, connection);
    }

    // private hookCompletionProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.completionProvider) {
    //         return;
    //     }

    //     this._providers.push(Languages.registerCompletionItemProvider(documentSelector, {
    //         provideCompletionItems: (document: ILanguageClientTextEditor, position: VPosition, token: CancellationToken): Promise<VCompletionList | VCompletionItem[]> => {
    //             return this.doSendRequest(connection, CompletionRequest.type, a2p.toTextDocumentPositionParams(document, position), token).then(
    //                 p2a.fromCompletionResult,
    //                 error => Promise.resolve([])
    //             );
    //         },
    //         resolveCompletionItem: this._capabilites.completionProvider.resolveProvider
    //             ? (item: VCompletionItem, token: CancellationToken): Promise<VCompletionItem> => {
    //                 return this.doSendRequest(connection, CompletionResolveRequest.type, a2p.toCompletionItem(item), token).then(
    //                     p2a.fromCompletionItem,
    //                     error => Promise.resolve(item)
    //                 );
    //             }
    //             : undefined
    //     }, ...this._capabilites.completionProvider.triggerCharacters));
    // }

    // private hookHoverProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.hoverProvider) {
    //         return;
    //     }

    //     this._providers.push(Languages.registerHoverProvider(documentSelector, {
    //         provideHover: (document: ILanguageClientTextEditor, position: VPosition, token: CancellationToken): Promise<Hover> => {
    //             return this.doSendRequest(connection, HoverRequest.type, a2p.toTextDocumentPositionParams(document, position), token).then(
    //                 p2a.fromHover,
    //                 error => Promise.resolve(null)
    //             );
    //         }
    //     }));
    // }

    // private hookSignatureHelpProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.signatureHelpProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerSignatureHelpProvider(documentSelector, {
    //         provideSignatureHelp: (document: ILanguageClientTextEditor, position: VPosition, token: CancellationToken): Promise<VSignatureHelp> => {
    //             return this.doSendRequest(connection, SignatureHelpRequest.type, a2p.toTextDocumentPositionParams(document, position), token).then(
    //                 p2a.fromSignatureHelp,
    //                 error => Promise.resolve(null)
    //             );
    //         }
    //     }, ...this._capabilites.signatureHelpProvider.triggerCharacters));
    // }

    // private hookDefinitionProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.definitionProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerDefinitionProvider(documentSelector, {
    //         provideDefinition: (document: ILanguageClientTextEditor, position: VPosition, token: CancellationToken): Promise<VDefinition> => {
    //             return this.doSendRequest(connection, DefinitionRequest.type, a2p.toTextDocumentPositionParams(document, position), token).then(
    //                 p2a.fromDefinitionResult,
    //                 error => Promise.resolve(null)
    //             );
    //         }
    //     }))
    // }

    // private hookReferencesProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.referencesProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerReferenceProvider(documentSelector, {
    //         provideReferences: (document: ILanguageClientTextEditor, position: VPosition, options: { includeDeclaration: boolean; }, token: CancellationToken): Promise<VLocation[]> => {
    //             return this.doSendRequest(connection, ReferencesRequest.type, a2p.toReferenceParams(document, position, options), token).then(
    //                 p2a.fromReferences,
    //                 error => Promise.resolve([])
    //             );
    //         }
    //     }));
    // }

    // private hookDocumentHighlightProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.documentHighlightProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerDocumentHighlightProvider(documentSelector, {
    //         provideDocumentHighlights: (document: ILanguageClientTextEditor, position: VPosition, token: CancellationToken): Promise<VDocumentHighlight[]> => {
    //             return this.doSendRequest(connection, DocumentHighlightRequest.type, a2p.toTextDocumentPositionParams(document, position), token).then(
    //                 p2a.fromDocumentHighlights,
    //                 error => Promise.resolve([])
    //             );
    //         }
    //     }));
    // }

    // private hookDocumentSymbolProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.documentSymbolProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerDocumentSymbolProvider(documentSelector, {
    //         provideDocumentSymbols: (document: ILanguageClientTextEditor, token: CancellationToken): Promise<VSymbolInformation[]> => {
    //             return this.doSendRequest(connection, DocumentSymbolRequest.type, a2p.toDocumentSymbolParams(document), token).then(
    //                 p2a.fromSymbolInformations,
    //                 error => Promise.resolve([])
    //             );
    //         }
    //     }));
    // }

    // private hookWorkspaceSymbolProvider(connection: Connection): void {
    //     if (!this._capabilites.workspaceSymbolProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerWorkspaceSymbolProvider({
    //         provideWorkspaceSymbols: (query: string, token: CancellationToken): Promise<VSymbolInformation[]> => {
    //             return this.doSendRequest(connection, WorkspaceSymbolRequest.type, { query }, token).then(
    //                 p2a.fromSymbolInformations,
    //                 error => Promise.resolve([])
    //             );
    //         }
    //     }));
    // }

    // private hookCodeActionsProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.codeActionProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerCodeActionsProvider(documentSelector, {
    //         provideCodeActions: (document: ILanguageClientTextEditor, range: VRange, context: VCodeActionContext, token: CancellationToken): Promise<VCommand[]> => {
    //             let params: CodeActionParams = {
    //                 textDocument: a2p.toTextDocumentIdentifier(document),
    //                 range: a2p.toRange(range),
    //                 context: a2p.toCodeActionContext(context)
    //             };
    //             return this.doSendRequest(connection, CodeActionRequest.type, params, token).then(
    //                 p2a.fromCommands,
    //                 error => Promise.resolve([])
    //             );
    //         }
    //     }));
    // }

    // private hookCodeLensProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.codeLensProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerCodeLensProvider(documentSelector, {
    //         provideCodeLenses: (document: ILanguageClientTextEditor, token: CancellationToken): Promise<VCodeLens[]> => {
    //             return this.doSendRequest(connection, CodeLensRequest.type, a2p.toCodeLensParams(document), token).then(
    //                 p2a.fromCodeLenses,
    //                 error => Promise.resolve([])
    //             );
    //         },
    //         resolveCodeLens: (this._capabilites.codeLensProvider.resolveProvider)
    //             ? (codeLens: VCodeLens, token: CancellationToken): Promise<CodeLens> => {
    //                 return this.doSendRequest(connection, CodeLensResolveRequest.type, a2p.toCodeLens(codeLens), token).then(
    //                     p2a.fromCodeLens,
    //                     error => codeLens
    //                 );
    //             }
    //             : undefined
    //     }));
    // }

    // private hookDocumentFormattingProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.documentFormattingProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerDocumentFormattingEditProvider(documentSelector, {
    //         provideDocumentFormattingEdits: (document: ILanguageClientTextEditor, options: VFormattingOptions, token: CancellationToken): Promise<VTextEdit[]> => {
    //             let params: DocumentFormattingParams = {
    //                 textDocument: a2p.toTextDocumentIdentifier(document),
    //                 options: a2p.toFormattingOptions(options)
    //             };
    //             return this.doSendRequest(connection, DocumentFormattingRequest.type, params, token).then(
    //                 p2a.fromTextEdits,
    //                 error => Promise.resolve([])
    //             );
    //         }
    //     }));
    // }

    // private hookDocumentRangeFormattingProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.documentRangeFormattingProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerDocumentRangeFormattingEditProvider(documentSelector, {
    //         provideDocumentRangeFormattingEdits: (document: ILanguageClientTextEditor, range: VRange, options: VFormattingOptions, token: CancellationToken): Promise<VTextEdit[]> => {
    //             let params: DocumentRangeFormattingParams = {
    //                 textDocument: a2p.toTextDocumentIdentifier(document),
    //                 range: a2p.toRange(range),
    //                 options: a2p.toFormattingOptions(options)
    //             };
    //             return this.doSendRequest(connection, DocumentRangeFormattingRequest.type, params, token).then(
    //                 p2a.fromTextEdits,
    //                 error => Promise.resolve([])
    //             );
    //         }
    //     }));
    // }

    // private hookDocumentOnTypeFormattingProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.documentOnTypeFormattingProvider) {
    //         return;
    //     }
    //     let formatCapabilities = this._capabilites.documentOnTypeFormattingProvider;
    //     this._providers.push(Languages.registerOnTypeFormattingEditProvider(documentSelector, {
    //         provideOnTypeFormattingEdits: (document: ILanguageClientTextEditor, position: VPosition, ch: string, options: VFormattingOptions, token: CancellationToken): Promise<VTextEdit[]> => {
    //             let params: DocumentOnTypeFormattingParams = {
    //                 textDocument: a2p.toTextDocumentIdentifier(document),
    //                 position: a2p.toPosition(position),
    //                 ch: ch,
    //                 options: a2p.toFormattingOptions(options)
    //             };
    //             return this.doSendRequest(connection, DocumentOnTypeFormattingRequest.type, params, token).then(
    //                 p2a.fromTextEdits,
    //                 error => Promise.resolve([])
    //             );
    //         }
    //     }, formatCapabilities.firstTriggerCharacter, ...formatCapabilities.moreTriggerCharacter));
    // }

    // private hookRenameProvider(documentSelector: DocumentSelector, connection: Connection): void {
    //     if (!this._capabilites.renameProvider) {
    //         return;
    //     }
    //     this._providers.push(Languages.registerRenameProvider(documentSelector, {
    //         provideRenameEdits: (document: ILanguageClientTextEditor, position: VPosition, newName: string, token: CancellationToken): Promise<VWorkspaceEdit> => {
    //             let params: RenameParams = {
    //                 textDocument: a2p.toTextDocumentIdentifier(document),
    //                 position: a2p.toPosition(position),
    //                 newName: newName
    //             };
    //             return this.doSendRequest(connection, RenameRequest.type, params, token).then(
    //                 p2a.fromWorkspaceEdit,
    //                 (error: ResponseError<void>) => Promise.resolve(new Error(error.message))
    //             )
    //         }
    //     }));
    // }
}
