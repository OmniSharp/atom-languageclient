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
    private _finders = new Map<string, {
        filter$: Subject<string>;
        providers$: Observer<IFinderProvider>;
        results$: Observable<{ filter: string; results: Finder.Symbol[] }>;
    }>();
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;
    }

    public static get() {
        const providers$ = new Subject<IFinderProvider>();
        const filter$ = new Subject<string>();

        const providers = providers$
            .scan<IFinderProvider[]>(
            (acc, value) => {
                if (_.indexOf(acc, value) > -1) {
                    _.pull(acc, value);
                } else {
                    acc.push(value);
                }
                return acc;
            },
            [])
            .switchMap(selectedProviders => {
                return Observable.from<IFinderProvider>(selectedProviders)
                    .mergeMap(x => x.results, (provider, results) => ({ provider, results }))
                    .scan<Map<IFinderProvider, Finder.Symbol[]>>(
                    (acc, { provider, results }) => {
                        acc.set(provider, results);
                        return acc;
                    },
                    new Map<IFinderProvider, Finder.Symbol[]>())
            });

        const results$ = Observable.combineLatest(providers, filter$)
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
        return { filter$: filter$, providers$, results$ };
    }

    public registerProvider(provider: IFinderProvider) {
        if (!this._finders.has(provider.name)) {
            this._finders.set(provider.name, FinderService.get());
            this._commands.add(CommandType.Workspace, `finder-${provider.name}`, () => this.open(provider.name));
        }

        const context = this._finders.get(provider.name) !;
        context.filter$.subscribe(provider.filter);
        context.providers$.next(provider);
        this._disposable.add(provider);
    }

    public open(name: string) {
        const context = this._finders.get(name) !;
        const view = new FinderView(this._navigation, context.results$, context.filter$);
    }
}
