/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:variable-name no-any */
export const IAtomViewFinder = Symbol.for('IAtomViewFinder');
export interface IAtomViewFinder {
    getView(item: any): HTMLElement;
}
