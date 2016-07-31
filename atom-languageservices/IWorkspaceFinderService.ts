/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { NextObserver } from 'rxjs/Observer';
import { IDisposable } from 'ts-disposables';
import { Finder } from './Finder';

/* tslint:disable:variable-name */
export const IWorkspaceFinderService = Symbol.for('IWorkspaceFinderService');
export interface IWorkspaceFinderService {
    registerProvider(provider: IWorkspaceFinderProvider): IDisposable;
}

export interface IWorkspaceFinderProvider extends IDisposable {
    results: Observable<Finder.Item[]>;
    filter: NextObserver<string>;
}
