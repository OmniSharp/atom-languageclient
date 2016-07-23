/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { DisposableBase } from 'ts-disposables';
import { injectable } from '../di/decorators';
import { IWorkspaceFinderProvider, IWorkspaceFinderService } from '../services/_public';
import { AtomCommands, CommandType } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { WorkspaceFinderView } from './views/WorkspaceFinderView';

@injectable
export class WorkspaceFinderService extends DisposableBase implements IWorkspaceFinderService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _filter$ = new Subject<string>();
    private _providers = new Set<IWorkspaceFinderProvider>();
    private _results$: Observable<{ filter: string; results: Finder.Symbol[] }>;

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._results$ = this._getResults();
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
                new Map<IWorkspaceFinderProvider, Finder.Symbol[]>())
        });

        return Observable.combineLatest(providers, this._filter$)
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
    }

    public registerProvider(provider: IWorkspaceFinderProvider) {
        this._commands.add(CommandType.Workspace, `finder-workspace`, () => this.open());
        this._filter$.subscribe(provider.filter);
        this._providers.add(provider);
        this._disposable.add(provider, () => this._providers.delete(provider));
    }

    public open() {
        const view = new WorkspaceFinderView(this._navigation, this._results$, this._filter$);
    }
}
