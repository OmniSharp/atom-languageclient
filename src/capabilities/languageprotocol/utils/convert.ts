/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import * as toUri from 'file-url';
import { Position, Range, TextDocumentIdentifier } from 'vscode-languageserver-types';

export function getUri(editor: Atom.TextEditor) {
    return toUri(editor.getURI());
}

export function getLanguageId(editor: Atom.TextEditor) {
    return editor.getGrammar().name;
}

export function toPosition(value: TextBuffer.Point): Position {
    return Position.create(value.row, value.column);
}

export function toRange(value: TextBuffer.Range): Range {
    return Range.create(toPosition(value.start), toPosition(value.end));
}

export function toTextDocumentIdentifier(editor: Atom.TextEditor): TextDocumentIdentifier {
    return TextDocumentIdentifier.create(getUri(editor));
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

export function hasCompletionText(message: any): message is Autocomplete.TextSuggestion {
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
