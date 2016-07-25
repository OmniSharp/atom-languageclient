/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { NextObserver } from 'rxjs/Observer';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IReferencesService = Symbol.for('IReferencesService');
export interface IReferencesService {
    registerProvider(provider: IReferencesProvider): IDisposable;
}

export interface IReferencesProvider extends IDisposable {
    request(editor: Atom.TextEditor): Observable<AtomNavigationLocation[]>;
}
