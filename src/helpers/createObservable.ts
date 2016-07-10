/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { Observable, Subscriber, Subscription } from 'rxjs';
export const createObservable: <T>(callback: (observer: Subscriber<T>) => Subscription | Function | void) => Observable<T> = <any>Observable.create;
