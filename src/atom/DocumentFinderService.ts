/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Disposable, DisposableBase } from 'ts-disposables';
import { alias, injectable } from '../services/_decorators';
import { ATOM_COMMANDS, IDocumentFinderProvider, IDocumentFinderService } from '../services/_public';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { DocumentFinderView } from './views/DocumentFinderView';

@injectable
@alias(IDocumentFinderService)
export class DocumentFinderService extends DisposableBase implements IDocumentFinderService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _providers = new Set<IDocumentFinderProvider>();
    private _invoke: (options: Atom.TextEditor) => Observable<Finder.Symbol[]>;

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;

        this._disposable.add(
            Disposable.create(() => {
                this._providers.forEach(x => x.dispose());
                this._providers.clear();
            }),
            this._commands.add(ATOM_COMMANDS.CommandType.TextEditor, `finder-document`, () => this.open())
        );
    }

    private _computeInvoke() {
        const callbacks = _.map(_.toArray(this._providers), provider => {
            return (options: Atom.TextEditor) => provider.request(options);
        });
        this._invoke = (options) => {
            return Observable.from(_.compact(_.over(callbacks)(options)))
                .mergeMap(_.identity)
                .scan(
                (acc, results) => {
                    _.each(results, result => {
                        result.filePath = atom.project.relativizePath(result.filePath)[1];
                    });
                    return acc.concat(results);
                },
                []);
        };
    }

    public registerProvider(provider: IDocumentFinderProvider) {
        this._providers.add(provider);
        this._computeInvoke();

        return Disposable.create(() => {
            this._providers.delete(provider);
            this._computeInvoke();
        });
    }

    public open() {
        const activeEditor = atom.workspace.getActiveTextEditor();
        if (activeEditor) {
            const view = new DocumentFinderView(this._navigation, this._invoke(activeEditor));
        }
    }
}
