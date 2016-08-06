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
    request(options: Format.IRangeRequest | Format.IDocumentRequest): Observable<Text.IFileChange[]>;
}

export namespace Format {
    /* tslint:disable-next-line:no-any */
    export function formatHasRange(options: any): options is IRangeRequest {
        return !!options.range;
    }
    export interface IRequestBase {
        insertSpaces: boolean;
        tabSize: number;
    }
    export interface IDocumentRequest extends IRequestBase {
        editor: Atom.TextEditor;
    }
    export interface IRangeRequest extends IRequestBase {
        editor: Atom.TextEditor;
        range: TextBuffer.Range;
    }
    export type IRequest = IDocumentRequest | IRangeRequest;
}
