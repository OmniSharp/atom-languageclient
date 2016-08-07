/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CommandType, GetCodeActions, IGetCodeActionsProvider, IGetCodeActionsService } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AtomCommands } from './AtomCommands';
import { AtomLanguageClientConfig } from '../AtomLanguageClientConfig';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { AtomViewFinder } from './AtomViewFinder';
import { CodeActionView } from './views/CodeActionView';
import { CommandsService } from './CommandsService';
import { RunCodeActionService } from './RunCodeActionService';

@injectable()
@alias(IGetCodeActionsService)
export class GetCodeActionsService
    extends ProviderServiceBase<IGetCodeActionsProvider, GetCodeActions.IRequest, Observable<GetCodeActions.IResponse[]>, Observable<GetCodeActions.IResponse[]>>
    implements IGetCodeActionsService {
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _textEditorSource: AtomTextEditorSource;
    private _viewFinder: AtomViewFinder;
    private _runCodeActionService: RunCodeActionService;
    private _view: CodeActionView;

    constructor(packageConfig: AtomLanguageClientConfig, commands: CommandsService, atomCommands: AtomCommands, textEditorSource: AtomTextEditorSource, viewFinder: AtomViewFinder, runCodeActionService: RunCodeActionService) {
        super(GetCodeActionsService, packageConfig, {
            default: true,
            description: 'Adds support for code actions'
        });
        this._commands = commands;
        this._atomCommands = atomCommands;
        this._textEditorSource = textEditorSource;
        this._viewFinder = viewFinder;
        this._runCodeActionService = runCodeActionService;

        // this._view = new CodeActionView(commands, viewFinder, editor);
    }

    public onEnabled() {
        return this._commands.add(CommandType.TextEditor, `get-code-actions`, ['ctrl-.', 'alt-enter'], () => this.show());
    }

    protected createInvoke(callbacks: ((options: GetCodeActions.IRequest) => Observable<GetCodeActions.IResponse[]>)[]) {
        return (options: GetCodeActions.IRequest) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .scan((acc, results) => _.compact(acc.concat(results)), []);
        };
    }

    public show() {
        const editor = this._textEditorSource.activeTextEditor;
        if (editor) {
            const range = editor.getSelectedBufferRange();
            const request = this.invoke({ editor, range, context: {} })
                .share();
            request
                .take(1)
                .subscribe(() => {
                    this._view = new CodeActionView(this._atomCommands, this._viewFinder, editor);
                    this._view.codeaction$
                        .subscribe(selected => {
                            this._view.dispose();
                            this._runCodeActionService.request({
                                editor, range, identifier: selected.id, context: {}
                            });
                        });
                });

            request
                .scan((acc, results) => acc.concat(results), [])
                .subscribe(rows => {
                    this._view.setItems(rows);
                });
        }
    }
}
