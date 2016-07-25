/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { capability, inject } from '../../services/_decorators';
import { IDefinitionProvider, IDefinitionService, ILanguageProtocolClient, ISyncExpression } from '../../services/_public';
import { fromRange } from './utils/convert';
import { uriToFilePath } from './utils/uriToFilePath';
import { Position, TextDocumentIdentifier, TextDocumentPositionParams } from '../../vscode-languageserver-types';
import { DefinitionRequest } from '../../vscode-protocol';

@capability
export class LanguageProtocolDefinition extends DisposableBase {
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

    public request(editor: Atom.TextEditor) {
        if (!this._syncExpression.evaluate(editor)) {
            return Observable.empty<any>();
        }

        const marker = editor!.getCursorBufferPosition();

        const params: TextDocumentPositionParams = {
            textDocument: TextDocumentIdentifier.create(toUri(editor!.getURI())),
            position: Position.create(marker.row, marker.column)
        };
        return Observable.fromPromise(this._client.sendRequest(DefinitionRequest.type, params))
            .map(response => {
                if (_.isArray(response)) {
                    return _.map(response, location => {
                        return {
                            filePath: uriToFilePath(location.uri),
                            range: fromRange(location.range)
                        };
                    });
                } else {
                    return [{
                        filePath: uriToFilePath(response.uri),
                        range: fromRange(response.range)
                    }];
                }
            });
    }
}
