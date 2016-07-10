/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { IDisposable } from 'ts-disposables';
import { createObservable } from './createObservable';

export function observeCallback<T>(method: (callback: (item: T) => void) => IDisposable, thisContext: any) {
    method = _.bind(method, thisContext);
    return createObservable<T>(observer => {
        const disposable = method((item) => {
            observer.next(item);
        });

        return () => disposable.dispose();
    });
}
