/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { IRunCodeActionProvider, IRunCodeActionService, RunCodeAction, Text } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { Disposable } from 'ts-disposables';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { atomConfig } from '../decorators';
import { AtomChanges } from './AtomChanges';

@injectable()
@alias(IRunCodeActionService)
@atomConfig({
    default: true,
    description: 'Adds support for running code actions from a list of actual code actions'
})
export class RunCodeActionService
    extends ProviderServiceBase<IRunCodeActionProvider, RunCodeAction.IRequest, Observable<Text.IWorkspaceChange[]>, Observable<Text.IWorkspaceChange[]>>
    implements IRunCodeActionService {
    private _changes: AtomChanges;

    constructor(changes: AtomChanges) {
        super();
        this._changes = changes;
    }

    public onEnabled() {
        return Disposable.empty;
    }

    protected createInvoke(callbacks: ((options: RunCodeAction.IRequest) => Observable<Text.IWorkspaceChange[]>)[]) {
        return (options: RunCodeAction.IRequest) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce((acc, results) => _.compact(acc.concat(results)), []);
        };
    }

    public request(options: RunCodeAction.IRequest) {
        this.invoke(options)
            .concatMap(changes => {
                return this._changes.applyWorkspaceChanges(changes);
            })
            .subscribe();
    }
}
