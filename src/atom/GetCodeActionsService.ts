/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import * as Services from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { IDisposable } from 'ts-disposables';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AtomCommands } from './AtomCommands';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { AtomViewFinder } from './AtomViewFinder';
import { CodeActionView } from './views/CodeActionView';
import { RunCodeActionService } from './RunCodeActionService';

@injectable()
@alias(Services.IGetCodeActionsService)
export class GetCodeActionsService
    extends ProviderServiceBase<Services.IGetCodeActionsProvider, Services.GetCodeActions.IRequest, Observable<Services.GetCodeActions.IResponse[]>, Observable<Services.GetCodeActions.IResponse[]>>
    implements Services.IGetCodeActionsService {
    private _commands: AtomCommands;
    private _textEditorSource: AtomTextEditorSource;
    private _viewFinder: AtomViewFinder;
    private _runCodeActionService: RunCodeActionService;
    private _view: CodeActionView;

    constructor(commands: AtomCommands, textEditorSource: AtomTextEditorSource, viewFinder: AtomViewFinder, runCodeActionService: RunCodeActionService) {
        super();
        this._commands = commands;
        this._textEditorSource = textEditorSource;
        this._viewFinder = viewFinder;
        this._runCodeActionService = runCodeActionService;

        // this._view = new CodeActionView(commands, viewFinder, editor);

        this._disposable.add(
            this._commands.add(Services.AtomCommands.CommandType.TextEditor, `get-code-actions`, () => this.show())
        );
    }

    protected createInvoke(callbacks: ((options: Services.GetCodeActions.IRequest) => Observable<Services.GetCodeActions.IResponse[]>)[]) {
        return (options: Services.GetCodeActions.IRequest) => {
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
                    this._view = new CodeActionView(this._commands, this._viewFinder, editor);
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
