/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CancellationToken, CancellationTokenSource } from 'vscode-jsonrpc';
import { createObservable } from '../helpers/createObservable';

export function observePromise<T>(method: (token: CancellationToken) => Thenable<T>): Observable<T> {
    return createObservable<T>(observer => {
        const cts = new CancellationTokenSource();
        method(cts.token).then(_.flow(_.bind(observer.next, observer), _.bind(observer.complete, observer)), _.bind(observer.error, observer));
        return () => cts.cancel();
    }).publishReplay(1).refCount();
}
