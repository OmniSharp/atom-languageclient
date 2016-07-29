/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
/* tslint:disable:variable-name */
export const IAtomTextEditorSource = Symbol.for('IAtomTextEditorSource');
export interface IAtomTextEditorSource {
    readonly activeTextEditor: Atom.TextEditor;
    readonly textEditors: Atom.TextEditor[];
    observeActiveTextEditor: Observable<Atom.TextEditor | null>;
    observeTextEditors: Observable<Atom.TextEditor>;
}
