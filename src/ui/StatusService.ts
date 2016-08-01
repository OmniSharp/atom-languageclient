/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { injectable } from 'atom-languageservices/decorators';
import { DisposableBase } from 'ts-disposables';
import { StatusBar, StatusBarService } from '../atom/StatusBarService';
import { StatusBarView } from './views/StatusBarView';

@injectable
export class StatusService extends DisposableBase {
    private _view: StatusBarView;
    private _statusBarService: StatusBarService;

    constructor(statusBarService: StatusBarService) {
        super();
        this._statusBarService = statusBarService;

        this._view = new StatusBarView();

        this._disposable.add(
            this._view,
            this._statusBarService.addTile({ position: StatusBar.Position.Left, item: this._view.root, priority: -10000 })
        );
    }
}
