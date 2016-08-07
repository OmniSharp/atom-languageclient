/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 *    Adds extended endpoints for the protocol to implement!
 */

/* tslint:disable */
import { CodeActionContext, CodeActionParams, Location, Range, ServerCapabilities as BaseServerCapabilities, TextDocumentIdentifier, TextDocumentPositionParams } from './types';
export * from './types';

export interface ServerCapabilities extends BaseServerCapabilities {
    extended: {
        getCodeActionsProvider?: boolean;
        runCodeActionProvider?: boolean;
        implementationProvider?: boolean;
        navigateProvider?: boolean;
        highlightProvider?: boolean;
    }
}

export interface GetCodeActionsParams {
    /**
     * The document in which the command was invoked.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The range for which the command was invoked.
     */
    range: Range;

    /**
     * Context carrying additional information.
     */
    context: CodeActionContext;
}

export interface CodeActionList {
    codeActions: CodeAction[];
}

export interface CodeAction {
    name: string;
    identifier: string;
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

export interface PublishHighlightParams {
    uri: string;
    highlights: Highlight[];
}

export interface Highlight {
    range: Range;
    kind: string;
    // projects: string[];
}

export type Implementation = Location | Location[];

export interface NavigateParams extends TextDocumentPositionParams{
    direction: 'up' | 'down';
}

export interface RunCodeActionParams extends GetCodeActionsParams {
    /**
     * The identifier of the code action to execute
     */
    identifier: string;
}

export namespace Methods {
    export namespace Extended {
        export const GetCodeActionsRequest = '__extended/textDocument/getCodeActions'
        export const RunCodeActionRequest = '__extended/textDocument/runCodeAction'
        export const ImplementationRequest = '__extended/textDocument/implementation'
        export const NavigateRequest = '__extended/textDocument/navigate'
        export const PublishHighlightNotification = '__extended/textDocument/publishHighlight'
    }
}
