/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { Point, Range } from 'atom';
import { Autocomplete, Linter, Text } from 'atom-languageservices';
import { Position, Range as LsRange, TextDocumentIdentifier, TextEdit, WorkspaceEdit } from 'atom-languageservices/types';
import * as _toUri from 'file-url';
import { uriToFilePath as fromUri } from './uriToFilePath';
export { fromUri };

export function toUri(editor: Atom.TextEditor) {
    return _toUri(editor.getURI());
}

export function getLanguageId(editor: Atom.TextEditor) {
    return editor.getGrammar().name;
}

export function toPosition(value: TextBuffer.Point): Position {
    return Position.create(value.row, value.column);
}

export function fromPosition(value: Position): TextBuffer.Point {
    return new Point(value.line, value.character);
}

export function toRange(value: TextBuffer.Range): LsRange {
    return LsRange.create(toPosition(value.start), toPosition(value.end));
}

export function fromRange(value: LsRange): TextBuffer.Range {
    return new Range(fromPosition(value.start), fromPosition(value.end));
}

export function fromTextEdit(value: TextEdit): Text.IFileChange {
    return {
        range: fromRange(value.range),
        text: value.newText
    };
}

export function fromTextEdits(values: TextEdit[]): Text.IFileChange[] {
    return _.map(values, fromTextEdit);
}

export function fromWorkspaceEdit(edit: WorkspaceEdit): Text.IWorkspaceChange[] {
    return _.map(edit.changes, (edits, filePath) => {
        return ({
            changes: fromTextEdits(edits),
            filePath: fromUri(filePath)
        });
    });
}

export function toTextDocumentIdentifier(editor: Atom.TextEditor): TextDocumentIdentifier {
    return TextDocumentIdentifier.create(toUri(editor));
}

export function hasLinterText(message: any): message is Linter.TextMessage {
    return !!message.text;
}

export function getLinterText(message: Linter.Message) {
    if (!hasLinterText(message)) {
        return message.html;
    }
    return message.text;
}

export function hasCompletionText(message: any): message is Autocomplete.ITextSuggestion {
    return !!message.text;
}

export function getCompletionText(message: Autocomplete.Suggestion) {
    if (message.displayText) {
        return message.displayText;
    }
    if (!hasCompletionText(message)) {
        return message.snippet;
    }
    return message.text;
}

export function getCompletionReplacementText(message: Autocomplete.Suggestion) {
    if (!hasCompletionText(message)) {
        return message.snippet;
    }
    return message.text;
}

export const isDefined = _.negate(_.isUndefined);
