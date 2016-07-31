/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
/* tslint:disable-next-line:no-require-imports */
import { Autocomplete, IAutocompleteProvider, IAutocompleteService } from 'atom-languageservices';
import * as Fuse from 'fuse.js';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { className, packageName } from '../constants';

export class AutocompleteService
    extends ProviderServiceBase<IAutocompleteProvider, Autocomplete.RequestOptions, Promise<Autocomplete.Suggestion[]> | undefined, Promise<Autocomplete.Suggestion[]>>
    implements IAutocompleteService {
    constructor() {
        super();
    }

    protected createInvoke(callbacks: ((options: Autocomplete.RequestOptions) => Promise<Autocomplete.Suggestion[]> | undefined)[]) {
        return ((options: Autocomplete.RequestOptions) => {
            const requests = _.compact(_.over(callbacks)(options));
            return Promise.all<Autocomplete.Suggestion[]>(<any>requests)
                .then(_.bind(this._reduceItems, this));
        });
    }

    private _reduceItems(results: Autocomplete.Suggestion[][]) {
        return _.flatMap<Autocomplete.Suggestion[], Autocomplete.Suggestion>(results, item => {
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

    public getSuggestions(options: Autocomplete.RequestOptions): Promise<Autocomplete.Suggestion[]> | null {
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
                    results = this._fuse.search<Autocomplete.Suggestion>(search);
                }
                return results;
            });
    }

    private _renderIcon(completionItem: Autocomplete.Suggestion) {
        return `<img height="16px" width="16px" src="atom://${packageName}/styles/icons/${Autocomplete.getIconFromSuggestionType(completionItem.type!)}.svg" />`;
    }

    public onDidInsertSuggestion(editor: Atom.TextEditor, triggerPosition: TextBuffer.Point, suggestion: Autocomplete.Suggestion) { /* */ }
}
