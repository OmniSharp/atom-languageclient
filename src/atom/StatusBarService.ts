/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IStatusBarService, StatusBar } from 'atom-languageservices';
import { Disposable, DisposableBase } from 'ts-disposables';
export { IStatusBarService, StatusBar };

export class StatusBarService extends DisposableBase implements IStatusBarService {
    private _api: StatusBar.Api;
    constructor() {
        super();
    }

    public addTile({position, item, priority}: { position: StatusBar.Position; item: HTMLElement; priority: number; }) {
        let tile: StatusBar.Tile;
        if (position === StatusBar.Position.Left) {
            tile = this._api.addLeftTile({ item, priority });
        } else {
            tile = this._api.addRightTile({ item, priority });
        }

        return Disposable.create(() => tile.destroy());
    }

    public set api(value: StatusBar.Api) {
        this._api = value;
    }
}
