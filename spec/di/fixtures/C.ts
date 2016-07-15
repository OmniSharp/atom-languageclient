/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { A } from './A';
import { B } from './B';

@injectable
export class C {
    private _a: A;
    private _b: B;
    constructor(a: A, b: B) {
        this._a = a;
        this._b = b;
    }

    public a1() { return this._a.a1(); }
    public b1() { return this._b.b1(); }
    public c1() { return 'c'; }
}
