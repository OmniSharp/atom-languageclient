/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
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
}
