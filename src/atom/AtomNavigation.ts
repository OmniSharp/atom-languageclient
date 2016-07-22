/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { injectable } from '../di/decorators';
import { AtomNavigationLocation, IAtomNavigation } from '../services/_public';

@injectable
export class AtomNavigation implements IAtomNavigation {
    public navigateTo({filePath, range}: AtomNavigationLocation) {
        if (range) {
            return atom.workspace.open(filePath, { initialLine: range.start.row, initialColumn: range.start.column });
        } else {
            return atom.workspace.open(filePath);
        }
    }
}
