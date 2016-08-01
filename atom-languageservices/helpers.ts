/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';

export namespace helpers {
    export function isObservable(value: any): value is Observable<any> {
        return value && value.subscribe;
    }

    export function isPromise(value: any): value is Promise<any> {
        return value && value.then;
    }
}
