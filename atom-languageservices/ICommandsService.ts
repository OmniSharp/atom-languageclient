/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';
import { CommandType, IAtomCommands } from './IAtomCommands';

/* tslint:disable:variable-name */
export const ICommandsService = Symbol.for('ICommandsService');
export interface ICommandsService {
    add(target: CommandType, commandName: string, keystrokes: string | string[], callback: IAtomCommands.EventCallback): IDisposable;
}
