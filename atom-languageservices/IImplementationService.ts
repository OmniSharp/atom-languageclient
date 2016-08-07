/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import { IAtomNavigation } from './IAtomNavigation';

/* tslint:disable:variable-name */
export const IImplementationService = Symbol.for('IImplementationService');
export interface IImplementationService {
    registerProvider(provider: IImplementationProvider): IDisposable;
}

export interface IImplementationProvider extends IDisposable {
    request(editor: Implementation.IRequest): Observable<IAtomNavigation.Location[]>;
}

export namespace Implementation {
    export interface IRequest {
        editor: Atom.TextEditor;
        location: TextBuffer.Point;
    }
}
