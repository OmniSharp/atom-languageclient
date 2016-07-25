/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';

export namespace AtomFormat {
    export function formatRange(options: any): options is Format.RangeOptions {
        return !!options.range;
    }
}

/* tslint:disable:variable-name */
export const IFormatService = Symbol.for('IFormatService');
export interface IFormatService {
    registerProvider(hoverProvider: IFormatProvider): IDisposable;
}

export interface IFormatProvider extends IDisposable {
    request(options: Format.RangeOptions | Format.DocumentOptions): Observable<Text.FileChange[]>;
}
