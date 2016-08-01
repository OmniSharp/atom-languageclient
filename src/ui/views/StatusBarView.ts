/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { packageName } from '../../constants';
import { DiagnosticsView } from './DiagnosticsView';
import { FlameView } from './FlameView';
import { View } from '../../atom/views/View';

export class StatusBarView extends View<HTMLSpanElement> {
    private _flame: FlameView;
    private _diagnostics: DiagnosticsView;

    constructor() {
        super(document.createElement('span'));
        this.root.classList.add(packageName);

        this._flame = new FlameView();
        this.root.appendChild(this._flame.root);

        this._diagnostics = new DiagnosticsView();
        this.root.appendChild(this._diagnostics.root);
    }
}
