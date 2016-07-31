/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { AtomNavigation } from 'atom-languageservices';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IReferencesService = Symbol.for('IReferencesService');
export interface IReferencesService {
    registerProvider(provider: IReferencesProvider): IDisposable;
}

export interface IReferencesProvider extends IDisposable {
    request(editor: Atom.TextEditor): Observable<AtomNavigation.Location[]>;
}

export namespace Reference {
    export interface IResponse {
        lines: string[];
        filePath: string;
        range: TextBuffer.Range;
    }
}
