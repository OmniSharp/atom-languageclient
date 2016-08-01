/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { injectable } from 'atom-languageservices/decorators';
import { DisposableBase } from 'ts-disposables';
import { StatusService } from './StatusService';

@injectable
export class UserInterface extends DisposableBase {
    private _statusService: StatusService;
    constructor(statusService: StatusService) {
        super();
        this._statusService = statusService;
    }
}
