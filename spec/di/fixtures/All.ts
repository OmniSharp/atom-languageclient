/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { key } from '../../../src/di/decorators';
@key('list')
export class A {
    public a = 1;
}

@key('list')
export class B {
    public a = 2;
}

@key('list')
export class C {
    public a = 3;
}
