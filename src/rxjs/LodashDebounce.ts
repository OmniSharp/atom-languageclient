/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { DebounceOptions, bind, debounce } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { TeardownLogic } from 'rxjs/Subscription';

export function lodashDebounce<T>(this: Observable<T>, duration: number, options?: DebounceOptions): Observable<T> {
    return this.lift(new LodashDebounceOperator<T>(duration, options || {}));
}

declare module 'rxjs/Observable' {
    /* tslint:disable-next-line:interface-name */
    export interface Observable<T> {
        lodashDebounce: typeof lodashDebounce;
    }
}

Observable.prototype.lodashDebounce = lodashDebounce;

class LodashDebounceOperator<T> implements Operator<T, T> {
    private _duration: number;
    private _options: DebounceOptions;
    constructor(duration: number, options: DebounceOptions) {
        this._duration = duration;
        this._options = options;
    }

    public call(subscriber: Subscriber<T>, source: any): TeardownLogic {
        return source._subscribe(new LodashDebounceSubscriber(subscriber, this._duration, this._options));
    }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class LodashDebounceSubscriber<T> extends Subscriber<T> {
    private _method: (value: T) => void;
    private _duration: number;

    constructor(destination: Subscriber<T>, duration: number, options: DebounceOptions) {
        super(destination);
        this._duration = duration;
        this._method = debounce(bind(this._dispatchNext, this), duration, options);
    }

    /* tslint:disable-next-line */
    protected _next(value: T): void {
        this._method(value);
    }

    private _dispatchNext(value: T) {
        if (this.closed) {
            return;
        }
        this.destination.next!(value);
    }
}
