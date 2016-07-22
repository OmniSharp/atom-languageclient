/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:variable-name */
export type AtomNavigationLocation = { filePath: string; range: TextBuffer.Range; };

export const IAtomNavigation = Symbol.for('IAtomNavigation');
export interface IAtomNavigation {
    navigateTo(context: AtomNavigationLocation): void;
}
