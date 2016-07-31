/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 *    Adds extended endpoints for the protocol to implement!
 */

/* tslint:disable */
import { CodeActionContext, CodeActionParams, ServerCapabilities, TextDocumentIdentifier } from './types';
export * from './types';

export interface ServerCapabilities {
    extended: {
        serverCodeActionProvider?: ServerCodeActionOptions;
    }
}

export interface ServerCodeActionOptions {
    resolver?: boolean;
}

export interface GetCodeActionParams {
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

export interface RunCodeActionParams extends GetCodeActionParams {
    /**
     * The identifier of the code action to execute
     */
    identifier: number;
}

export namespace Methods {
    export namespace Extended {
        export const GetCodeActionRequest = '__extended/textDocument/getCodeAction'
        export const RunCodeActionRequest = '__extended/textDocument/runCodeAction'
    }
}
