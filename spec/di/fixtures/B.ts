/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { A } from './A';

@autoinject
export class B {
    private _a: A;
    constructor(a: A) {
        this._a = a;
    }

    public a1() { return this._a.a1(); }
    public b1() { return 'b'; }
}
