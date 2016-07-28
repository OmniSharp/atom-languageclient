/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { DisposableBase, IDisposable } from 'ts-disposables';

export interface IDelayer extends IDisposable {
    trigger(task: () => void, delay?: number): Promise<void>;
    force(): void;
    isTriggered(): boolean;
    cancel(): void;
}

/* tslint:disable */
export const IDocumentDelayer = Symbol.for('IDocumentDelayer');
export interface IDocumentDelayer extends IDelayer { }
/* tslint:enable */

export class Delayer<T> extends DisposableBase {
    public defaultDelay: number = 100;
    private timeout: NodeJS.Timer | null;
    private completionPromise: Promise<T> | null;
    private onSuccess: (value?: void | Thenable<void>) => void;
    private task: (() => void);

    constructor() {
        super();
        this._disposable.add(() => this.cancel());
    }

    public trigger(task: () => void, delay: number = this.defaultDelay): Promise<T> {
        this.task = task;
        if (delay >= 0) {
            this._cancelTimeout();
        }

        if (!this.completionPromise) {
            /* tslint:disable-next-line:promise-must-complete */
            this.completionPromise = new Promise<void>((resolve) => {
                this.onSuccess = resolve;
            }).then(() => {
                this.completionPromise = null;
                this.task();
            });
        }

        if (delay >= 0 || this.timeout === null) {
            this.timeout = setTimeout(
                () => {
                    this.timeout = null;
                    this.onSuccess(undefined);
                },
                delay >= 0 ? delay : this.defaultDelay
            );
        }

        return this.completionPromise;
    }

    public force(): void {
        if (!this.completionPromise) {
            return undefined;
        }
        this._cancelTimeout();
        this.task();
        this.completionPromise = null;
    }

    public isTriggered(): boolean {
        return this.timeout !== null;
    }

    public cancel(): void {
        this._cancelTimeout();
        this.completionPromise = null;
    }

    private _cancelTimeout(): void {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}
