/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { capability, inject } from '../services/_decorators';
import { ILanguageProtocolClient, IRenameProvider, IRenameService, ISyncExpression } from '../services/_public';
import { fromWorkspaceEdit, toPosition } from './utils/convert';
import { TextDocumentIdentifier } from '../vscode-languageserver-types';
import { RenameParams, RenameRequest } from '../vscode-protocol';

@capability
export class LanguageProtocolRename extends DisposableBase {
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
        // TODO: Handle trigger characters
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

    public request(options: Rename.RequestOptions) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<Text.WorkspaceChange[]>();
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
