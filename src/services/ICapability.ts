/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { ILanguageProtocolClient } from './ILanguageProtocolClient';
/* tslint:disable:variable-name no-any */

/**
 * Defines the interface of a Capability
 *
 * A capability is a class that implements a set of logic for a certian client
 *   - Language Protocol based clients
 *   - OmniSharp based clients
 */
export interface ICapability {
    isSupported?: (client: ILanguageProtocolClient) => boolean;
}
