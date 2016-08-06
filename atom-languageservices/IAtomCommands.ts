/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';

export enum CommandType {
    Workspace,
    TextEditor
}

/* tslint:disable:variable-name */
export const IAtomCommands = Symbol.for('IAtomCommands');
export interface IAtomCommands {
    add(target: (string | CommandType | Node), commands: IAtomCommands.CommandObject): IDisposable;
    add(target: (string | CommandType | Node), commandName: string, callback: IAtomCommands.EventCallback): IDisposable;
    for(packageName: string): IAtomCommands;
}

export namespace IAtomCommands {
    export type EventCallback = (event: Event) => void;
    export type CommandObject = { [commandName: string]: EventCallback; };
}
