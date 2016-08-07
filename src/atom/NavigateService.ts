/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CommandType, IAtomNavigation, INavigateProvider, INavigateService, Navigate } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { CompositeDisposable } from 'ts-disposables';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { atomConfig } from '../decorators';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { CommandsService } from './CommandsService';
type Location = IAtomNavigation.Location;

@injectable
@alias(INavigateService)
@atomConfig({
    default: true,
    description: 'Adds support for navigation'
})
export class NavigateService
    extends ProviderServiceBase<INavigateProvider, Navigate.IRequest, Observable<TextBuffer.Point>, Observable<TextBuffer.Point>>
    implements INavigateService {
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
        return new CompositeDisposable(
            this._commands.add(CommandType.TextEditor, 'navigate-down', 'ctrl-alt-down', () => this.navigateDown()),
            this._commands.add(CommandType.TextEditor, 'navigate-up', 'ctrl-alt-up', () => this.navigateUp())
        );
    }

    protected createInvoke(callbacks: ((options: Navigate.IRequest) => Observable<TextBuffer.Point>)[]) {
        return ((options: Navigate.IRequest) => {
            const requests = _.over(callbacks)(options);
            return Observable.from(requests)
                .mergeMap(_.identity)
                .take(1);
        });
    }

    public navigateUp() {
        const editor = this._source.activeTextEditor;
        if (editor) {
            this.invoke({
                editor: editor,
                location: editor!.getCursorBufferPosition(),
                direction: 'up'
            }).subscribe(location => {
                this._navigation.navigateTo({
                    filePath: editor.getPath(),
                    location
                });
            });
        }
    }

    public navigateDown() {
        const editor = this._source.activeTextEditor;
        if (editor) {
            this.invoke({
                editor: editor,
                location: editor!.getCursorBufferPosition(),
                direction: 'down'
            }).subscribe(location => {
                this._navigation.navigateTo({
                    filePath: editor.getPath(),
                    location
                });
            });
        }
    }
}
