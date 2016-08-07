/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
/* tslint:disable-next-line:no-require-imports */
import { Autocomplete, IAutocompleteProvider, IAutocompleteService } from 'atom-languageservices';
import * as Fuse from 'fuse.js';
import { Disposable } from 'ts-disposables';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { className, packageName } from '../constants';
import { AtomLanguageClientConfig } from '../AtomLanguageClientConfig';

export class AutocompleteService
    extends ProviderServiceBase<IAutocompleteProvider, Autocomplete.IRequest, Observable<Autocomplete.Suggestion[]>, Observable<Autocomplete.Suggestion[]>>
    implements IAutocompleteService {
    private _enabled: boolean;
    constructor(packageConfig: AtomLanguageClientConfig) {
        super(AutocompleteService, packageConfig, {
            default: true,
            description: 'Adds support for integration with atoms autocomplete service'
        });
    }

    public onEnabled() {
        this._enabled = true;
        return Disposable.create(() => {
            this._enabled = false;
        });
    }

    protected createInvoke(callbacks: ((options: Autocomplete.IRequest) => Observable<Autocomplete.Suggestion[]>)[]) {
        return ((options: Autocomplete.IRequest) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce((acc, results) => _.compact(acc.concat(this._reduceItems(results))), []);
        });
    }

    private _reduceItems(results: Autocomplete.Suggestion[]) {
        return _.map<Autocomplete.Suggestion[], Autocomplete.Suggestion>(results, item => {
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

    public getSuggestions(options: Autocomplete.IRequest): Observable<Autocomplete.Suggestion[]> | null {
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
            .map(results => {
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
