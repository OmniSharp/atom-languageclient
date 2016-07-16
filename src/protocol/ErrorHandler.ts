/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Message } from 'vscode-jsonrpc';
import { CloseAction, ErrorAction, IErrorHandler } from '../services/_public';

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
