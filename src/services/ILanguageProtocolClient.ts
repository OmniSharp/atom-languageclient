/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { CancellationToken, NotificationHandler, NotificationType, RequestHandler, RequestType } from 'vscode-jsonrpc';
import { ServerCapabilities } from '../vscode-languageserver-types';
import { ClientState } from './ILanguageProtocolClientOptions';
/* tslint:disable:variable-name no-any */

/**
 * Symbol for the public api of the LanguageProtocolClient
 */
export const ILanguageProtocolClient = Symbol.for('ILanguageProtocolClient');
export interface ILanguageProtocolClient {
    readonly capabilities: ServerCapabilities;
    readonly state: ClientState;

    sendRequest<P, R, E>(type: RequestType<P, R, E>, params: P, token?: CancellationToken): Promise<R>;
    sendNotification<P>(type: NotificationType<P>): void;
    sendNotification<P>(type: NotificationType<P>, params: P): void;
    onNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>): void;
    onRequest<P, R, E>(type: RequestType<P, R, E>, handler: RequestHandler<P, R, E>): void;
}
