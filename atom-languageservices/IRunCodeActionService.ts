/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import { Text } from './Text';

/* tslint:disable:variable-name */
export const IRunCodeActionService = Symbol.for('IRunCodeActionService');
export interface IRunCodeActionService {
    registerProvider(provider: IRunCodeActionProvider): IDisposable;
    request(options: RunCodeAction.IRequest): void;
}

export interface IRunCodeActionProvider extends IDisposable {
    request(options: RunCodeAction.IRequest): Observable<Text.IWorkspaceChange[]>;
}

export namespace RunCodeAction {
    export interface IRequest {
        editor: Atom.TextEditor;
        range: TextBuffer.Range;
        identifier: string;
        context: any;
    }
}
