/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';
/* tslint:disable:no-any variable-name */

export const IProjectProvider = Symbol.for('IProjectProvider');
export interface IProjectProvider {
    getPaths: typeof atom.project.getPaths;
    onDidChangePaths: (callback: (paths: string[]) => void) => IDisposable;
}
