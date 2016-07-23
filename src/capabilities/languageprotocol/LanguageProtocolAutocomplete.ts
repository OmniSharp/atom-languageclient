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
import { AutocompleteKind, AutocompleteSuggestion, IAutocompleteProvider, IAutocompleteService, ILanguageProtocolClient, ISyncExpression } from '../../services/_public';
import { CompletionItem, CompletionItemKind, CompletionList, CompletionOptions, Position, TextDocumentIdentifier, TextDocumentPositionParams } from '../../vscode-languageserver-types';
import { CompletionRequest } from '../../vscode-protocol';

const _snippetRegex = /{{(.*?)}}/;

function isCompletionList(item: any): item is CompletionList {
    return item.items;
}

@capability
export class LanguageProtocolAutocomplete extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _autocompleteService: IAutocompleteService;
    private _syncExpression: ISyncExpression;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(ISyncExpression) syncExpression: ISyncExpression,
        @inject(IAutocompleteService) autocompleteService: IAutocompleteService
    ) {
        super();
        this._client = client;
        this._autocompleteService = autocompleteService;
        this._syncExpression = syncExpression;
        if (!client.capabilities.completionProvider) {
            return;
        }

        // TODO: Handle trigger characters
        const service = new AutocompleteService(client, this._syncExpression, client.capabilities.completionProvider);
        this._disposable.add(service);
        this._autocompleteService.registerProvider(service);
    }
}

export class AutocompleteService extends DisposableBase implements IAutocompleteProvider {
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

                return _.map(items, item => this._makeSuggestion(item, options));
            });
    }

    private _makeSuggestion(completionItem: CompletionItem, options: Autocomplete.RequestOptions): AutocompleteSuggestion {
        let replacementPrefix: string = options.prefix;
        let hasSnippetLocation = false;
        let snippet: string | undefined;
        let text: string = completionItem.insertText || completionItem.label;
        if (completionItem.textEdit) {
            const {range, newText} = completionItem.textEdit;
            replacementPrefix = options.editor.getTextInRange([[range.start.line, range.start.character], [range.end.line, range.end.character]]);
            if (_snippetRegex.test(newText)) {
                hasSnippetLocation = true;
                snippet = newText;
            } else {
                text = newText;
            }
        } else if (completionItem.insertText) {
            if (_snippetRegex.test(completionItem.insertText)) {
                hasSnippetLocation = true;
                snippet = completionItem.insertText;
            } else {
                text = completionItem.insertText;
            }
        }

        const base = {
            displayText: completionItem.label,
            iconHTML: this._renderIcon(completionItem),
            filterText: completionItem.filterText || completionItem.label,
            type: this._getTypeFromKind(<CompletionItemKind>completionItem.kind),
            description: completionItem.detail,
            descriptionMoreURL: completionItem.documentation,
            className: `autocomplete-${packageName}`
        };

        if (snippet) {
            snippet = snippet.replace(_snippetRegex, (substring: string, value: string) => {
                if (value) {
                    return `\${1:${value}}`;
                } else {
                    return `\${1: }`;
                }
            });
            snippet += '${2: }';
            return _.assign(base, {
                completionItem,
                replacementPrefix,
                snippet
            });
        } else {
            return _.assign(base, {
                completionItem,
                replacementPrefix,
                text
            });
        }
    }

    private _renderIcon(completionItem: CompletionItem) {
        return `<img height="16px" width="16px" src="atom://${packageName}/styles/icons/${this._getIconFromKind(completionItem.kind!)}.svg" />`;
    }

    private _getIconFromKind(kind: CompletionItemKind): string {
        switch (kind) {
            case CompletionItemKind.Method:
            case CompletionItemKind.Function:
                return AutocompleteKind.Method;
            case CompletionItemKind.Constructor:
                return AutocompleteKind.Class;
            case CompletionItemKind.Property:
                return AutocompleteKind.Property;
            case CompletionItemKind.Field:
            case CompletionItemKind.Variable:
                return AutocompleteKind.Field;
            case CompletionItemKind.Class:
                return AutocompleteKind.Class;
            case CompletionItemKind.Interface:
                return AutocompleteKind.Interface;
            case CompletionItemKind.Module:
                return AutocompleteKind.Module;
            case CompletionItemKind.Unit:
                return 'unit';
            case CompletionItemKind.Enum:
                return AutocompleteKind.Enum;
            case CompletionItemKind.Keyword:
                return 'keyword';
            case CompletionItemKind.Snippet:
                return 'snippet';
            case CompletionItemKind.File:
                return 'file';
            case CompletionItemKind.Reference:
                return 'reference';
            case CompletionItemKind.Color:
                return 'color';
            case CompletionItemKind.Text:
                return 'text';
            case CompletionItemKind.Value:
            default:
                return 'valuetype';
        }
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
