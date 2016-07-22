/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { NextObserver } from 'rxjs/Observer';
import { IDisposable } from 'ts-disposables';
import { AtomNavigationLocation } from './IAtomNavigation';

/* tslint:disable:variable-name */
export const IDefinitionService = Symbol.for('IAtomDefinitionService');
export interface IDefinitionService {
    registerProvider(provider: IDefinitionProvider): void;
}

export interface IDefinitionProvider extends IDisposable {
    locate: NextObserver<Atom.TextEditor>;
    response: Observable<AtomNavigationLocation>;
}
