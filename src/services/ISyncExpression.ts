/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:variable-name no-any */

/**
 * Symbol for the sync expression for the given client
 */
export const ISyncExpression = Symbol.for('ISyncExpression');
export interface ISyncExpression {
    evaluate(editor: Atom.TextEditor): boolean;
}
