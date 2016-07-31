/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import { Text } from './Text';

/* tslint:disable:variable-name */
export const IFormatService = Symbol.for('IFormatService');
export interface IFormatService {
    registerProvider(hoverProvider: IFormatProvider): IDisposable;
}

export interface IFormatProvider extends IDisposable {
    request(options: Format.RangeOptions | Format.DocumentOptions): Observable<Text.FileChange[]>;
}

export namespace Format {
    /* tslint:disable-next-line:no-any */
    export function formatRange(options: any): options is RangeOptions {
        return !!options.range;
    }
    export interface Base {
        insertSpaces: boolean;
        tabSize: number;
    }
    export interface DocumentOptions extends Base {
        editor: Atom.TextEditor;
    }
    export interface RangeOptions extends Base {
        editor: Atom.TextEditor;
        range: TextBuffer.Range;
    }
    export type FormatOptions  = DocumentType | RangeOptions;
}
