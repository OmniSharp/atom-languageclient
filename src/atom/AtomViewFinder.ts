/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */

import { alias, injectable } from '../services/_decorators';
import { IAtomViewFinder } from '../services/_public';

@injectable
@alias(IAtomViewFinder)
export class AtomViewFinder implements IAtomViewFinder {
    /* tslint:disable-next-line:no-any */
    public getView(item: any): HTMLElement {
        return atom.views.getView(item);
    }
}
