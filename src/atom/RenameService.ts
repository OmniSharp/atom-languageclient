/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CommandType, IRenameProvider, IRenameService, Rename, Text } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { atomConfig } from '../decorators';
import { AtomChanges } from './AtomChanges';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { CommandsService } from './CommandsService';
import { RenameView } from './views/RenameView';
import { WaitService } from './WaitService';

@injectable
@alias(IRenameService)
@atomConfig({
    default: true,
    description: 'Adds support for renaming symbols'
})
export class RenameService
    extends ProviderServiceBase<IRenameProvider, Rename.IRequest, Observable<Text.IWorkspaceChange[]>, Observable<Text.IWorkspaceChange[]>>
    implements IRenameService {
    private _navigation: AtomNavigation;
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _changes: AtomChanges;
    private _source: AtomTextEditorSource;
    private _waitService: WaitService;

    constructor(changes: AtomChanges, navigation: AtomNavigation, commands: CommandsService, atomCommands: AtomCommands, source: AtomTextEditorSource, waitService: WaitService) {
        super();
        this._changes = changes;
        this._commands = commands;
        this._atomCommands = atomCommands;
        this._navigation = navigation;
        this._source = source;
        this._waitService = waitService;
    }

    public onEnabled() {
        return this._commands.add(CommandType.TextEditor, 'rename', 'f2', () => this.open());
    }

    protected createInvoke(callbacks: ((options: Rename.IRequest) => Observable<Text.IWorkspaceChange[]>)[]) {
        return (options: Rename.IRequest) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce(
                (acc, results) => {
                    return acc.concat(results);
                },
                []);
        };
    }

    public open() {
        const editor = this._source.activeTextEditor;
        if (editor) {
            let word = editor.getWordUnderCursor();
            word = _.trim(word, '()[]{}');
            const view = new RenameView(this._atomCommands, {
                word,
                editor: editor,
                location: editor!.getCursorBufferPosition()
            });
            view.rename$
                .take(1)
                .concatMap(options => {
                    const result = this.invoke(options)
                        .concatMap(changes => {
                            return this._changes.applyWorkspaceChanges(changes);
                        })
                        .toPromise();
                    this._waitService.waitUntil(result);
                    return result;
                })
                .toPromise();
        }
    }
}
