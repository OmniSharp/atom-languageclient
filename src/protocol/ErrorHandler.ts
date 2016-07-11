/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Message } from 'vscode-jsonrpc';

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

export class DefaultErrorHandler implements IErrorHandler {
    private name: string;
    private restarts: number[];

    constructor(name: string) {
        this.name = name;
        this.restarts = [];
    }

    public error(error: Error, message: Message, count: number): ErrorAction {
        if (count && count <= 3) {
            return ErrorAction.Continue;
        }
        return ErrorAction.Shutdown;
    }
    public closed(): CloseAction {
        this.restarts.push(Date.now());
        if (this.restarts.length < 5) {
            return CloseAction.Restart;
        } else {
            const diff = this.restarts[this.restarts.length - 1] - this.restarts[0];
            if (diff <= 3 * 60 * 1000) {
                atom.notifications.addError(`The ${this.name} server crashed 5 times in the last 3 minutes. The server will not be restarted.`);
                return CloseAction.DoNotRestart;
            } else {
                this.restarts.shift();
                return CloseAction.Restart;
            }
        }
    }
}
