/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:variable-name no-any */

/**
 * Symbol for the internal Linter Service
 */
export const ILinterService = Symbol.for('ILinterService');
export interface ILinterService {
    getLinter(name: string): Linter.IndieLinter;
}
