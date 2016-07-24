/**
 *
 */
import { DebounceOptions, bind, debounce } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { TeardownLogic } from 'rxjs/Subscription';

export function lodashDebounce<T>(this: Observable<T>, duration: number, options?: DebounceOptions): Observable<T> {
    return this.lift(new LodashDebounceOperator<T>(duration, options || {}));
}

export interface LodashDebounceSignature<T> {
    (duration: number): Observable<T>;
}

declare module 'rxjs/Observable' {
    export interface Observable<T> {
        lodashDebounce: LodashDebounceSignature<T>;
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
        this._method = debounce(bind(this._dispatchNext, this));
    }

    protected _next(value: T): void {
        this._method(value);
    }

    private _dispatchNext(value: T) {
        if (this.isUnsubscribed) {
            return;
        }
        this.destination.next!(value);
    }
}
