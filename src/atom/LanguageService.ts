/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { DisposableBase } from 'ts-disposables';
import { IResolver } from '../di/Container';

/**
 * Defines the interface for consuming this service
 * http://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/
 */
export interface ILanguageService {
    activated: Observable<boolean>;
    deactivated: Observable<boolean>;
}

/**
 * Defines the common interface that a module can then consume to interact with us.
 */
export class LanguageService extends DisposableBase implements ILanguageService {
    private _activated: Observable<boolean>;
    private _deactivated: Observable<boolean>;
    private _resolver: IResolver;

    constructor(resolver: IResolver, stateChange: Observable<boolean>) {
        super();
        this._resolver = resolver;
        this._activated = stateChange
            .filter(x => !!x);
        this._deactivated = stateChange
            .skip(1)
            .filter(x => !x);
    }

    public get activated() { return this._activated; }
    public get deactivated() { return this._deactivated; }
}
