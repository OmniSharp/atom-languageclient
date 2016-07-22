/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { NextObserver } from 'rxjs/Observer';
import { IDisposable } from 'ts-disposables';
/* tslint:disable:variable-name */
export const IFinderService = Symbol.for('IAtomFinderService');
export interface IFinderService {
    registerProvider(provider: IFinderProvider): void;
}

export interface IFinderProvider extends IDisposable {
    name: 'workspace' | 'document';
    results: Observable<Finder.Symbol[]>;
    filter: NextObserver<string>;
}
