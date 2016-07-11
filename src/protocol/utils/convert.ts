/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { ILanguageClientTextEditor } from '../../omni/ILanguageClientTextEditor';

export function getUri(editor: ILanguageClientTextEditor) {
    return editor.getURI();
}

export function getLanguageId(editor: ILanguageClientTextEditor) {
    return editor.languageclient.languageId;
}

export function getVersion(editor: ILanguageClientTextEditor) {
    return editor.languageclient.version;
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

export function setIfDefined(value: any, func: () => void): void {
    if (isDefined(value)) {
        func();
    }
}
