/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const INavigateService = Symbol.for('INavigateService');
export interface INavigateService {
    registerProvider(provider: INavigateProvider): IDisposable;
}

export interface INavigateProvider extends IDisposable {
    request(editor: Navigate.IRequest): Observable<TextBuffer.Point>;
}

export namespace Navigate {
    export interface IRequest {
        editor: Atom.TextEditor;
        location: TextBuffer.Point;
        direction: 'up' | 'down';
    }
}
