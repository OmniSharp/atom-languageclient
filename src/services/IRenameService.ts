/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const IRenameService = Symbol.for('IRenameService');
export interface IRenameService {
    registerProvider(RenameProvider: IRenameProvider): IDisposable;
}

export interface IRenameProvider extends IDisposable {
    request(editor: Rename.RequestOptions): Observable<Text.WorkspaceChange[]>;
}
