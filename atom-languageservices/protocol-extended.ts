import { TextDocumentPositionParams } from './protocol';
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { NotificationType,  RequestType } from 'vscode-jsonrpc';
import { CodeActionList, GetCodeActionsParams, Highlight, Implementation, Methods, NavigateParams, Position, PublishHighlightParams, RunCodeActionParams, WorkspaceEdit } from './types-extended';

/**
 * A request to rename a symbol.
 */
export namespace GetCodeActionsRequest {
    export const type = new RequestType<GetCodeActionsParams, CodeActionList, void, void>(Methods.Extended.GetCodeActionsRequest);
}

/**
 * A request to rename a symbol.
 */
export namespace RunCodeActionRequest {
    export const type = new RequestType<RunCodeActionParams, WorkspaceEdit, void, void>(Methods.Extended.RunCodeActionRequest);
}

/**
 * A request to find implementation
 */
export namespace ImplementationRequest {
    export const type = new RequestType<TextDocumentPositionParams, Implementation, void, void>(Methods.Extended.ImplementationRequest);
}

/**
 * A request to find implementation
 */
export namespace NavigateRequest {
    export const type = new RequestType<NavigateParams, Position, void, void>(Methods.Extended.NavigateRequest);
}

/**
 * Diagnostics notification are sent from the server to the client to signal
 * results of validation runs.
 */
export namespace HighlightNotification {
    export const type = new NotificationType<PublishHighlightParams, void>(Methods.Extended.PublishHighlightNotification);
}
