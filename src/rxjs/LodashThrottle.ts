/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { ThrottleOptions, bind, throttle } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { TeardownLogic } from 'rxjs/Subscription';

export function lodashThrottle<T>(this: Observable<T>, duration: number): Observable<T>;
export function lodashThrottle<T>(this: Observable<T>, duration: number, options: ThrottleOptions): Observable<T>;
export function lodashThrottle<T>(this: Observable<T>, duration: number, options?: ThrottleOptions): Observable<T> {
    return this.lift(new LodashThrottleOperator<T>(duration, options || {}));
}

declare module 'rxjs/Observable' {
/* tslint:disable-next-line:interface-name */
    export interface Observable<T> {
        lodashThrottle: typeof lodashThrottle;
    }
}

Observable.prototype.lodashThrottle = lodashThrottle;

class LodashThrottleOperator<T> implements Operator<T, T> {
    private _duration: number;
    private _options: ThrottleOptions;
    constructor(duration: number, options: ThrottleOptions) {
        this._duration = duration;
        this._options = options;
    }

    public call(subscriber: Subscriber<T>, source: any): TeardownLogic {
        return source._subscribe(new LodashThrottleSubscriber(subscriber, this._duration, this._options));
    }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class LodashThrottleSubscriber<T> extends Subscriber<T> {
    private _method: (value: T) => void;
    private _duration: number;

    constructor(destination: Subscriber<T>, duration: number, options: ThrottleOptions) {
        super(destination);
        this._duration = duration;
        this._method = throttle(bind(this._dispatchNext, this));
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
