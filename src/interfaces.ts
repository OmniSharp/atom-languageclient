/**
 *
 *
 */
import { FSWatcher } from 'fs';
import { IDisposable } from 'ts-disposables';
import { CompletionItem, CompletionList, ServerCapabilities, TextDocumentPositionParams } from './vscode-languageserver-types';
// import { ServerCapabilities} from './vscode-protocol';
/* tslint:disable:no-any */
/**
 * A generic interface for resolving instaneces from the DI container
 */
export interface IResolver {
    resolve<T>(key: T): T;
    resolve<T>(key: any): T;
    resolveAll<T>(key: any): T[];
    registerFolder(...paths: string[]): Promise<this>;
    registerInstance(key: any, instance: any): this;
    registerSingleton(key: any, fn: Function): this;
    registerTransient(key: any, fn: Function): this;
    registerAlias(originalKey: any, aliasKey: any): this;
    autoRegister(fn: Function): this;
    autoRegister(key: string | symbol | Object, fn: Function): this;
}

export interface ICapability {
    isSupported?: (client: ILanguageProtocolClient) => boolean;
}

/**
 * Defines the interface for consuming this service
 * http://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/
 */
export interface ILanguageService {
    resolver: IResolver;
}

export interface IProjectProvider {
    getPaths: typeof atom.project.getPaths;
    onDidChangePaths: (callback: (paths: string[]) => void) => IDisposable;
}

/**
 * Defines the interface for providing a language to be consumed
 * http://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/
 */
export interface ILanguageProvider extends IDisposable {
    onDidDispose(cb: () => void): IDisposable;
}

export interface ILanguageProtocolClient {
    readonly capabilities: ServerCapabilities;
    readonly state: ClientState;
}

export interface IAutocompleteService {
    registerProvider(provider: IAutocompleteProvider): IDisposable;
}

export interface IAutocompleteProvider extends IDisposable {
    request(params: TextDocumentPositionParams): Promise<CompletionItem[] | CompletionList>;
    dispose(): void;
}

export enum ClientState {
    Initial,
    Starting,
    Running,
    Stopping,
    Stopped
}

export interface ISynchronizeOptions {
    configurationSection?: string | string[];
    fileEvents?: FSWatcher | FSWatcher[];
    textDocumentFilter?: (textDocument: TextDocument) => boolean;
}

export interface ILanguageClientOptions {
    documentSelector?: string | string[];
    grammarName?: string | string[];
    synchronize?: ISynchronizeOptions;
    diagnosticCollectionName?: string;
    outputChannelName?: string;
    initializationOptions?: any;
    errorHandler?: IErrorHandler;
}

/**
 * An action to be performed when the connection is producing errors.
 */
export enum ErrorAction {
    /**
     * Continue running the server.
     */
    Continue = 1,
    /**
     * Shutdown the server.
     */
    Shutdown = 2
}

/**
 * An action to be performed when the connection to a server got closed.
 */
export enum CloseAction {
    /**
     * Don't restart the server. The connection stays closed.
     */
    DoNotRestart = 1,
    /**
     * Restart the server.
     */
    Restart = 2,
}


/**
 * A pluggable error handler that is invoked when the connection is either
 * producing errors or got closed.
 */
export interface IErrorHandler {
    /**
     * An error has occurred while writing or reading from the connection.
     *
     * @param error - the error received
     * @param message - the message to be delivered to the server if know.
     * @param count - a count indicating how often an error is received. Will
     *  be reset if a message got successfully send or received.
     */
    error(error: Error, message: Message, count: number): ErrorAction;

    /**
     * The connection to the server got closed.
     */
    closed(): CloseAction;
}
