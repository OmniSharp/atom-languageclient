/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { DisposableBase, IDisposable } from 'ts-disposables';
export interface IDelayer extends IDisposable {
    trigger(editor: Atom.TextEditor, task: () => void, delay?: number): Promise<void>;
    force(): void;
    isTriggered(): boolean;
    cancel(): void;
}

/* tslint:disable */
export const IDocumentDelayer = Symbol.for('IDocumentDelayer');
export interface IDocumentDelayer extends IDelayer { }
/* tslint:enable */

export class Delayer<T> extends DisposableBase implements IDelayer {
    public defaultDelay: number = 100;
    private timeout: NodeJS.Timer | null;
    private completionPromise: Promise<T> | null;
    private onSuccess: (value?: void | Thenable<void>) => void;
    private tasks = new Map<Atom.TextEditor, () => void>();

    constructor() {
        super();
        this._disposable.add(() => this.cancel());
    }

    public trigger(editor: Atom.TextEditor, task: () => void, delay: number = this.defaultDelay): Promise<T> {
        if (this.tasks.has(editor)) {
            this.tasks.delete(editor);
        }
        this.tasks.set(editor, task);
        if (delay >= 0) {
            this._cancelTimeout();
        }

        if (!this.completionPromise) {
            /* tslint:disable-next-line:promise-must-complete */
            this.completionPromise = new Promise<void>((resolve) => {
                this.onSuccess = resolve;
            }).then(() => {
                this.completionPromise = null;
                this._execute();
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

    private _execute() {
        _.each(_.toArray(this.tasks.values()), task => {
            task();
        });
        this.tasks.clear();
    }

    public force(): void {
        if (!this.completionPromise) {
            return undefined;
        }
        this._cancelTimeout();
        this._execute();
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
