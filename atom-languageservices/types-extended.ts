/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 *    Adds extended endpoints for the protocol to implement!
 */

/* tslint:disable */
import { CodeActionContext, CodeActionParams, Range, ServerCapabilities as BaseServerCapabilities, TextDocumentIdentifier } from './types';
export * from './types';

export interface ServerCapabilities extends BaseServerCapabilities {
    extended: {
        getCodeActionsProvider?: boolean;
        runCodeActionProvider?: boolean;
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
    }
}
