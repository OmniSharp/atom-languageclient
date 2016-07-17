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
import { IAutocompleteProvider, IAutocompleteService, AutocompleteSuggestion } from '../services/_public';

export class AutocompleteService extends DisposableBase implements IAutocompleteService {
    private _providers: Set<IAutocompleteProvider> = new Set<IAutocompleteProvider>();
    private _invoke: (options: Autocomplete.RequestOptions) => (Promise<Autocomplete.Suggestion[]>)[];
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

    private _computeInvoke() {
        const callbacks = _.map(_.toArray(this._providers), provider => {
            return (options: Autocomplete.RequestOptions) => provider.request(options);
        });
        this._invoke = (options) => {
            return _.compact(_.over<any>(callbacks)(options));
        };
    }

    public registerProvider(provider: IAutocompleteProvider) {
        this._providers.add(provider);
        this._computeInvoke();
        return Disposable.create(() => {
            this._providers.delete(provider);
            this._computeInvoke();
        });
    }

    private _useIcons: boolean;

    public selector = `.source`;
    // public disableForSelector = `.${className} .comment`;
    public inclusionPriority = 1;
    public suggestionPriority = 10;
    public excludeLowerPriority = false;

    public getSuggestions(options: Autocomplete.RequestOptions): Promise<Autocomplete.Suggestion[]> | null {
        if (!this._providers.size) {
            return null;
        }
        if (!atom.views.getView(options.editor).classList.contains(className)) {
            return null;
        }

        const buffer = options.editor.getBuffer();
        const end = options.bufferPosition.column;
        const data = buffer.getLines()[options.bufferPosition.row].substring(0, end + 1);
        const lastCharacterTyped = data[end - 1];

        if (!/[A-Z_0-9.]+/i.test(lastCharacterTyped)) {
            return null;
        }

        if (options.prefix === '.') {
            options.prefix = '';
        }
        const search = options.prefix;

        return Promise.all(this._invoke(options))
            .then(items => {
                let results = _.flatMap(items, _.identity);
                if (search) {
                    results = filter(results, search, { key: 'filterText' });
                }
                return results;
            });
    }

    public onDidInsertSuggestion(editor: Atom.TextEditor, triggerPosition: TextBuffer.Point, suggestion: AutocompleteSuggestion) {

    }
}
