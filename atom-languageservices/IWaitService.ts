/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
export const IWaitService = Symbol.for('IWaitService');
export interface IWaitService {
    readonly waiting: boolean;
    readonly waiting$: Observable<boolean>;
    waitUntil(emit: Promise<void> | Observable<void>): void;
}
