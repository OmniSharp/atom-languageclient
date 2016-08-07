/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { CommandType, Finder, IWorkspaceFinderProvider, IWorkspaceFinderService } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { Disposable } from 'ts-disposables';
import { FeatureServiceBase } from './_FeatureServiceBase';
import { AtomCommands } from './AtomCommands';
import { AtomLanguageClientConfig } from '../AtomLanguageClientConfig';
import { AtomNavigation } from './AtomNavigation';
import { CommandsService } from './CommandsService';
import { WorkspaceFinderView } from './views/WorkspaceFinderView';

const MAX_ITEMS = 100;

@injectable
@alias(IWorkspaceFinderService)
export class WorkspaceFinderService extends FeatureServiceBase implements IWorkspaceFinderService {
    private _navigation: AtomNavigation;
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _filter$ = new Subject<string>();
    private _filterObservable$ = this._filter$.asObservable().lodashThrottle(300, { leading: true, trailing: true });
    private _providers = new Set<IWorkspaceFinderProvider>();
    private _results$: Observable<{ filter: string; results: Finder.IResponse[] }>;

    constructor(packageConfig: AtomLanguageClientConfig, navigation: AtomNavigation, commands: CommandsService, atomCommands: AtomCommands) {
        super(WorkspaceFinderService, packageConfig, {
            default: true,
            description: 'Adds ability to find all symbols on a servers workspace'
        });
        this._navigation = navigation;
        this._commands = commands;
        this._atomCommands = atomCommands;
        this._results$ = this._getResults();

        this._disposable.add(
            Disposable.create(() => {
                this._providers.forEach(x => x.dispose());
                this._providers.clear();
            })
        );
    }

    public onEnabled() {
        return this._commands.add(CommandType.Workspace, `finder-workspace`, ['ctrl-,', 'alt-shift-t'], () => this.open());
    }

    private _getResults() {
        const providers = Observable.defer(() => {
            /* tslint:disable-next-line:no-any */
            return Observable.from<IWorkspaceFinderProvider>(<any>this._providers)
                .mergeMap(x => x.results, (provider, results) => ({ provider, results }))
                .scan<Map<IWorkspaceFinderProvider, Finder.IResponse[]>>(
                (acc, { provider, results }) => {
                    acc.set(provider, results);
                    return acc;
                },
                new Map<IWorkspaceFinderProvider, Finder.IResponse[]>());
        });

        return Observable.combineLatest(providers, this._filter$)
            .map(([map, filter]) => {
                // atom.project.relativizePath(item.filePath)
                const iterator = map.values();
                let result = iterator.next();
                const results: Finder.IResponse[] = [];
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
        const sub = this._filterObservable$.subscribe(provider.filter);
        this._providers.add(provider);

        return Disposable.create(() => {
            sub.unsubscribe();
            this._providers.delete(provider);
        });
    }

    public open() {
        const view = new WorkspaceFinderView(this._atomCommands, this._navigation, this._results$, this._filter$);
        view.setMaxItems(MAX_ITEMS);
    }
}
