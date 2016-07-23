/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { NextObserver } from 'rxjs/Observer';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { packageName } from '../../constants';
import { capability, inject } from '../../services/_decorators';
import { ILanguageProtocolClient, IReferencesProvider, IReferencesService, ISyncExpression } from '../../services/_public';
import { fromRange } from './utils/convert';
import { Position, TextDocumentIdentifier, ReferenceParams } from '../../vscode-languageserver-types';
import { ReferencesRequest } from '../../vscode-protocol';
import { AtomTextEditorSource } from '../../atom/AtomTextEditorSource';
import { uriToFilePath } from './utils/uriToFilePath';

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

export class LanguageProtocolReferencesProvider extends DisposableBase implements IReferencesProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;

        const locate = this.locate = new Subject<Atom.TextEditor>();
        this.response = locate
            .filter(editor => syncExpression.evaluate(editor))
            .switchMap(editor => {
                const marker = editor!.getCursorBufferPosition();

                const params: ReferenceParams = {
                    context: {
                        includeDeclaration: true
                    },
                    textDocument: TextDocumentIdentifier.create(toUri(editor!.getURI())),
                    position: Position.create(marker.row, marker.column)
                };
                return this._client.sendRequest(ReferencesRequest.type, params)
                    .then(response => {
                        return _.map(response, location => {
                            return {
                                filePath: uriToFilePath(location.uri),
                                range: fromRange(location.range)
                            };
                        });
                    });
            });
    }

    public locate: NextObserver<Atom.TextEditor>;
    public response: Observable<AtomNavigationLocation[]>;
}
