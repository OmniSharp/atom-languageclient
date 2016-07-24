/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';

/* tslint:disable-next-line:variable-name */
export const IProjectTracker = Symbol.for('IProjectTracker');
export interface IProjectTracker {
    readonly added: Observable<string>;
    readonly removed: Observable<string>;
}
