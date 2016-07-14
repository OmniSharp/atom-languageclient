/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';

export class LinterService {
    private _registry: Linter.IndieRegistry;
    public set registry(registry: Linter.IndieRegistry) {
        this._registry = registry;
    }
}
