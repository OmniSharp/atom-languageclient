/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { /* NotificationType, */ RequestType } from 'vscode-jsonrpc';
import { CodeActionList, GetCodeActionsParams, Implementation, Methods, NavigateParams, Position, RunCodeActionParams, TextDocumentPositionParams, WorkspaceEdit } from './types-extended';

/**
 * A request to rename a symbol.
 */
export namespace GetCodeActionsRequest {
    export const type: RequestType<GetCodeActionsParams, CodeActionList, void> = { get method() { return Methods.Extended.GetCodeActionsRequest; } };
}

/**
 * A request to rename a symbol.
 */
export namespace RunCodeActionRequest {
    export const type: RequestType<RunCodeActionParams, WorkspaceEdit, void> = { get method() { return Methods.Extended.RunCodeActionRequest; } };
}

/**
 * A request to find implementation
 */
export namespace ImplementationRequest {
    export const type: RequestType<TextDocumentPositionParams, Implementation, void> = { get method() { return Methods.Extended.ImplementationRequest; } };
}

/**
 * A request to find implementation
 */
export namespace NavigateRequest {
    export const type: RequestType<NavigateParams, Position, void> = { get method() { return Methods.Extended.NavigateRequest; } };
}
