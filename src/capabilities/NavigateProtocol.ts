/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { ILanguageProtocolClient, INavigateProvider, INavigateService, ISyncExpression, Navigate } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { NavigateRequest } from 'atom-languageservices/protocol-extended';
import { NavigateParams, Position, TextDocumentIdentifier  } from 'atom-languageservices/types-extended';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { fromPosition } from './utils/convert';

@capability((capabilities) => !!capabilities.extended.navigateProvider)
export class NavigateProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _navigateService: INavigateService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(INavigateService) navigateService: INavigateService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
        this._navigateService = navigateService;

        const service = new LanguageProtocolNavigateProvider(this._client, this._syncExpression);
        this._disposable.add(
            service,
            this._navigateService.registerProvider(service)
        );
    }
}

class LanguageProtocolNavigateProvider extends DisposableBase implements INavigateProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(options: Navigate.IRequest) {
        if (!this._syncExpression.evaluate(options.editor)) {
            /* tslint:disable-next-line:no-any */
            return Observable.empty<any>();
        }

        const params: NavigateParams = {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor!.getURI())),
            position: Position.create(options.location.row, options.location.column),
            direction: options.direction
        };
        return this._client.sendRequest(NavigateRequest.type, params)
            .map(response => {
                return fromPosition(response);
            });
    }
}
