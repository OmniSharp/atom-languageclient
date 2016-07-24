/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { readFile } from 'fs';
import { Disposable, DisposableBase } from 'ts-disposables';
import { alias, injectable } from '../services/_decorators';
import { ATOM_COMMANDS, ATOM_NAVIGATION, IReferencesProvider, IReferencesService } from '../services/_public';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { ReferenceView } from './views/ReferenceView';
const {navigationHasRange} = ATOM_NAVIGATION;

const readFile$ = Observable.bindNodeCallback(readFile);

@injectable
@alias(IReferencesService)
export class ReferencesService extends DisposableBase implements IReferencesService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _providers = new Set<IReferencesProvider>();

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;

        this._commands.add(ATOM_COMMANDS.CommandType.TextEditor, 'references', () => this.open());

        this._disposable.add(
            Disposable.create(() => {
                this._providers.forEach(x => x.dispose());
                this._providers.clear();
            })
        );
    }

    public registerProvider(provider: IReferencesProvider) {
        this._providers.add(provider);

        return Disposable.create(() => {
            this._providers.delete(provider);
        });
    }

    public open() {
        let view: ReferenceView;
        let subscription: Subscription;
        const providers = _.toArray(this._providers);
        subscription = Observable.from(providers)
            .mergeMap(provider => {
                return provider.response.take(1);
            })
            .scan((acc, value) => { acc.push(...value); return acc; }, [])
            .debounceTime(200)
            .do(results => {
                if (results.length === 1) {
                    this._navigation.navigateTo(results[0]);
                    subscription.unsubscribe();
                }
            })
            .filter(results => results.length > 1)
            .mergeMap(
            results => {
                const files = _(results)
                    .map(result => result.filePath)
                    .compact()
                    .uniq()
                    .map(filePath => readFile$(filePath)
                        .map(content => ({ filePath, content: content.toString().split(/(?:\n|\r\n|\r)/g) })))
                    .value();

                return Observable.forkJoin(files);
            },
            (results, files) => ({ results, files }))
            .subscribe(({results, files}) => {
                const items: Reference.Symbol[] = [];
                for (const result of results) {
                    const filePath = result.filePath;
                    const file = _.find(files, file => file.filePath === result.filePath);

                    if (navigationHasRange(result)) {
                        const range = result.range;
                        const lines = _.map(_.range(range.start.row, range.end.row + 1), line => file.content[line]);

                        items.push({
                            filePath,
                            lines,
                            range
                        });
                    }
                }
                if (!view) {
                    view = new ReferenceView(this._navigation, items);
                } else {
                    view.setItems(items);
                }
            });

        _.each(providers, provider => provider.locate.next(atom.workspace.getActiveTextEditor()));
    }
}
