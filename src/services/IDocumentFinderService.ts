/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
/* tslint:disable:variable-name */
export const IDocumentFinderService = Symbol.for('IDocumentFinderService');
export interface IDocumentFinderService {
    registerProvider(provider: IDocumentFinderProvider): void;
}

export interface IDocumentFinderProvider extends IDisposable {
    results: Observable<Finder.Symbol[]>;
}
