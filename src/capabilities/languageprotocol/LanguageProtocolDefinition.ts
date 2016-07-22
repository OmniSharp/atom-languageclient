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
import { AtomNavigationLocation, IDefinitionProvider, IDefinitionService, ILanguageProtocolClient, ISyncExpression } from '../../services/_public';
import { fromRange } from './utils/convert';
import { Position, TextDocumentIdentifier, TextDocumentPositionParams } from '../../vscode-languageserver-types';
import { DefinitionRequest } from '../../vscode-protocol';
import { AtomTextEditorSource } from '../../atom/AtomTextEditorSource';
import { uriToFilePath } from './utils/uriToFilePath';

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

export class LanguageProtocolDefinitionProvider extends DisposableBase implements IDefinitionProvider {
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

                const params: TextDocumentPositionParams = {
                    textDocument: TextDocumentIdentifier.create(toUri(editor!.getURI())),
                    position: Position.create(marker.row, marker.column)
                };
                return this._client.sendRequest(DefinitionRequest.type, params)
                    .then(response => {
                        // TODO: Multiple locations
                        if (_.isArray(response)) {
                            throw new Error('goto definition needs to support multiple arrays');
                        } else {
                            return {
                                filePath: uriToFilePath(response.uri),
                                range: fromRange(response.range)
                            };
                        }
                    });
            });
    }

    public locate: NextObserver<Atom.TextEditor>;
    public response: Observable<AtomNavigationLocation>;
}
