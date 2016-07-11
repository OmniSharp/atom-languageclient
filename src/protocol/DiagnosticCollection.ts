/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';

export class DiagnosticCollection {
    private _diagnostics = new Map<string, Linter.Message[]>();

    public set(uri: string, messages: Linter.Message[]) {
        this._diagnostics.set(uri, messages);
    }

    public clear() {
        this._diagnostics.clear();
    }

    public get diagnostics(){ return this._diagnostics; }
}
