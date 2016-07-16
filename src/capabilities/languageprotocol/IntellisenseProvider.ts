/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { DisposableBase } from 'ts-disposables';
import { capability, inject } from '../../services/_decorators';
import { IAutocompleteProvider, IAutocompleteService, ICapability, ILanguageProtocolClient } from '../../services/_public';
import { CompletionOptions, Methods, TextDocumentPositionParams } from '../../vscode-languageserver-types';

@capability
export class IntelliseSenseProvider implements ICapability {
    private _client: ILanguageProtocolClient;
    private _autocompleteService: IAutocompleteService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IAutocompleteService) autocompleteService: IAutocompleteService
    ) {
        this._client = client;
        this._autocompleteService = autocompleteService;
        if (!client.capabilities.completionProvider) {
            return;
        }

        this._autocompleteService.registerProvider(new IntellisesenseService(client, client.capabilities.completionProvider));
    }

    public isSupported(client: ILanguageProtocolClient ) {
        return !!client.capabilities.completionProvider;
    }
}

/*
private hookCompletionProvider(documentSelector: DocumentSelector, connection: IConnection): void {
        if (!this._capabilites.completionProvider) {
            return;
        }

        this._providers.push(Languages.registerCompletionItemProvider(documentSelector, {
            provideCompletionItems: (document: TextDocument, position: VPosition, token: CancellationToken): Thenable<VCompletionList | VCompletionItem[]> => {
                return this.doSendRequest(connection, CompletionRequest.type, c2p.asTextDocumentPositionParams(document, position), token). then(
                    p2c.asCompletionResult,
                    error => Promise.resolve([])
                );
            },
            resolveCompletionItem: this._capabilites.completionProvider.resolveProvider
                ? (item: VCompletionItem, token: CancellationToken): Thenable<VCompletionItem> => {
                    return this.doSendRequest(connection, CompletionResolveRequest.type, c2p.asCompletionItem(item), token).then(
                        p2c.asCompletionItem,
                        error => Promise.resolve(item)
                    );
                }
                : undefined
        }, ...this._capabilites.completionProvider.triggerCharacters));
    }
*/

export class IntellisesenseService extends DisposableBase implements IAutocompleteProvider {
    private _client: ILanguageProtocolClient;
    private _options: CompletionOptions;
    public constructor(client: ILanguageProtocolClient, options: CompletionOptions) {
        super();
        this._client = client;
        this._options = options;
    }

    public request(params: TextDocumentPositionParams) {
        return <any>null;
    }
}
