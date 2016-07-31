/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Autocomplete, Finder, IDocumentFinderProvider, IDocumentFinderService, ILanguageProtocolClient, ISyncExpression } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { DocumentSymbolRequest } from 'atom-languageservices/protocol';
import { SymbolInformation, SymbolKind, TextDocumentIdentifier } from 'atom-languageservices/types';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { packageName } from '../constants';
import { fromPosition, fromUri } from './utils/convert';

@capability
export class DocumentSymbolsProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _finderService: IDocumentFinderService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IDocumentFinderService) finderService: IDocumentFinderService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._finderService = finderService;
        this._syncExpression = syncExpression;
        if (!client.capabilities.documentSymbolProvider) {
            return;
        }

        // TODO: Handle trigger characters
        const service = new DocumentFinderProvider(client, syncExpression);
        this._disposable.add(service);
        this._finderService.registerProvider(service);
    }
}

class DocumentFinderProvider extends DisposableBase implements IDocumentFinderProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    public constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(editor: Atom.TextEditor) {
        if (!this._syncExpression.evaluate(editor)) {
            return Observable.empty<Finder.Item[]>();
        }

        return Observable.fromPromise(
            this._client.sendRequest(DocumentSymbolRequest.type, {
                textDocument: TextDocumentIdentifier.create(toUri(editor!.getURI()))
            })
        ).map(results => {
            return _.map(results, result => this._makeSymbol(result));
        });
    }

    private _makeSymbol(symbol: SymbolInformation): Finder.Item {
        // TODO: Icon html
        return <Finder.Item>{
            name: symbol.name,
            filterText: symbol.name,
            iconHTML: this._renderIcon(symbol),
            filePath: fromUri(symbol.location.uri),
            location: fromPosition(symbol.location.range.start),
            type: Autocomplete.getTypeFromSymbolKind(symbol.kind)
        };
    }

    private _renderIcon(completionItem: { kind: SymbolKind }) {
        return `<img height="16px" width="16px" src="atom://${packageName}/styles/icons/${Autocomplete.getIconFromSymbolKind(completionItem.kind!)}.svg" />`;
    }
}
