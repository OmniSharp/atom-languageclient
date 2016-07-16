/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { FSWatcher } from 'fs';
import { Message } from 'vscode-jsonrpc';
/* tslint:disable:variable-name no-any */

/**
 * Symbol for the public api of the LanguageProtocolClientOptions
 */
export const ILanguageProtocolClientOptions = Symbol.for('ILanguageProtocolClientOptions');
export interface ILanguageProtocolClientOptions {
    documentSelector?: string | string[];
    synchronize?: ISynchronizeOptions;
    diagnosticCollectionName?: string;
    outputChannelName?: string;
    initializationOptions?: any;
    errorHandler?: IErrorHandler;
}

export interface ISynchronizeOptions {
    configurationSection?: string | string[];
    fileEvents?: FSWatcher | FSWatcher[];
    textDocumentFilter?: (textDocument: Atom.TextEditor) => boolean;
    extensionSelector?: string | string[];
    grammarScopeSelector?: string | string[];
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

export enum ClientState {
    Initial,
    Starting,
    Running,
    Stopping,
    Stopped
}
