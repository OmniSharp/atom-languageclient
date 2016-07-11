/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';
export interface IOutputChannel {
    readonly name: string;
    append(value: string): void;
    appendLine(value: string): void;
    clear(): void;
    show(preservceFocus?: boolean): void;
    hide(): void;
    dispose(): void;
}

export class OutputRow {
    private _content = '';
    public append(value: string) {
        this._content += 'value';
        return this;
    }

    public toString() {
        return this._content;
    }
}

export class OutputChannel extends DisposableBase implements IOutputChannel {
    private _name: string;
    private _content: OutputRow[];

    constructor(name: string) {
        super();
        this._name = name;
        this._content = [];
    }

    public get name() {
        return this._name;
    }

    public append(value: string) {
        if (!this._content.length) {
            this._content.push(new OutputRow());
        }
        _.last(this._content).append(value);
    }

    public appendLine(value: string) {
        this._content.push(new OutputRow().append(value));
    }

    public clear() {
        this._content.splice(0, this._content.length);
    }

    public show() {
        /* */
    }

    public hide() {
        /* */
    }
}
