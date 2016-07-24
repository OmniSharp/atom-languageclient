/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { NextObserver } from 'rxjs/Observer';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IDefinitionService = Symbol.for('IDefinitionService');
export interface IDefinitionService {
    registerProvider(provider: IDefinitionProvider): IDisposable;
}

export interface IDefinitionProvider extends IDisposable {
    locate: NextObserver<Atom.TextEditor>;
    response: Observable<AtomNavigationLocation[]>;
}
