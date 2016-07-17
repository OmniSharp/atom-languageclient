/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { packageName } from '../../constants';
import { capability, inject } from '../../services/_decorators';
import { IAutocompleteProvider, IAutocompleteService, AutocompleteSuggestion, ILanguageProtocolClient, ISyncExpression } from '../../services/_public';
import { CompletionItem, CompletionItemKind, CompletionList, CompletionOptions, Position, TextDocumentIdentifier, TextDocumentPositionParams } from '../../vscode-languageserver-types';
import { CompletionRequest } from '../../vscode-protocol';

function isCompletionList(item: any): item is CompletionList {
    return item.items;
}

@capability
export class Intellisense {
    private _client: ILanguageProtocolClient;
    private _autocompleteService: IAutocompleteService;
    private _syncExpression: ISyncExpression;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(ISyncExpression) syncExpression: ISyncExpression,
        @inject(IAutocompleteService) autocompleteService: IAutocompleteService
    ) {
        this._client = client;
        this._autocompleteService = autocompleteService;
        this._syncExpression = syncExpression;
        if (!client.capabilities.completionProvider) {
            return;
        }

        // TODO: Handle trigger characters
        this._autocompleteService.registerProvider(new IntellisesenseService(client, this._syncExpression, client.capabilities.completionProvider));
    }
}

export class IntellisesenseService extends DisposableBase implements IAutocompleteProvider {
    private _client: ILanguageProtocolClient;
    private _options: CompletionOptions;
    private _syncExpression: ISyncExpression;
    public constructor(client: ILanguageProtocolClient, syncExpression: ISyncExpression, options: CompletionOptions) {
        super();
        this._client = client;
        this._options = options;
        this._syncExpression = syncExpression;
    }

    public request(options: Autocomplete.RequestOptions): Promise<AutocompleteSuggestion[]> | null {
        if (!this._syncExpression.evaluate(options.editor)) {
            return null;
        }
        const {editor, bufferPosition} = options;

        const params: TextDocumentPositionParams = {
            textDocument: TextDocumentIdentifier.create(toUri(editor.getURI())),
            position: Position.create(bufferPosition.row, bufferPosition.column)
        };

        return this._client.sendRequest(CompletionRequest.type, params)
            .then(response => {
                let items: CompletionItem[];
                if (isCompletionList(response)) {
                    // TODO: How to merge incomplete?
                    items = response.items;
                } else {
                    items = response;
                }

                return _.map(items, item => this._makeSuggestion(item));
            });
    }

    private _makeSuggestion(completionItem: CompletionItem): AutocompleteSuggestion {
        // TODO: Icon html
        return <AutocompleteSuggestion>{
            completionItem,
            text: completionItem.insertText,
            displayText: completionItem.label,
            filterText: completionItem.filterText || completionItem.label,
            type: this._getTypeFromKind(<CompletionItemKind>completionItem.kind),
            description: completionItem.detail,
            descriptionMoreURL: completionItem.documentation,
            className: `autocomplete-${packageName}`
        };
    }

    private _getTypeFromKind(kind: CompletionItemKind): Autocomplete.SuggestionType {
        switch (kind) {
            case CompletionItemKind.Method:
                return 'method';
            case CompletionItemKind.Function:
            case CompletionItemKind.Constructor:
                return 'function';
            case CompletionItemKind.Field:
            case CompletionItemKind.Property:
                return 'property';
            case CompletionItemKind.Variable:
                return 'variable';
            case CompletionItemKind.Class:
                return 'class';
            case CompletionItemKind.Interface:
                return 'interface';
            case CompletionItemKind.Module:
                return 'module';
            case CompletionItemKind.Unit:
                return 'builtin';
            case CompletionItemKind.Enum:
                return 'enum';
            case CompletionItemKind.Keyword:
                return 'keyword';
            case CompletionItemKind.Snippet:
                return 'snippet';
            case CompletionItemKind.File:
                return 'import';
            case CompletionItemKind.Reference:
                return 'require';
            case CompletionItemKind.Color:
            case CompletionItemKind.Text:
            case CompletionItemKind.Value:
            default:
                return 'value';
        }
    }
}
