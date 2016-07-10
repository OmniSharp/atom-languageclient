/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { OmniTextEditorContext } from './OmniTextEditorContext';

export interface IAseTextEditor extends Atom.TextEditor {
    omni: OmniTextEditorContext | null;
}

/* tslint:disable:no-any */
export function isAseTextEditor(editor: any): editor is IAseTextEditor { return editor && !!(<any>editor).omnisharp; }
