/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { LanguageClientTextEditorContext } from './LanguageClientTextEditorContext';

export interface ILanguageClientTextEditor extends Atom.TextEditor {
    languageclient: LanguageClientTextEditorContext;
}

/* tslint:disable:no-any */
export function isLanguageClientTextEditor(editor: any): editor is ILanguageClientTextEditor { return editor && !!(<any>editor).omni; }
