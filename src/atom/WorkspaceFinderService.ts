/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { Disposable, DisposableBase } from 'ts-disposables';
import { alias, injectable } from '../services/_decorators';
import { ATOM_COMMANDS, IWorkspaceFinderProvider, IWorkspaceFinderService } from '../services/_public';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { WorkspaceFinderView } from './views/WorkspaceFinderView';

const MAX_ITEMS = 100;

@injectable
@alias(IWorkspaceFinderService)
export class WorkspaceFinderService extends DisposableBase implements IWorkspaceFinderService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _filter$ = new Subject<string>();
    private _filterObservable$ = this._filter$.asObservable().lodashThrottle(300, { leading: true, trailing: true });
    private _providers = new Set<IWorkspaceFinderProvider>();
    private _results$: Observable<{ filter: string; results: Finder.Symbol[] }>;

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._results$ = this._getResults();

        this._disposable.add(
            Disposable.create(() => {
                this._providers.forEach(x => x.dispose());
                this._providers.clear();
            })
        );
    }

    private _getResults() {
        const providers = Observable.defer(() => {
            return Observable.from<IWorkspaceFinderProvider>(<any>this._providers)
                .mergeMap(x => x.results, (provider, results) => ({ provider, results }))
                .scan<Map<IWorkspaceFinderProvider, Finder.Symbol[]>>(
                (acc, { provider, results }) => {
                    acc.set(provider, results);
                    return acc;
                },
                new Map<IWorkspaceFinderProvider, Finder.Symbol[]>());
        });

        return Observable.combineLatest(providers, this._filter$)
            .map(([map, filter]) => {
                // atom.project.relativizePath(item.filePath)
                const iterator = map.values();
                let result = iterator.next();
                const results: Finder.Symbol[] = [];
                while (!result.done) {
                    results.push(..._.map(_.take(result.value, MAX_ITEMS), value => {
                        value.filePath = atom.project.relativizePath(value.filePath)[1];
                        return value;
                    }));
                    result = iterator.next();
                }
                return { filter, results };
            });
    }

    public registerProvider(provider: IWorkspaceFinderProvider) {
        this._disposable.add(
            this._commands.add(ATOM_COMMANDS.CommandType.Workspace, `finder-workspace`, () => this.open())
        );
        const sub = this._filterObservable$.subscribe(provider.filter);
        this._providers.add(provider);

        return Disposable.create(() => {
            sub.unsubscribe();
            this._providers.delete(provider);
        });
    }

    public open() {
        const view = new WorkspaceFinderView(this._navigation, this._results$, this._filter$);
        view.setMaxItems(MAX_ITEMS);
    }
}
