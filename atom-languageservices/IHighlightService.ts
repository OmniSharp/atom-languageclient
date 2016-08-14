/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IHighlightService = Symbol.for('IHighlightService');
export interface IHighlightService {
    getHighlighter(): Highlight.Highlighter;
}

export enum HighlightClassification {
    Name = 1,
    Comment = 2,
    String = 3,
    Operator = 4,
    Punctuation = 5,
    Keyword = 6,
    Number = 7,
    Identifier = 8,
    PreprocessorKeyword = 9,
    ExcludedCode = 10
}

export namespace Highlight {
    export interface Item {
        id: string;
        range: TextBuffer.Range;
        kind: string;
    }

    export interface Highlighter {
        updateHighlights(editor: Atom.TextEditor, added: Item[], removed: string[]): void;
        dispose(): void;
    }
}
