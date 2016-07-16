/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:variable-name no-any */
import { IResolver } from './IResolver';
/**
 * Symbol for the internal LanguageService
 */
export const ILanguageService = Symbol.for('ILanguageService');
/**
 * Defines the interface for consuming this service
 * http://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/
 */
export interface ILanguageService {
    resolver: IResolver;
}
