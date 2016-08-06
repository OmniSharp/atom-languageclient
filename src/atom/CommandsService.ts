/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { CommandType, IAtomCommands, ICommandsService, KeymapPlatform, KeymapType } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { CompositeDisposable, DisposableBase } from 'ts-disposables';
import { AtomCommands } from './AtomCommands';
import { AtomKeymaps } from './AtomKeymaps';

@injectable
@alias(ICommandsService)
export class CommandsService extends DisposableBase implements ICommandsService {
    private _atomCommands: AtomCommands;
    private _atomKeymaps: AtomKeymaps;
    constructor(atomCommands: AtomCommands, atomKeymaps: AtomKeymaps) {
        super();
        this._atomCommands = atomCommands;
        this._atomKeymaps = atomKeymaps;
    }

    public add(target: CommandType, commandName: string, keystrokes: string | string[], callback: IAtomCommands.EventCallback) {
        const cd = new CompositeDisposable();
        if (typeof keystrokes === 'string') {
            keystrokes = [keystrokes];
        }
        cd.add(
            this._atomCommands.add(target, commandName, callback)
        );
        for (const keystroke of keystrokes) {
            cd.add(this._atomKeymaps.add(this._getKeymapType(target), KeymapPlatform.CtrlOrCmd, keystroke, commandName))
        }
        return cd;
    }

    private _getKeymapType(target: CommandType): KeymapType {
        const name = CommandType[target];
        return <any>KeymapType[<any>name];
    }
}
