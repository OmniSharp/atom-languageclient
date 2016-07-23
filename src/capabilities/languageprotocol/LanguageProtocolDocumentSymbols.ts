/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { packageName } from '../../constants';
import { capability, inject } from '../../services/_decorators';
import { AutocompleteKind, IAtomTextEditorSource, IDocumentFinderProvider, IDocumentFinderService, ILanguageProtocolClient, ISyncExpression } from '../../services/_public';
import { fromPosition } from './utils/convert';
import { SymbolInformation, SymbolKind, TextDocumentIdentifier } from '../../vscode-languageserver-types';
import { DocumentSymbolRequest } from '../../vscode-protocol';
import { uriToFilePath } from './utils/uriToFilePath';

@capability
export class LanguageProtocolDocumentSymbols extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _atomTextEditorSource: IAtomTextEditorSource;
    private _syncExpression: ISyncExpression;
    private _finderService: IDocumentFinderService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IDocumentFinderService) finderService: IDocumentFinderService,
        @inject(ISyncExpression) syncExpression: ISyncExpression,
        @inject(IAtomTextEditorSource) atomTextEditorSource: IAtomTextEditorSource
    ) {
        super();
        this._client = client;
        this._finderService = finderService;
        this._syncExpression = syncExpression;
        this._atomTextEditorSource = atomTextEditorSource;
        if (!client.capabilities.documentSymbolProvider) {
            return;
        }

        // TODO: Handle trigger characters
        const service = new DocumentFinderService(client, syncExpression, atomTextEditorSource);
        this._disposable.add(service);
        this._finderService.registerProvider(service);
    }
}

class DocumentFinderService extends DisposableBase implements IDocumentFinderProvider {
    private _client: ILanguageProtocolClient;
    private _atomTextEditorSource: IAtomTextEditorSource;
    private _syncExpression: ISyncExpression;
    public constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression,
        atomTextEditorSource: IAtomTextEditorSource) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
        this._atomTextEditorSource = atomTextEditorSource;

        this.results = atomTextEditorSource.observeActiveTextEditor
            .filter(editor => {
                return this._syncExpression.evaluate(editor);
            })
            .switchMap(editor => {
                return this._client.sendRequest(DocumentSymbolRequest.type, {
                    textDocument: TextDocumentIdentifier.create(toUri(editor!.getURI()))
                });
            })
            .map(results => {
                return _.map(results, symbol => this._makeSymbol(symbol));
            });
    }

    public results: Observable<Finder.Symbol[]>;

    private _makeSymbol(symbol: SymbolInformation): Finder.Symbol {
        // TODO: Icon html
        return <Finder.Symbol>{
            name: symbol.name,
            filterText: symbol.name,
            iconHTML: this._renderIcon(symbol),
            filePath: uriToFilePath(symbol.location.uri),
            location: fromPosition(symbol.location.range.start),
            type: this._getTypeFromKind(symbol.kind)
        };
    }

    private _renderIcon(completionItem: { kind: SymbolKind }) {
        return `<img height="16px" width="16px" src="atom://${packageName}/styles/icons/${this._getIconFromKind(completionItem.kind!)}.svg" />`;
    }

    private _getIconFromKind(kind: SymbolKind): string {
        switch (kind) {
            case SymbolKind.Method:
            case SymbolKind.Function:
                return AutocompleteKind.Method;
            case SymbolKind.Constructor:
                return AutocompleteKind.Class;
            case SymbolKind.Property:
                return AutocompleteKind.Property;
            case SymbolKind.Field:
            case SymbolKind.Variable:
                return AutocompleteKind.Field;
            case SymbolKind.Class:
                return AutocompleteKind.Class;
            case SymbolKind.Interface:
                return AutocompleteKind.Interface;
            case SymbolKind.Module:
                return AutocompleteKind.Module;
            case SymbolKind.Enum:
                return AutocompleteKind.Enum;
            case SymbolKind.File:
                return 'file';
            default:
                return 'valuetype';
        }
    }

    private _getTypeFromKind(kind: SymbolKind): Autocomplete.SuggestionType {
        switch (kind) {
            case SymbolKind.Method:
                return 'method';
            case SymbolKind.Function:
            case SymbolKind.Constructor:
                return 'function';
            case SymbolKind.Field:
            case SymbolKind.Property:
                return 'property';
            case SymbolKind.Variable:
                return 'variable';
            case SymbolKind.Class:
                return 'class';
            case SymbolKind.Interface:
                return 'interface';
            case SymbolKind.Module:
                return 'module';
            case SymbolKind.Enum:
                return 'enum';
            case SymbolKind.File:
                return 'import';
            default:
                return 'value';
        }
    }
}
