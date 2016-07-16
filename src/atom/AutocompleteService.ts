/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { filter } from 'fuzzaldrin-plus';
import { Disposable, DisposableBase } from 'ts-disposables';

import { className, packageName } from '../constants';
import { IAutocompleteProvider, IAutocompleteService } from '../services/_public';
import { CompletionItem, CompletionItemKind, CompletionList, Position, TextDocumentIdentifier, TextDocumentPositionParams } from '../vscode-languageserver-types';

function isCompletionList(item: any): item is CompletionList {
    return item.items;
}

export class AutocompleteService extends DisposableBase implements IAutocompleteService {
    private _providers: Set<IAutocompleteProvider> = new Set<IAutocompleteProvider>();
    constructor() {
        super();

        this._disposable.add(
            // TODO: Dispose of these when not needed
            atom.config.observe(`${packageName}.useIcons`, (value) => {
                this._useIcons = value;
            }),
            Disposable.create(() => {
                this._providers.forEach(x => x.dispose());
                this._providers.clear();
            })
        );
    }

    public registerProvider(provider: IAutocompleteProvider) {
        this._providers.add(provider);
        return Disposable.create(() => this._providers.delete(provider));
    }

    private _useIcons: boolean;

    public selector = `.${className}`;
    // public disableForSelector = `.${className} .comment`;
    public inclusionPriority = 1;
    public suggestionPriority = 10;
    public excludeLowerPriority = false;

    public getSuggestions(options: Autocomplete.RequestOptions): Promise<Autocomplete.Suggestion[]> | null {
        const buffer = options.editor.getBuffer();
        const end = options.bufferPosition.column;
        const editor = options.editor;
        const position = options.bufferPosition;

        const data = buffer.getLines()[options.bufferPosition.row].substring(0, end + 1);
        const lastCharacterTyped = data[end - 1];

        if (!/[A-Z_0-9.]+/i.test(lastCharacterTyped)) {
            return null;
        }

        let search = options.prefix;
        if (search === '.') {
            search = '';
        }

        const params: TextDocumentPositionParams = {
            textDocument: TextDocumentIdentifier.create(editor.getURI()),
            position: Position.create(position.row, position.column)
        };

        if (!!this._providers.size) {
            return null;
        }

        return Promise.all(_.map(_.toArray(this._providers.values()), provider => provider.request(params)))
            .then(items => {
                let allItems = _(items)
                    .flatMap(item => {
                        if (isCompletionList(item)) {
                            // TODO: How to merge incomplete?
                            return item;
                        }
                        return item;
                    })
                    .each(item => {
                        item.filterText = item.filterText || item.label;
                    })
                    .value();
                if (search) {
                    allItems = filter(allItems, search, { key: 'filterText' });
                }
                return _.map(allItems, item => this._makeSuggestion(item));
            });
    }

    public onDidInsertSuggestion(editor: Atom.TextEditor, triggerPosition: TextBuffer.Point, suggestion: Autocomplete.Suggestion & { completionItem: CompletionItem }) {

    }

    private _makeSuggestion(completionItem: CompletionItem): Autocomplete.Suggestion & { completionItem: CompletionItem } {
        // TODO: Icon html
        return <Autocomplete.TextSuggestion & { completionItem: CompletionItem }>{
            completionItem,
            text: completionItem.insertText,
            displayText: completionItem.label,
            type: this._getTypeFromKind(<CompletionItemKind>completionItem.kind),
            description: completionItem.detail,
            descriptionMoreURL: completionItem.documentation,
            className: `autocomplete-${packageName}`,
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
