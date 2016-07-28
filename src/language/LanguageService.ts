/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { DisposableBase } from 'ts-disposables';
import { ILanguageService, IResolver } from '../services/_internal';

/**
 * Defines the common interface that a module can then consume to interact with us.
 */
export class LanguageService extends DisposableBase implements ILanguageService {
    private _resolver: IResolver;

    constructor(resolver: IResolver) {
        super();
        this._resolver = resolver;
    }

    public get resolver() { return this._resolver; }
}
