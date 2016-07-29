/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { alias, injectable } from 'atom-languageservices';
import { ATOM_NAVIGATION, IAtomNavigation } from 'atom-languageservices';
const { navigationHasLocation, navigationHasRange} = ATOM_NAVIGATION;

@injectable
@alias(IAtomNavigation)
export class AtomNavigation implements IAtomNavigation {
    public navigateTo(context: AtomNavigationLocation) {
        if (navigationHasRange(context)) {
            return atom.workspace.open(context.filePath, { initialLine: context.range.end.row, initialColumn: context.range.end.column });
        } else if (navigationHasLocation(location)) {
            /* tslint:disable-next-line:no-any */
            return atom.workspace.open(context.filePath, { initialLine: (<any>context).location.row, initialColumn: (<any>context).location.column });
        } else {
            return atom.workspace.open(context.filePath);
        }
    }
}
