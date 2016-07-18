/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';
import { ILinterService } from '../services/_public';

export abstract class Linter extends DisposableBase {
    private _linterService: ILinterService;
    private _linter: Linter.IndieLinter;
    private _diagnostics = new Map<string, Linter.Message[]>();

    constructor(
        name: string,
        linterService: ILinterService) {
        super();
        this._linterService = linterService;
        this._linter = this._linterService.getLinter(name);
        this._disposable.add(this._linter);
    }

    protected abstract configure(): void;

    protected setMessages(path: string, messages: Linter.Message[]) {
        this._diagnostics.set(path, messages);
        this.updateMessages();
    }

    protected updateMessages = _.throttle(
        () => {
            this._linter.setMessages(_.flatten(_.toArray(this._diagnostics.values())));
        },
        100,
        { trailing: true, leading: true });
}
