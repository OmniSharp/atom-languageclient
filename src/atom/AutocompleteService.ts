/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
/* tslint:disable-next-line:no-require-imports */
import * as Fuse from 'fuse.js';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AutocompleteKind, AutocompleteSuggestion, IAutocompleteProvider, IAutocompleteService } from 'atom-languageservices';
import { className, packageName } from '../constants';

export class AutocompleteService
    extends ProviderServiceBase<IAutocompleteProvider, Autocomplete.RequestOptions, Promise<AutocompleteSuggestion[]> | undefined, Promise<AutocompleteSuggestion[]>>
    implements IAutocompleteService {
    constructor() {
        super();
    }

    protected createInvoke(callbacks: ((options: Autocomplete.RequestOptions) => Promise<AutocompleteSuggestion[]> | undefined)[]) {
        return ((options: Autocomplete.RequestOptions) => {
            const requests = _.compact(_.over(callbacks)(options));
            return Promise.all<AutocompleteSuggestion[]>(<any>requests)
                .then(_.bind(this._reduceItems, this));
        });
    }

    private _reduceItems(results: AutocompleteSuggestion[][]) {
        return _.flatMap<AutocompleteSuggestion[], AutocompleteSuggestion>(results, item => {
            if (item.length > 0) {
                if (item[0].iconHTML) {
                    return item;
                }
                if (item[0].type) {
                    _.each(item, i => {
                        if (i.type && !i.iconHTML) {
                            i.iconHTML = this._renderIcon(i);
                        }
                        return;
                    });
                }
            }
            return item;
        });
    }

    public selector = `.source`;
    // public disableForSelector = `.${className} .comment`;
    public inclusionPriority = 10;
    public suggestionPriority = 10;
    public excludeLowerPriority = false;
    private _fuse = new Fuse<Autocomplete.Suggestion>([], {
        caseSensitive: false,
        threshold: 0.7,
        tokenize: true,
        tokenSeparator: /(?:(?=[A-Z])|\s+)/,
        shouldSort: true,
        keys: [
            { name: 'displayText', weight: 0.8 },
            { name: 'description', weight: 0.15 },
            { name: 'descriptionMoreURL', weight: 0.05 }
        ]
    });

    public getSuggestions(options: Autocomplete.RequestOptions): Promise<AutocompleteSuggestion[]> | null {
        if (!this.hasProviders) {
            return null;
        }
        if (!atom.views.getView(options.editor).classList.contains(className)) {
            return null;
        }

        if (options.prefix === '.') {
            options.prefix = '';
        }
        const search = options.prefix;

        return this.invoke(options)
            .then(results => {
                if (search) {
                    this._fuse.set(results);
                    results = this._fuse.search<AutocompleteSuggestion>(search);
                }
                return results;
            });
    }

    private _renderIcon(completionItem: Autocomplete.Suggestion) {
        return `<img height="16px" width="16px" src="atom://${packageName}/styles/icons/${this._getIconFromKind(completionItem.type!)}.svg" />`;
    }

    private _getIconFromKind(kind: Autocomplete.SuggestionType): string {
        switch (kind) {
            case 'class':
            case 'type':
                return AutocompleteKind.Class;
            case 'mixin':
                return 'union';
            case 'constant':
                return 'constant';
            case 'import':
                return 'reference';
            case 'keyword':
                return 'keyword';
            case 'function':
            case 'method':
                return AutocompleteKind.Method;
            case 'module':
            case 'require':
            case 'package':
                return AutocompleteKind.Module;
            case 'property':
                return AutocompleteKind.Property;
            case 'snippet':
                return 'snippet';
            case 'tag':
                return AutocompleteKind.Class;
            case 'selector':
            case 'pseudo-selector':
            case 'variable':
                return AutocompleteKind.Field;
            case 'interface':
                return AutocompleteKind.Interface;
            case 'enum':
                return AutocompleteKind.Enum;
            case 'value':
            case 'attribute':
            case 'builtin':
            default:
                return 'valuetype';
        }
    }

    public onDidInsertSuggestion(editor: Atom.TextEditor, triggerPosition: TextBuffer.Point, suggestion: AutocompleteSuggestion) { /* */ }
}
