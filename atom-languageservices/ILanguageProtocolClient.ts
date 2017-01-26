import { ServerCapabilities } from './protocol';
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import {
    NotificationHandler, NotificationType, RequestHandler, RequestType,
    RequestType0, RequestType1, RequestType2, RequestType3, RequestType4, RequestType5, RequestType6, RequestType7, RequestType8, RequestType9, RequestMessage, RequestHandler0,
    CancellationToken, MessageType as RPCMessageType, GenericNotificationHandler,
    NotificationType0, NotificationType1, NotificationType2, NotificationType3, GenericRequestHandler, NotificationHandler0, NotificationHandler1
} from 'vscode-jsonrpc';
import { ClientState, ILanguageProtocolClientOptions } from './ILanguageProtocolClientOptions';
/* tslint:disable:variable-name no-any */

/**
 * Symbol for the public api of the LanguageProtocolClient
 */
export const ILanguageProtocolClient = Symbol.for('ILanguageProtocolClient');
export interface ILanguageProtocolClient {
    readonly capabilities: ServerCapabilities;
    readonly state: ClientState;
    readonly options: ILanguageProtocolClientOptions;
    readonly name: string;
    readonly rootPath: string;

    sendRequest<R, E, RO>(type: RequestType0<R, E, RO>): Observable<R>;
    sendRequest<P, R, E, RO>(type: RequestType<P, R, E, RO>, params: P): Observable<R>;
    sendRequest<R>(method: string): Observable<R>;
    sendRequest<R>(method: string, param: any): Observable<R>;
    sendRequest<R>(type: string | RPCMessageType, ...params: any[]): Observable<R>;

    onRequest<R, E, RO>(type: RequestType0<R, E, RO>, handler: RequestHandler0<R, E>): void;
    onRequest<P, R, E, RO>(type: RequestType<P, R, E, RO>, handler: RequestHandler<P, R, E>): void;
    onRequest<R, E>(method: string, handler: GenericRequestHandler<R, E>): void;
    onRequest<R, E>(method: string | RPCMessageType, handler: GenericRequestHandler<R, E>): void;

    sendNotification<RO>(type: NotificationType0<RO>): void;
    sendNotification<P, RO>(type: NotificationType<P, RO>, params?: P): void;
    sendNotification(method: string): void;
    sendNotification(method: string, params: any): void;
    sendNotification(method: string | RPCMessageType, params?: any): void;

    onNotification<RO>(type: NotificationType0<RO>, handler: NotificationHandler0): void;
    onNotification<P, RO>(type: NotificationType<P, RO>, handler: NotificationHandler<P>): void;
    onNotification(method: string, handler: GenericNotificationHandler): void;
    onNotification(method: string | RPCMessageType, handler: GenericNotificationHandler): void;
}
