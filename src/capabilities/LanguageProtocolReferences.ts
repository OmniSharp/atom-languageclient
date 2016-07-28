/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { capability, inject } from '../services/_decorators';
import { ILanguageProtocolClient, IReferencesProvider, IReferencesService, ISyncExpression } from '../services/_public';
import { fromRange, fromUri } from './utils/convert';
import { Position, ReferenceParams, TextDocumentIdentifier } from '../vscode-languageserver-types';
import { ReferencesRequest } from '../vscode-protocol';

@capability
export class LanguageProtocolReferences extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _referencesService: IReferencesService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IReferencesService) referencesService: IReferencesService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
        this._referencesService = referencesService;
        if (!client.capabilities.referencesProvider) {
            return;
        }

        const service = new LanguageProtocolReferencesProvider(this._client, this._syncExpression);
        this._disposable.add(service);
        this._referencesService.registerProvider(service);
    }
}

class LanguageProtocolReferencesProvider extends DisposableBase implements IReferencesProvider {
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

        const params: ReferenceParams = {
            context: {
                includeDeclaration: true
            },
            textDocument: TextDocumentIdentifier.create(toUri(editor!.getURI())),
            position: Position.create(marker.row, marker.column)
        };
        return Observable.fromPromise(this._client.sendRequest(ReferencesRequest.type, params))
            .map(response => {
                return _.map(response, location => {
                    return {
                        filePath: fromUri(location.uri),
                        range: fromRange(location.range)
                    };
                });
            });
    }
}
