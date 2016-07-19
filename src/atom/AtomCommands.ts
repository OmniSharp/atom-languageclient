/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CompositeDisposable, DisposableBase, IDisposable } from 'ts-disposables';
import { packageName } from '../constants';
import { injectable } from '../di/decorators';

export type EventCallback = (event: Event) => void;
export type CommandObject = { [commandName: string]: EventCallback; };

export enum CommandType {
    Workspace,
    TextEditor
}

@injectable
export class AtomCommands extends DisposableBase {
    constructor() {
        super();
    }

    public add(target: (string | CommandType | Node), commands: CommandObject): IDisposable;
    public add(target: (string | CommandType | Node), commandName: string, callback: EventCallback): IDisposable;
    public add(target: (string | CommandType | Node), commandsOrName: string | CommandObject, callback?: EventCallback) {
        const cd = new CompositeDisposable();
        this._disposable.add(cd);
        cd.add(() => this._disposable.remove(cd));

        if (typeof commandsOrName === 'string') {
            cd.add(atom.commands.add(this._getCommandType(target), `${packageName}:${commandsOrName}`, callback!));
        } else {
            const result: typeof commandsOrName = {};
            _.each(commandsOrName, (method, key) => {
                result[`${packageName}:${key}`] = method;
            });
            cd.add(atom.commands.add(this._getCommandType(target), result));
        }
        return cd;
    }

    private _getCommandType(command: string | CommandType | Node) {
        if (typeof command === 'number') {
            switch (command) {
                case CommandType.TextEditor:
                    return 'atom-text-editor';
                case CommandType.Workspace:
                default:
                    return 'atom-workspace';
            }
        }
        return command;
    }
}
