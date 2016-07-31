/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { ILanguageProtocolClient, IRenameProvider, IRenameService, ISyncExpression, Rename, Text } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { RenameRequest } from 'atom-languageservices/protocol';
import { RenameParams, TextDocumentIdentifier } from 'atom-languageservices/types';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { fromWorkspaceEdit, toPosition } from './utils/convert';

@capability
export class RenameProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _renameService: IRenameService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IRenameService) finderService: IRenameService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._renameService = finderService;
        this._syncExpression = syncExpression;

        if (!this._client.capabilities.renameProvider) {
            return;
        }
        const service = new RenameProvider(client, syncExpression);
        this._disposable.add(service);
        this._renameService.registerProvider(service);
    }
}

class RenameProvider extends DisposableBase implements IRenameProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    public constructor(client: ILanguageProtocolClient, syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(options: Rename.IRequest) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<Text.IWorkspaceChange[]>();
        }

        const params: RenameParams = {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            position: toPosition(options.location),
            newName: options.word
        };

        return Observable.fromPromise(this._client.sendRequest(RenameRequest.type, params))
            .map(fromWorkspaceEdit);
    }
}
