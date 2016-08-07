/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IAtomNavigation, navigationHasLocation, navigationHasRange } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';

@injectable
@alias(IAtomNavigation)
export class AtomNavigation implements IAtomNavigation {
    public navigateTo(context: IAtomNavigation.Location) {
        if (navigationHasRange(context)) {
            return atom.workspace.open(context.filePath, { initialLine: context.range.end.row, initialColumn: context.range.end.column });
        } else if (navigationHasLocation(context)) {
            /* tslint:disable-next-line:no-any */
            return atom.workspace.open(context.filePath, { initialLine: (<any>context).location.row, initialColumn: (<any>context).location.column });
        } else {
            return atom.workspace.open(context.filePath);
        }
    }
}
