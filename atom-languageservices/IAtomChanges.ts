/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:variable-name */
import { Text } from './Text';
export const IAtomChanges = Symbol.for('IAtomChanges');
export interface IAtomChanges {
    applyChanges(editor: Atom.TextEditor, buffer: string): void;
    applyChanges(editor: Atom.TextEditor, changes: Text.IFileChange[]): void;
    applyWorkspaceChanges(changes: Text.IWorkspaceChange[]): void;
}
