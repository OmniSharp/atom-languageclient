/**
 *
 */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';
/* tslint:disable:no-invalid-this */

export abstract class View<TElement extends Node> extends DisposableBase {
    private _root: TElement;
    public get root() { return this._root; }
    constructor(root: TElement) {
        super();
        this._root = root;
    }

    public appendTo(node: Node) {
        node.appendChild(this.root);
    }

    public scrollBottom(element: HTMLElement): number;
    public scrollBottom(element: HTMLElement, value: number): void;
    public scrollBottom(element: HTMLElement, value?: number) {
        if (value) {
            element.scrollTop = value - element.clientHeight;
            return;
        } else {
            return element.scrollTop + element.clientHeight;
        }
    }

    public scrollDown(element: HTMLElement) {
        element.scrollTop = element.scrollTop + (window.innerHeight / 20);
        return;
    }

    public scrollUp(element: HTMLElement) {
        element.scrollTop = element.scrollTop - (window.innerHeight / 20);
        return;
    }

    public scrollToTop(element: HTMLElement) {
        element.scrollTop = 0;
        return;
    }

    public scrollToBottom(element: HTMLElement) {
        element.scrollTop = element.scrollHeight;
        return;
    }

    public pageUp(element: HTMLElement) {
        element.scrollTop = element.scrollTop + element.clientHeight;
        return;
    }

    public pageDown(element: HTMLElement) {
        element.scrollTop = element.scrollTop + element.clientHeight;
        return;
    }

    public isVisible(element: HTMLElement) {
        return !this.isHidden(element);
    }

    public isHidden(element: HTMLElement) {
        const style = element.style;

        if (style.display === 'none' || document.body.contains(element)) {
            return true;
        } else if (style.display) {
            return false;
        } else {
            return getComputedStyle(element).display === 'none';
        }
    }

    public isDisabled(element: HTMLElement) {
        return !!element.getAttribute('disabled');
    }

    public enable(element: HTMLElement) {
        return element.removeAttribute('disabled');
    }

    public disable(element: HTMLElement) {
        return element.setAttribute('disabled', 'disabled');
    }

    public hasFocus(element: HTMLElement) {
        return document.activeElement === element;
    }

    public show(element: HTMLElement) {
        if (element.style.display === 'none') {
            element.style.display = '';
        }
    }

    public hide(element: HTMLElement) {
        if (element.style.display === '') {
            element.style.display = 'none';
        }
    }

    public empty(element: HTMLElement) {
        element.innerHTML = '';
    }
}
