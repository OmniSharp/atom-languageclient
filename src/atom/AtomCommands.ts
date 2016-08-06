/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { CommandType, IAtomCommands } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { CompositeDisposable, DisposableBase, IDisposable } from 'ts-disposables';
import { packageName } from '../constants';

export class PrefixAtomCommands extends DisposableBase implements IAtomCommands {
    private _prefix: string;
    constructor(prefix: string) {
        super();
        this._prefix = prefix;
    }

    public add(target: (string | CommandType | Node), commands: IAtomCommands.CommandObject): IDisposable;
    public add(target: (string | CommandType | Node), commandName: string, callback: IAtomCommands.EventCallback): IDisposable;
    public add(target: (string | CommandType | Node), commandsOrName: string | IAtomCommands.CommandObject, callback?: IAtomCommands.EventCallback) {
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

    public for(packageName: string) {
        const result = new PrefixAtomCommands(packageName);
        this._disposable.add(result);
        return result;
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

@injectable
@alias(IAtomCommands)
export class AtomCommands extends PrefixAtomCommands {
    constructor() {
        super(packageName);
    }
}
