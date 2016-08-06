/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { IAtomKeymaps, KeymapPlatform, KeymapType } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { CompositeDisposable, DisposableBase, IDisposable } from 'ts-disposables';
import { packageName } from '../constants';

@injectable
@alias(IAtomKeymaps)
export class PrefixAtomKeymaps extends DisposableBase implements IAtomKeymaps {
    private _prefix: string;
    constructor(prefix: string) {
        super();
        this._prefix = prefix;
    }

    public add(target: (string | KeymapType), commands: IAtomKeymaps.KeymapObject): IDisposable;
    public add(target: (string | KeymapType), platform: KeymapPlatform, commands: IAtomKeymaps.KeymapObject): IDisposable;
    public add(target: (string | KeymapType), keystrokes: string, command: string): IDisposable;
    public add(target: (string | KeymapType), platform: KeymapPlatform, keystrokes: string, command: string): IDisposable;
    public add(
        target: (string | KeymapType),
        commandsOrPlatformOrKeystrokes: KeymapPlatform | string | IAtomKeymaps.KeymapObject,
        commandsOrKeystrokes?: string | IAtomKeymaps.KeymapObject,
        command?: string) {

        let keystrokes: string | undefined;
        let platform = KeymapPlatform.All;
        let commands: IAtomKeymaps.KeymapObject | undefined;
        let keymap: IAtomKeymaps.Keymap;

        const cd = new CompositeDisposable();
        this._disposable.add(cd);
        cd.add(() => this._disposable.remove(cd));

        const resolvedTarget = this._getSelectorType(target, platform);

        if (typeof commandsOrPlatformOrKeystrokes === 'string') {
            keystrokes = commandsOrPlatformOrKeystrokes;
        } else if (typeof commandsOrPlatformOrKeystrokes === 'number') {
            platform = commandsOrPlatformOrKeystrokes;
        } else {
            commands = commandsOrPlatformOrKeystrokes;
        }

        if (commandsOrKeystrokes) {
            if (typeof commandsOrKeystrokes === 'string') {
                keystrokes = commandsOrKeystrokes;
            } else {
                commands = commandsOrKeystrokes;
            }
        }

        if (keystrokes && command) {
            commands = {};
            commands[this._getKeystrokes(platform, keystrokes)] = command;
        } else if (!commands) {
            commands = {};
        }

        keymap = {};
        keymap[resolvedTarget] = commands;

        _.each(commands, (cmd, stroke) => {
            const keys = this._getKeystrokes(platform, stroke);
            if (keys !== stroke) {
                delete commands![stroke];
            }
            commands![keys] = this._getKey(cmd);
        });

        cd.add(atom.keymaps.add(`${packageName}${resolvedTarget}`, keymap));
        return cd;
    }

    public for(packageName: string) {
        const result = new PrefixAtomKeymaps(packageName);
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

    private _getKeystrokes(platform: KeymapPlatform, keystrokes: string) {
        if (process.platform === 'darwin' && platform === KeymapPlatform.CtrlOrCmd) {
            return keystrokes.replace(/ctrl/g, 'cmd');
        }
        return keystrokes;
    }

    private _getPlatformKey(platform: KeymapPlatform, selector: string) {
        switch (platform) {
            case KeymapPlatform.Linux:
                return `.platform-linux ${selector}`;
            case KeymapPlatform.Windows:
                return `.platform-win32 ${selector}`;
            case KeymapPlatform.Osx:
                return `.platform-darwin ${selector}`;
            default:
                return selector;
        }
    }

    private _getCommandKey(keymap: KeymapType) {
        switch (keymap) {
            case KeymapType.Autocomplete:
                return `.autocomplete-active.${packageName}`;
            case KeymapType.TextEditor:
                return `atom-text-editor:not([mini]).${packageName}`;
            case KeymapType.Workspace:
            default:
                return `atom-workspace`;
        }
    }

    private _getSelectorType(keymap: string | KeymapType, platform: KeymapPlatform) {
        if (typeof keymap === 'string') {
            if (platform === KeymapPlatform.All || platform === KeymapPlatform.CtrlOrCmd) {
                return keymap;
            }
            return this._getPlatformKey(platform, keymap);
        } else {
            const cmd = this._getCommandKey(keymap);
            if (platform === KeymapPlatform.All || platform === KeymapPlatform.CtrlOrCmd) {
                return cmd;
            }
            return this._getPlatformKey(platform, cmd);
        }
    }
}

@injectable
@alias(IAtomKeymaps)
export class AtomKeymaps extends PrefixAtomKeymaps {
    constructor() {
        super(packageName);
    }
}
