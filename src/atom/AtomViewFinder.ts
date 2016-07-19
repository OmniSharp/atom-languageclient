/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */

import { injectable } from '../di/decorators';
import { IAtomViewFinder } from '../services/_public';

@injectable
export class AtomViewFinder implements IAtomViewFinder {
    public getView(item: any): HTMLElement {
        return atom.views.getView(item);
    }
}
