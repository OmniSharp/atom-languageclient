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
import { AutocompleteKind, ILanguageProtocolClient, IWorkspaceFinderProvider, IWorkspaceFinderService } from '../../services/_public';
import { fromPosition } from './utils/convert';
import { SymbolInformation, SymbolKind } from '../../vscode-languageserver-types';
import { WorkspaceSymbolRequest } from '../../vscode-protocol';
import { uriToFilePath } from './utils/uriToFilePath';

@capability
export class LanguageProtocolWorkspaceSymbols extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _finderService: IWorkspaceFinderService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IWorkspaceFinderService) finderService: IWorkspaceFinderService
    ) {
        super();
        this._client = client;
        this._finderService = finderService;
        if (!client.capabilities.workspaceSymbolProvider) {
            return;
        }

        // TODO: Handle trigger characters
        const service = new WorkspaceFinderService(client);
        this._disposable.add(service);
        this._finderService.registerProvider(service);
    }
}

class WorkspaceFinderService extends DisposableBase implements IWorkspaceFinderProvider {
    private _client: ILanguageProtocolClient;
    public constructor(client: ILanguageProtocolClient) {
        super();
        this._client = client;

        const filter = this.filter = new Subject<string>();

        this.results = filter
            .asObservable()
            .switchMap(query => {
                return this._client.sendRequest(WorkspaceSymbolRequest.type, { query });
            })
            .map(results => {
                return _.map(results, symbol => this._makeSymbol(symbol));
            });
    }

    public results: Observable<Finder.Symbol[]>;
    public filter: Observer<string>;


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
