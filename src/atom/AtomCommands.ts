/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { CompositeDisposable, DisposableBase, IDisposable } from 'ts-disposables';
import { alias, injectable } from '../services/_decorators';
import { ATOM_COMMANDS, IAtomCommands } from '../services/_public';
import { packageName } from '../constants';
type CommandType = ATOM_COMMANDS.CommandType;
type CommandObject = ATOM_COMMANDS.CommandObject;
type EventCallback = ATOM_COMMANDS.EventCallback;

@injectable
@alias(IAtomCommands)
export class AtomCommands extends DisposableBase implements IAtomCommands {
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
            cd.add(atom.commands.add(this._getCommandType(target), this._getKey(commandsOrName), callback!));
        } else {
            const result: typeof commandsOrName = {};
            _.each(commandsOrName, (method, key) => {
                result[this._getKey(key)] = method;
            });
            cd.add(atom.commands.add(this._getCommandType(target), result));
        }
        return cd;
    }

    private _getKey(key: string) {
        // only one : is strictly allowed
        // In this case they are binding to a specific command, not package specific.
        if (_.includes(key, ':')) {
            return key;
        }
        return `${packageName}:${key}`;
    }

    private _getCommandType(command: string | CommandType | Node) {
        if (typeof command === 'number') {
            switch (command) {
                case ATOM_COMMANDS.CommandType.TextEditor:
                    return 'atom-text-editor';
                case ATOM_COMMANDS.CommandType.Workspace:
                default:
                    return 'atom-workspace';
            }
        }
        return command;
    }
}
