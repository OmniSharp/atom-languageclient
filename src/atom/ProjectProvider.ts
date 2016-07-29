/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { alias, injectable } from 'atom-languageservices';
import { IProjectProvider } from 'atom-languageservices';

@injectable
@alias(IProjectProvider)
export class ProjectProvider implements IProjectProvider {
    public getPaths() { return atom.project.getPaths(); }
    public onDidChangePaths(callback: (paths: string[]) => void) {
        return atom.project.onDidChangePaths(callback);
    }
}
