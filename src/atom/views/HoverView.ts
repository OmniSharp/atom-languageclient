/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { View } from './View';

export interface IHoverPosition {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export class HoverView extends View<HTMLDivElement> {
    private _rect: IHoverPosition;
    private _text: HTMLDivElement;

    constructor() {
        super(document.createElement('div'));
        this.root.classList.add('tooltip', 'atom-languageclient-tooltip');
        this._text = document.createElement('div');
        this._text.style.textAlign = 'left';
        this._text.classList.add('tooltip-inner');
        this.root.appendChild(this._text);
        document.body.appendChild(this.root);

        this._disposable.add(
            () => this.root.remove()
        );
    }

    public get rect() { return this._rect; }

    public updateText(text: string): void
    public updateText(text: string, rect: IHoverPosition): void;
    public updateText(text: string, rect?: IHoverPosition) {
        if (rect) {
            this._rect = rect;
        }

        this._text.innerHTML = text;
        this.updatePosition(this._rect);
    }

    public updatePosition(rect: IHoverPosition, editor?: Atom.TextEditorPresenter) {
        if (editor) {
            const styles = window.getComputedStyle(editor);
            this.root.style.font = styles.font;
            this.root.style.maxWidth = `${_.min([ parseFloat(styles.width!) * 0.8, 500])}px`;
        }
        this._rect = rect;
        const offset = 10;
        let left = rect.right;
        let top = rect.bottom;
        let right: number | undefined;

        // X axis adjust
        if (left + this.root.offsetWidth >= document.body.clientWidth) {
            left = document.body.clientWidth - this.root.offsetWidth - offset;
        }

        if (left < 0) {
            this._text.style.whiteSpace = 'pre-wrap';
            left = offset;
            right = offset;
        }

        // Y axis adjust
        if (top + this.root.offsetHeight >= document.body.clientHeight) {
            top = rect.top - this.root.offsetHeight;
        }

        this.root.style.left = `${left}px`;
        this.root.style.top = `${top}px`;
        if (right === undefined) {
            this.root.style.right = '';
        } else {
            this.root.style.right = `${right}px`;
        }
    }
}
