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

@injectable()
@alias(Services.IRunCodeActionService)
export class RunCodeActionService
    extends ProviderServiceBase<Services.IRunCodeActionProvider, Services.RunCodeAction.IRequest, Observable<Services.Text.IWorkspaceChange[]>, Observable<Services.Text.IWorkspaceChange[]>>
    implements Services.IRunCodeActionService {
    private _changes: AtomChanges;

    constructor(changes: AtomChanges) {
        super();
        this._changes = changes;
    }

    protected createInvoke(callbacks: ((options: Services.RunCodeAction.IRequest) => Observable<Services.Text.IWorkspaceChange[]>)[]) {
        return (options: Services.RunCodeAction.IRequest) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce((acc, results) => _.compact(acc.concat(results)), []);
        };
    }

    public request(options: Services.RunCodeAction.IRequest) {
        this.invoke(options)
            .concatMap(changes => {
                return this._changes.applyWorkspaceChanges(changes);
            })
            .subscribe();
    }
}
