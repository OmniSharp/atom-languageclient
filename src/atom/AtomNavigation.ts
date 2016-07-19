/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { injectable } from '../di/decorators';

@injectable
export class AtomNavigation {
    public navigateTo({filePath, location}: {
        filePath: string;
        location?: TextBuffer.Point;
    }) {
        if (location) {
            return atom.workspace.open(filePath, { initialLine: location.row, initialColumn: location.column });
        } else {
            return atom.workspace.open(filePath);
        }
    }
}
