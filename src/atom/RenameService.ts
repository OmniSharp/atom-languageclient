/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import * as Services from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AtomChanges } from './AtomChanges';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { RenameView } from './views/RenameView';

@injectable
@alias(Services.IRenameService)
export class RenameService
    extends ProviderServiceBase<Services.IRenameProvider, Services.Rename.IRequest, Observable<Services.Text.IWorkspaceChange[]>, Observable<Services.Text.IWorkspaceChange[]>>
    implements Services.IRenameService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _changes: AtomChanges;
    private _source: AtomTextEditorSource;

    constructor(changes: AtomChanges, navigation: AtomNavigation, commands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._changes = changes;
        this._commands = commands;
        this._navigation = navigation;
        this._source = source;

        this._disposable.add(
            this._commands.add(Services.AtomCommands.CommandType.TextEditor, 'rename', () => {
                this.open();
            })
        );
    }

    protected createInvoke(callbacks: ((options: Services.Rename.IRequest) => Observable<Services.Text.IWorkspaceChange[]>)[]) {
        return (options: Services.Rename.IRequest) => {
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
            const view = new RenameView(this._commands, {
                word,
                editor: editor,
                location: editor!.getCursorBufferPosition()
            });
            view.rename$
                .take(1)
                .concatMap(options => {
                    return this.invoke(options);
                })
                .concatMap(changes => {
                    return this._changes.applyWorkspaceChanges(changes);
                })
                .subscribe();
        }
    }
}
