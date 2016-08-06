/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import { IAtomNavigation } from './IAtomNavigation';

/* tslint:disable:variable-name */
export const IDefinitionService = Symbol.for('IDefinitionService');
export interface IDefinitionService {
    registerProvider(provider: IDefinitionProvider): IDisposable;
}

export interface IDefinitionProvider extends IDisposable {
    request(editor: Definition.IRequest): Observable<IAtomNavigation.Location[]>;
}

export namespace Definition {
    export interface IRequest {
        editor: Atom.TextEditor;
        location: TextBuffer.Point;
    }
}
