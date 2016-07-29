/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */

import { alias, injectable } from 'atom-languageservices';
import { IAtomViewFinder } from 'atom-languageservices';

@injectable
@alias(IAtomViewFinder)
export class AtomViewFinder implements IAtomViewFinder {
    /* tslint:disable-next-line:no-any */
    public getView(item: any): HTMLElement {
        return atom.views.getView(item);
    }
}
