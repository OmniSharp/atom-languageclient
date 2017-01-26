/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { Autocomplete, Finder, ILanguageProtocolClient, IWorkspaceFinderProvider, IWorkspaceFinderService } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { WorkspaceSymbolRequest } from 'atom-languageservices/protocol';
import { SymbolInformation, SymbolKind } from 'vscode-languageserver-types';
import { DisposableBase } from 'ts-disposables';
import { packageName } from '../constants';
import { fromPosition, fromUri } from './utils/convert';

@capability((capabilities) => !!capabilities.workspaceSymbolProvider)
export class WorkspaceSymbolsProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _finderService: IWorkspaceFinderService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IWorkspaceFinderService) finderService: IWorkspaceFinderService
    ) {
        super();
        this._client = client;
        this._finderService = finderService;

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

    public results: Observable<Finder.IResponse[]>;
    public filter: Observer<string>;

    private _makeSymbol(symbol: SymbolInformation): Finder.IResponse {
        // TODO: Icon html
        return <Finder.IResponse>{
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
