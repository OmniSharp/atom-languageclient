/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { BehaviorSubject, Observable } from 'rxjs';
import { IWaitService, helpers } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';

@injectable
@alias(IWaitService)
export class WaitService implements IWaitService {
    private _waiting: boolean;
    private _waiting$: Observable<boolean>;
    private _waitingObserver: BehaviorSubject<boolean>;

    constructor() {
        this._waiting$ = this._waitingObserver = new BehaviorSubject(false);
        this._waiting$.subscribe(waiting => this._waiting = waiting);
    }

    public get waiting() { return this._waiting; }
    public get waiting$() { return this._waiting$; }

    public waitUntil(emit: Promise<void> | Observable<void>) {
        this._waitingObserver.next(true);

        if (helpers.isPromise(emit)) {
            emit.then(
                () => {
                    this._waitingObserver.next(false);
                },
                () => {
                    this._waitingObserver.next(false);
                });
        } else {
            emit.subscribe({
                error: () => {
                    this._waitingObserver.next(false);
                },
                complete: () => {
                    this._waitingObserver.next(false);
                }
            });
        }
    }
}
