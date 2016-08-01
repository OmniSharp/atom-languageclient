/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { packageName } from '../../constants';
import { View } from '../../atom/views/View';

export class FlameView extends View<HTMLAnchorElement> {
    private _icon: HTMLSpanElement;
    private _outgoing: HTMLSpanElement;

    constructor() {
        super(document.createElement('a'));
        this.root.classList.add(`${packageName}-button`, 'flame');

        const outgoing = this._outgoing = document.createElement('span');
        outgoing.classList.add('outgoing-requests');
        this.root.appendChild(outgoing);

        const icon = this._icon = document.createElement('span');
        icon.classList.add('icon', 'icon-flame');
        this.root.appendChild(icon);
    }
}
