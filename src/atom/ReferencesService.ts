/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ATOM_COMMANDS, ATOM_NAVIGATION, IReferencesProvider, IReferencesService, alias, injectable } from 'atom-languageservices';
import { readFile } from 'fs';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { ReferenceView } from './views/ReferenceView';
const {navigationHasRange} = ATOM_NAVIGATION;

const readFile$ = Observable.bindNodeCallback(readFile);

@injectable
@alias(IReferencesService)
export class ReferencesService
    extends ProviderServiceBase<IReferencesProvider, Atom.TextEditor, Observable<AtomNavigationLocation[]>, Observable<AtomNavigationLocation[]>>
    implements IReferencesService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _source: AtomTextEditorSource;

    constructor(navigation: AtomNavigation, commands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;

        this._commands.add(ATOM_COMMANDS.CommandType.TextEditor, 'references', () => this.open());
    }

    protected createInvoke(callbacks: ((options: Atom.TextEditor) => Observable<AtomNavigationLocation[]>)[]) {
        return ((options: Atom.TextEditor) => {
            const requests = _.over(callbacks)(options);
            return Observable.from(requests)
                .mergeMap(_.identity)
                .scan((acc, value) => { acc.push(...value); return acc; }, [])
                .debounceTime(200);
        });
    }

    public open() {
        let view: ReferenceView;
        this.invoke(this._source.activeTextEditor)
            .switchMap(
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
                    view = new ReferenceView(this._commands, this._navigation, items);
                } else {
                    view.setItems(items);
                }
            });
    }
}
