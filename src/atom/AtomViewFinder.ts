/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { IAtomViewFinder } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';

@injectable
@alias(IAtomViewFinder)
export class AtomViewFinder implements IAtomViewFinder {
    public getView(item: any): HTMLElement;
    public getView<T extends Element>(item: any): T;
    public getView(item: any): any {
        return atom.views.getView(item);
    }
}
