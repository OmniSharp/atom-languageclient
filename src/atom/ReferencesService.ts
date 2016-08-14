/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CommandType, IAtomNavigation, IReferencesProvider, IReferencesService, Reference, navigationHasRange } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { readFile } from 'fs';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { atomConfig } from '../decorators';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { CommandsService } from './CommandsService';
import { ReferenceView } from './views/ReferenceView';
type Location = IAtomNavigation.Location;

const readFile$ = Observable.bindNodeCallback(readFile);

@injectable
@alias(IReferencesService)
@atomConfig({
    default: true,
    description: 'Adds support to find references.'
})
export class ReferencesService
    extends ProviderServiceBase<IReferencesProvider, Reference.IRequest, Observable<Location[]>, Observable<Location[]>>
    implements IReferencesService {
    private _navigation: AtomNavigation;
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _source: AtomTextEditorSource;

    constructor(navigation: AtomNavigation, commands: CommandsService, atomCommands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
    }

    public onEnabled() {
        return this._commands.add(CommandType.TextEditor, 'find-usages', 'shift-f12', () => {
            const editor = this._source.activeTextEditor;
            this.open({
                editor: editor,
                position: editor.getCursorScreenPosition(),
                filePath: editor.getURI()
            });
        });
    }

    protected createInvoke(callbacks: ((context: Reference.IRequest) => Observable<Location[]>)[]) {
        return ((options: Reference.IRequest) => {
            const requests = _.over(callbacks)(options);
            return Observable.from(requests)
                .mergeMap(_.identity)
                .scan((acc, value) => { acc.push(...value); return acc; }, [])
                .debounceTime(200);
        });
    }

    public open(options: Reference.IRequest) {
        let view: ReferenceView;
        this.invoke(options)
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
                const items: Reference.IResponse[] = [];
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
                    view = new ReferenceView(this._atomCommands, this._navigation, items);
                } else {
                    view.setItems(items);
                }
            });
    }
}
