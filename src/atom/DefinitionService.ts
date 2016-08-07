/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { CommandType, Definition, IAtomNavigation, IDefinitionProvider, IDefinitionService, KeymapPlatform, KeymapType, Reference, navigationHasRange } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { readFile } from 'fs';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AtomCommands } from './AtomCommands';
import { AtomLanguageClientConfig } from '../AtomLanguageClientConfig';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { CommandsService } from './CommandsService';
import { ReferenceView } from './views/ReferenceView';
type Location = IAtomNavigation.Location;

const readFile$ = Observable.bindNodeCallback(readFile);
@injectable
@alias(IDefinitionService)
export class DefinitionService
    extends ProviderServiceBase<IDefinitionProvider, Definition.IRequest, Observable<Location[]>, Observable<Location[]>>
    implements IDefinitionService {
    private _navigation: AtomNavigation;
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _source: AtomTextEditorSource;

    constructor(packageConfig: AtomLanguageClientConfig, navigation: AtomNavigation, commands: CommandsService, atomCommands: AtomCommands, source: AtomTextEditorSource) {
        super(DefinitionService, packageConfig, {
            default: true,
            description: 'Adds support for navigate to definition or definitions'
        });
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
    }

    public onEnabled() {
        return this._commands.add(CommandType.TextEditor, 'go-to-definition', 'f12', () => this.open());
    }

    protected createInvoke(callbacks: ((options: Definition.IRequest) => Observable<Location[]>)[]) {
        return ((options: Definition.IRequest) => {
            const requests = _.over(callbacks)(options);
            return Observable.from(requests)
                .mergeMap(_.identity)
                .scan((acc, value) => { acc.push(...value); return acc; }, [])
                .debounceTime(200);
        });
    }

    public open() {
        let view: ReferenceView;
        let subscription: Subscription;
        const editor = this._source.activeTextEditor;
        if (editor) {
            subscription = this.invoke({
                editor: editor,
                location: editor!.getCursorBufferPosition()
            }).do(results => {
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
}
