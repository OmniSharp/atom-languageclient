/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { ILanguageProtocolClient, IRunCodeActionProvider, IRunCodeActionService, ISyncExpression, RunCodeAction, Text } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { RunCodeActionRequest } from 'atom-languageservices/protocol-extended';
import { RunCodeActionParams, TextDocumentIdentifier } from 'atom-languageservices/types-extended';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { fromWorkspaceEdit, toRange } from './utils/convert';
import { DocumentSyncProtocol } from './DocumentSyncProtocol';

@capability
export class RunCodeActionProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _runCodeActionService: IRunCodeActionService;
    private _documentSyncProtocol: DocumentSyncProtocol;

    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IRunCodeActionService) finderService: IRunCodeActionService,
        @inject(ISyncExpression) syncExpression: ISyncExpression,
        documentSyncProtocol: DocumentSyncProtocol
    ) {
        super();
        this._client = client;
        this._runCodeActionService = finderService;
        this._syncExpression = syncExpression;
        this._documentSyncProtocol = documentSyncProtocol;

        if (!this._client.capabilities.extended.getCodeActionsProvider) {
            return;
        }
        const service = new RunCodeActionProvider(client, syncExpression, documentSyncProtocol);
        this._disposable.add(service);
        this._runCodeActionService.registerProvider(service);
    }
}

class RunCodeActionProvider extends DisposableBase implements IRunCodeActionProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _documentSyncProtocol: DocumentSyncProtocol;
    public constructor(client: ILanguageProtocolClient, syncExpression: ISyncExpression, documentSyncProtocol: DocumentSyncProtocol) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
        this._documentSyncProtocol = documentSyncProtocol;
    }

    public request(options: RunCodeAction.IRequest) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<Text.IWorkspaceChange[]>();
        }

        const params: RunCodeActionParams = {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            range: toRange(options.range),
            identifier: options.identifier,
            context: options.context
        };

        return Observable.fromPromise(this._client.sendRequest(RunCodeActionRequest.type, params))
            .map(fromWorkspaceEdit);
    }
}
