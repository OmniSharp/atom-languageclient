/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { DisposableBase } from 'ts-disposables';
import { injectable } from '../di/decorators';
import { IDocumentFinderProvider, IDocumentFinderService } from '../services/_public';
import { AtomCommands, CommandType } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { DocumentFinderView } from './views/DocumentFinderView';

@injectable
export class DocumentFinderService extends DisposableBase implements IDocumentFinderService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _providers = new Set<IDocumentFinderProvider>();
    private _results$: Observable<Finder.Symbol[]>;

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._results$ = this._getResults();
    }

    private _getResults() {
        return Observable.defer(() => {
            return Observable.from<IDocumentFinderProvider>(<any>this._providers)
                .mergeMap(x => x.results, (provider, results) => ({ provider, results }))
                .scan<Map<IDocumentFinderProvider, Finder.Symbol[]>>(
                (acc, { provider, results }) => {
                    acc.set(provider, results);
                    return acc;
                },
                new Map<IDocumentFinderProvider, Finder.Symbol[]>())
                .map((map) => {
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
                    return results;
                });
        });
    }

    public registerProvider(provider: IDocumentFinderProvider) {
        this._commands.add(CommandType.TextEditor, `finder-document`, () => this.open());
        this._providers.add(provider);
        this._disposable.add(provider, () => this._providers.delete(provider));
    }

    public open() {
        const view = new DocumentFinderView(this._navigation, this._results$);
    }
}
