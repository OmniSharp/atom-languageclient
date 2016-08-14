/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IAtomNavigation } from 'atom-languageservices';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IReferencesService = Symbol.for('IReferencesService');
export interface IReferencesService {
    registerProvider(provider: IReferencesProvider): IDisposable;
    open(request: Reference.IRequest): void;
}

export interface IReferencesProvider extends IDisposable {
    request(request: Reference.IRequest): Observable<IAtomNavigation.Location[]>;
}

export namespace Reference {
    export interface IRequest {
        editor: Atom.TextEditor;
        filePath: string;
        position: TextBuffer.Point;
    }
    export interface IResponse {
        lines: string[];
        filePath: string;
        range: TextBuffer.Range;
    }
}
