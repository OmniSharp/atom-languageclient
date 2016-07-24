/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';

export namespace ATOM_COMMANDS {
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
    add(target: (string | ATOM_COMMANDS.CommandType | Node), commands: ATOM_COMMANDS.CommandObject): IDisposable;
    add(target: (string | ATOM_COMMANDS.CommandType | Node), commandName: string, callback: ATOM_COMMANDS.EventCallback): IDisposable;
}
