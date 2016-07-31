/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Autocomplete, IAutocompleteProvider, IAutocompleteService, ILanguageProtocolClient, ISyncExpression } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { CompletionRequest } from 'atom-languageservices/protocol';
import { CompletionItem, CompletionItemKind, CompletionList, CompletionOptions, Position, TextDocumentIdentifier, TextDocumentPositionParams } from 'atom-languageservices/types';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { packageName } from '../constants';

const _snippetRegex = /{{(.*?)}}/;

/* tslint:disable-next-line:no-any */
function isCompletionList(item: any): item is CompletionList {
    return item.items;
}

@capability
export class AutocompleteProtocol extends DisposableBase {
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

class AutocompleteService extends DisposableBase implements IAutocompleteProvider {
    private _client: ILanguageProtocolClient;
    private _options: CompletionOptions;
    private _syncExpression: ISyncExpression;
    public constructor(client: ILanguageProtocolClient, syncExpression: ISyncExpression, options: CompletionOptions) {
        super();
        this._client = client;
        this._options = options;
        this._syncExpression = syncExpression;
    }

    public request(options: Autocomplete.IRequest) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return;
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

    private _makeSuggestion(completionItem: CompletionItem, options: Autocomplete.IRequest): Autocomplete.Suggestion {
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
            type: Autocomplete.getTypeFromCompletionItemKind(completionItem.kind!),
            description: completionItem.detail,
            descriptionMoreURL: completionItem.documentation,
            className: `autocomplete-${packageName}`
        };

        if (snippet) {
            snippet = snippet.replace(_snippetRegex, (substring: string, value: string) => {
                if (value) {
                    return `\${1:${value}}`;
                } else {
                    return `\$1`;
                }
            });
            snippet += '$2';
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
        return `<img height="16px" width="16px" src="atom://${packageName}/styles/icons/${Autocomplete.getIconFromCompletionItemKind(completionItem.kind!)}.svg" />`;
    }
}
