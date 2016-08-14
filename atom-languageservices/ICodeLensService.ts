/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';

/* tslint:disable:variable-name */
export const ICodeLensService = Symbol.for('ICodeLensService');
export interface ICodeLensService {
    registerProvider(CodeLensProvider: ICodeLensProvider): IDisposable;
}

export interface ICodeLensProvider extends IDisposable {
    request(editor: CodeLens.IRequest): Observable<CodeLens.IResponse[]>;
    resolve(codeLens: CodeLens.IResponse): Observable<CodeLens.IResponse>;
}

export namespace CodeLens {
    export interface IResponse {
        range: TextBuffer.Range;
        data?: any;
        command?: ICommand;
    }

    export interface ICommand {
        title: string;
        command: string;
        arguments?: any[];
    }

    export interface IRequest {
        editor: Atom.TextEditor;
    }
}
