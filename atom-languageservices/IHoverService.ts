/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IHoverService = Symbol.for('IHoverService');
export interface IHoverService {
    registerProvider(hoverProvider: IHoverProvider): IDisposable;
}

export interface IHoverProvider extends IDisposable {
    request(editor: Hover.IRequest): Observable<Hover.IResponse>;
}

export namespace Hover {
    export interface IResponse {
        text: string;
        description?: string;
    }

    export interface IRequest {
        editor: Atom.TextEditor;
        location: TextBuffer.Point;
    }
}
