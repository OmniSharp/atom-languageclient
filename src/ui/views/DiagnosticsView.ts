/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { packageName } from '../../constants';
import { View } from '../../atom/views/View';

export interface IDiagnosticState {
    error: number;
    warning: number;
    info: number;
}

export class DiagnosticsView extends View<HTMLSpanElement> {
    private _error: HTMLSpanElement;
    private _warning: HTMLSpanElement;
    private _info: HTMLSpanElement;
    private _state: IDiagnosticState = { error: 0, warning: 0, info: 0 };

    constructor() {
        super(document.createElement('span'));
        this.root.classList.add('diagnostic-summary');

        const errorsIcon = document.createElement('span');
        errorsIcon.classList.add('icon', 'icon-issue-opened');
        this.root.appendChild(errorsIcon);

        const error = this._error = document.createElement('span');
        error.classList.add('error-summary');
        this.root.appendChild(error);

        const warningsIcon = document.createElement('span');
        warningsIcon.classList.add('icon', 'icon-alert');
        this.root.appendChild(warningsIcon);

        const warning = this._warning = document.createElement('span');
        warning.classList.add('warning-summary');
        this.root.appendChild(warning);

        const infoIcon = document.createElement('span');
        infoIcon.classList.add('icon', 'icon-info');
        // this.root.appendChild(infoIcon);

        const info = this._info = document.createElement('span');
        info.classList.add('info-summary');
        // this.root.appendChild(info);
    }
}
