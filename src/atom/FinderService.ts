/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { NextObserver } from 'rxjs/Observer';
import { DisposableBase } from 'ts-disposables';
import { injectable } from '../di/decorators';
import { IFinderProvider, IFinderService } from '../services/_public';
import { AtomCommands, CommandType } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { FinderView } from './views/FinderView';

@injectable
export class FinderService extends DisposableBase implements IFinderService {
    private _providers = new Set<IFinderProvider>();
    private _results: Observable<{ filter: string; results: Finder.Symbol[] }>;
    private _resultsObserver: Observer<Set<IFinderProvider>>;
    private _filter: Observable<string>;
    private _filterObserver: NextObserver<string>;
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;

        const results$ = this._resultsObserver = new Subject<Set<IFinderProvider>>();
        const filter$ = this._filterObserver = new Subject<string>();
        this._filter = filter$.asObservable();

        const providers = results$
            .startWith(this._providers)
            .switchMap(selectedProviders => {
                return Observable.from<IFinderProvider>(<any>selectedProviders)
                    .mergeMap(x => x.results, (provider, results) => ({ provider, results }))
                    .scan<Map<IFinderProvider, Finder.Symbol[]>>(
                    (acc, { provider, results }) => {
                        acc.set(provider, results);
                        return acc;
                    },
                    new Map<IFinderProvider, Finder.Symbol[]>())
            });

        this._results = Observable.combineLatest(providers, filter$)
            .map(([map, filter]) => {
                // atom.project.relativizePath(item.filePath)
                const iterator = map.values();
                let result = iterator.next();
                const results: Finder.Symbol[] = [];
                while (!result.done) {
                    results.push(..._.map(result.value, value => {
                        value.filePath = atom.project.relativizePath(value.filePath)[1];
                        return value;
                    }));
                    result = iterator.next();
                }
                return { filter, results };
            });

        this._commands.add(CommandType.Workspace, 'finder', () => this.open());
    }

    public registerProvider(provider: IFinderProvider) {
        this._providers.add(provider);
        this._disposable.add(provider);
        this._resultsObserver.next(this._providers);
        this._filter.subscribe(provider.filter);
    }

    public open() {
        const view = new FinderView(this._navigation, this._results, this._filterObserver);
    }
}
