/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';

export namespace AtomCommands {
    export type EventCallback = (event: Event) => void;
    export type CommandObject = { [commandName: string]: EventCallback; };

    export enum CommandType {
        Workspace,
        TextEditor
    }
}

/* tslint:disable:variable-name */
export const IAtomCommands = Symbol.for('IAtomCommands');
export interface IAtomCommands {
    add(target: (string | AtomCommands.CommandType | Node), commands: AtomCommands.CommandObject): IDisposable;
    add(target: (string | AtomCommands.CommandType | Node), commandName: string, callback: AtomCommands.EventCallback): IDisposable;
}
