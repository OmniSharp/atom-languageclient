/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';

export enum KeymapType {
    Workspace,
    TextEditor,
    Autocomplete
}

export enum KeymapPlatform {
    All,
    CtrlOrCmd,
    Windows,
    Osx,
    Linux
}

/* tslint:disable:variable-name */
export const IAtomKeymaps = Symbol.for('IAtomKeymaps');
export interface IAtomKeymaps {
    add(target: (string | KeymapType), commands: IAtomKeymaps.KeymapObject): IDisposable;
    add(target: (string | KeymapType), platform: KeymapPlatform, commands: IAtomKeymaps.KeymapObject): IDisposable;
    add(target: (string | KeymapType), keystrokes: string, command: string): IDisposable;
    add(target: (string | KeymapType), platform: KeymapPlatform, keystrokes: string, command: string): IDisposable;
    for(packageName: string): IAtomKeymaps;
}

export namespace IAtomKeymaps {
    export interface Keymap { [keystrokes: string]: KeymapObject; }
    export interface KeymapObject { [keystrokes: string]: string; }
}
