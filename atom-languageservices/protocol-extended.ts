/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { /* NotificationType, */ RequestType } from 'vscode-jsonrpc';
import { CodeActionList, GetCodeActionsParams, Methods, RunCodeActionParams, WorkspaceEdit } from './types-extended';

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
