/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Disposable, DisposableBase, IDisposable } from 'ts-disposables';
import { ILanguageProvider, IResolver } from '../interfaces';

/**
 * Takes in all the different languages provided by other packages and configures them.
 */
export class LanguageProvider extends DisposableBase {
    private _resolver: IResolver;
    constructor(resolver: IResolver) {
        super();
        this._resolver = resolver;
    }

    public add(provider: ILanguageProvider): void {
        /*  */
    }
}
