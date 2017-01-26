/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable */

export namespace Methods {
    /**
     * The initialize method is sent from the client to the server.
     * It is send once as the first method after starting up the
     * worker. The requests parameter is of type [InitializeParams](#InitializeParams)
     * the response if of type [InitializeResult](#InitializeResult) of a Thenable that
     * resolves to such.
     */
    export const InitializeRequest = 'initialize';

    //---- Shutdown Method ----

    /**
     * A shutdown request is sent from the client to the server.
     * It is send once when the client descides to shutdown the
     * server. The only notification that is sent after a shudown request
     * is the exit event.
     */
    export const ShutdownRequest = 'shutdown';

    //---- Exit Notification ----

    /**
     * The exit event is sent from the client to the server to
     * ask the server to exit its process.
     */
    export const ExitNotification = 'exit';

    //---- Configuration notification ----

    /**
     * The configuration change notification is sent from the client to the server
     * when the client's configuration has changed. The notification contains
     * the changed configuration as defined by the language client.
     */
    export const DidChangeConfigurationNotification = 'workspace/didChangeConfiguration';

    /**
     * The show message notification is sent from a server to a client to ask
     * the client to display a particular message in the user interface.
     */
    export const ShowMessageNotification = 'window/showMessage';

    /**
     * The show message request is send from the server to the clinet to show a message
     * and a set of options actions to the user.
     */
    export const ShowMessageRequest = 'window/showMessageRequest';

    /**
     * The log message notification is send from the server to the client to ask
     * the client to log a particular message.
     */
    export const LogMessageNotification = 'window/logMessage';

    //---- Telemetry notification

    /**
     * The telemetry event notification is send from the server to the client to ask
     * the client to log telemetry data.
     */
    export const TelemetryEventNotification = 'telemetry/event';

    /**
     * The document open notification is sent from the client to the server to signal
     * newly opened text documents. The document's truth is now managed by the client
     * and the server must not try to read the document's truth using the document's
     * uri.
     */
    export const DidOpenTextDocumentNotification = 'textDocument/didOpen';

    /**
     * The document change notification is sent from the client to the server to signal
     * changes to a text document.
     */
    export const DidChangeTextDocumentNotification = 'textDocument/didChange';

    /**
     * The document close notification is sent from the client to the server when
     * the document got closed in the client. The document's truth now exists
     * where the document's uri points to (e.g. if the document's uri is a file uri
     * the truth now exists on disk).
     */
    export const DidCloseTextDocumentNotification = 'textDocument/didClose';

    /**
     * The document save notification is sent from the client to the server when
     * the document got saved in the client.
     */
    export const DidSaveTextDocumentNotification = 'textDocument/didSave';

    //---- File eventing ----

    /**
     * The watched files notification is sent from the client to the server when
     * the client detects changes to file watched by the lanaguage client.
     */
    export const DidChangeWatchedFilesNotification = 'workspace/didChangeWatchedFiles';

    //---- Diagnostic notification ----

    /**
     * Diagnostics notification are sent from the server to the client to signal
     * results of validation runs.
     */
    export const PublishDiagnosticsNotification = 'textDocument/publishDiagnostics';

    //---- Completion Support --------------------------

    /**
     * Request to request completion at a given text document position. The request's
     * parameter is of type [TextDocumentPosition](#TextDocumentPosition) the response
     * is of type [CompletionItem[]](#CompletionItem) or [CompletionList](#CompletionList)
     * or a Thenable that resolves to such.
     */
    export const CompletionRequest = 'textDocument/completion';

    /**
     * Request to resolve additional information for a given completion item.The request's
     * parameter is of type [CompletionItem](#CompletionItem) the response
     * is of type [CompletionItem](#CompletionItem) or a Thenable that resolves to such.
     */
    export const CompletionResolveRequest = 'completionItem/resolve';

    /**
     * Request to request hover information at a given text document position. The request's
     * parameter is of type [TextDocumentPosition](#TextDocumentPosition) the response is of
     * type [Hover](#Hover) or a Thenable that resolves to such.
     */
    export const HoverRequest = 'textDocument/hover';

    //---- SignatureHelp ----------------------------------

    export const SignatureHelpRequest = 'textDocument/signatureHelp';

    //---- Goto Definition -------------------------------------

    /**
     * A request to resolve the defintion location of a symbol at a given text
     * document position. The request's parameter is of type [TextDocumentPosition]
     * (#TextDocumentPosition) the response is of type [Definition](#Definition) or a
     * Thenable that resolves to such.
     */
    export const DefinitionRequest = 'textDocument/definition';

    /**
     * A request to resolve project-wide references for the symbol denoted
     * by the given text document position. The request's parameter is of
     * type [ReferenceParams](#ReferenceParams) the response is of type
     * [Location[]](#Location) or a Thenable that resolves to such.
     */
    export const ReferencesRequest = 'textDocument/references';

    //---- Document Highlight ----------------------------------

    /**
     * Request to resolve a [DocumentHighlight](#DocumentHighlight) for a given
     * text document position. The request's parameter is of type [TextDocumentPosition]
     * (#TextDocumentPosition) the request reponse is of type [DocumentHighlight[]]
     * (#DocumentHighlight) or a Thenable that resolves to such.
     */
    export const DocumentHighlightRequest = 'textDocument/documentHighlight';

    //---- Document Symbol Provider ---------------------------

    /**
     * A request to list all symbols found in a given text document. The request's
     * parameter is of type [TextDocumentIdentifier](#TextDocumentIdentifier) the
     * response is of type [SymbolInformation[]](#SymbolInformation) or a Thenable
     * that resolves to such.
     */
    export const DocumentSymbolRequest = 'textDocument/documentSymbol';

    //---- Workspace Symbol Provider ---------------------------

    /**
     * A request to list project-wide symbols matching the query string given
     * by the [WorkspaceSymbolParams](#WorkspaceSymbolParams). The response is
     * of type [SymbolInformation[]](#SymbolInformation) or a Thenable that
     * resolves to such.
     */
    export const WorkspaceSymbolRequest = 'workspace/symbol';

    /**
     * A request to provide commands for the given text document and range.
     */
    export const CodeActionRequest = 'textDocument/codeAction';

    /**
     * A request to provide code lens for the given text document.
     */
    export const CodeLensRequest = 'textDocument/codeLens';

    /**
     * A request to resolve a command for a given code lens.
     */
    export const CodeLensResolveRequest = 'codeLens/resolve';

    /**
     * A request to to format a whole document.
     */
    export const DocumentFormattingRequest = 'textDocument/formatting';

    /**
     * A request to to format a range in a document.
     */
    export const DocumentRangeFormattingRequest = 'textDocument/rangeFormatting';

    /**
     * A request to format a document on type.
     */
    export const DocumentOnTypeFormattingRequest = 'textDocument/onTypeFormatting';

    /**
     * A request to rename a symbol.
     */
    export const RenameRequest = 'textDocument/rename';
}
