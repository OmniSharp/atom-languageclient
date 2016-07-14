/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { DisposableBase } from 'ts-disposables';
import { ILanguageService } from '../interfaces';
import { IResolver } from '../di/Container';

/**
 * Defines the common interface that a module can then consume to interact with us.
 */
export class LanguageService extends DisposableBase implements ILanguageService {
    private _activated: Observable<boolean>;
    private _deactivated: Observable<boolean>;
    private _resolver: IResolver;

    constructor(resolver: IResolver) {
        super();
        this._resolver = resolver;
    }
}
