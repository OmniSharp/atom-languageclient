/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { GetCodeActions, IGetCodeActionsProvider, IGetCodeActionsService, ILanguageProtocolClient, ISyncExpression } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { GetCodeActionsRequest } from 'atom-languageservices/protocol-extended';
import { TextDocumentIdentifier } from 'vscode-languageserver-types';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { fromWorkspaceEdit, toRange } from './utils/convert';

@capability((capabilities) => !!capabilities.extended.getCodeActionsProvider)
export class GetCodeActionsProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _getCodeActionsService: IGetCodeActionsService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IGetCodeActionsService) finderService: IGetCodeActionsService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._getCodeActionsService = finderService;
        this._syncExpression = syncExpression;

        // TODO: Handle trigger characters
        const service = new GetCodeActionsProvider(client, syncExpression);
        this._disposable.add(service);
        this._getCodeActionsService.registerProvider(service);
    }
}

class GetCodeActionsProvider extends DisposableBase implements IGetCodeActionsProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    public constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(options: GetCodeActions.IRequest) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<GetCodeActions.IResponse[]>();
        }

        return this._client.sendRequest(GetCodeActionsRequest.type, {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            range: toRange(options.range),
            context: {}
        })
            .map(response => {
                return _.map(response.codeActions, action => {
                    return {
                        id: action.identifier,
                        name: action.name,
                        title: action.name
                    };
                });
            });
    }
}
