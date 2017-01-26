import { TextDocumentPositionParams } from '../../atom-languageservices/protocol';
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { IImplementationProvider, IImplementationService, ILanguageProtocolClient, ISyncExpression, Implementation } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { ImplementationRequest } from 'atom-languageservices/protocol-extended';
import { Position, TextDocumentIdentifier } from 'vscode-languageserver-types';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { fromRange, fromUri } from './utils/convert';

@capability((capabilities) => !!capabilities.extended.implementationProvider)
export class ImplementationProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _implementationService: IImplementationService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IImplementationService) implementationService: IImplementationService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
        this._implementationService = implementationService;

        const service = new LanguageProtocolImplementationProvider(this._client, this._syncExpression);
        this._disposable.add(
            service,
            this._implementationService.registerProvider(service)
        );
    }
}

class LanguageProtocolImplementationProvider extends DisposableBase implements IImplementationProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(options: Implementation.IRequest) {
        if (!this._syncExpression.evaluate(options.editor)) {
            /* tslint:disable-next-line:no-any */
            return Observable.empty<any>();
        }

        const params: TextDocumentPositionParams = {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor!.getURI())),
            position: Position.create(options.location.row, options.location.column)
        };
        return this._client.sendRequest(ImplementationRequest.type, params)
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
