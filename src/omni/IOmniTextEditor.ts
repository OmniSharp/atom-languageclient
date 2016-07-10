/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { OmniTextEditorContext } from './OmniTextEditorContext';

export interface IOmniTextEditor extends Atom.TextEditor {
    omni: OmniTextEditorContext | null;
}

/* tslint:disable:no-any */
export function isOmniTextEditor(editor: any): editor is IOmniTextEditor { return editor && !!(<any>editor).omni; }
