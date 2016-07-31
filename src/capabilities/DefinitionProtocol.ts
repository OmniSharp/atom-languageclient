/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Definition, IDefinitionProvider, IDefinitionService, ILanguageProtocolClient, ISyncExpression } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { DefinitionRequest } from 'atom-languageservices/protocol';
import { Position, TextDocumentIdentifier, TextDocumentPositionParams } from 'atom-languageservices/types';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { fromRange, fromUri } from './utils/convert';

@capability
export class DefinitionProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _definitionService: IDefinitionService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IDefinitionService) definitionService: IDefinitionService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
        this._definitionService = definitionService;
        if (!client.capabilities.definitionProvider) {
            return;
        }

        const service = new LanguageProtocolDefinitionProvider(this._client, this._syncExpression);
        this._disposable.add(service);
        this._definitionService.registerProvider(service);
    }
}

class LanguageProtocolDefinitionProvider extends DisposableBase implements IDefinitionProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(options: Definition.IRequest) {
        if (!this._syncExpression.evaluate(options.editor)) {
            /* tslint:disable-next-line:no-any */
            return Observable.empty<any>();
        }

        const params: TextDocumentPositionParams = {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor!.getURI())),
            position: Position.create(options.location.row, options.location.column)
        };
        return Observable.fromPromise(this._client.sendRequest(DefinitionRequest.type, params))
            .map(response => {
                if (_.isArray(response)) {
                    return _.map(response, location => {
                        return {
                            filePath: fromUri(location.uri),
                            range: fromRange(location.range)
                        };
                    });
                } else {
                    return [{
                        filePath: fromUri(response.uri),
                        range: fromRange(response.range)
                    }];
                }
            });
    }
}
