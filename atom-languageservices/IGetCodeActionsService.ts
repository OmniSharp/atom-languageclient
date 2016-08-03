/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IGetCodeActionsService = Symbol.for('IGetCodeActionsService');
export interface IGetCodeActionsService {
    registerProvider(getCodeActionProvider: IGetCodeActionsProvider): IDisposable;
}

export interface IGetCodeActionsProvider extends IDisposable {
    request(editor: GetCodeActions.IRequest): Observable<GetCodeActions.IResponse[]>;
}

export namespace GetCodeActions {
    export interface IRequest {
        editor: Atom.TextEditor;
        range: TextBuffer.Range;
        context: any;
    }

    export interface IResponse {
        id: string;
        name: string;
        title: string;
    }
}
