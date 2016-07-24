/**
 *
 */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';
/* tslint:disable:no-invalid-this */

export abstract class View<TElement extends HTMLElement> extends DisposableBase {
    private _root: TElement;
    public get root() { return this._root; }
    constructor(root: TElement) {
        super();
        this._root = root;
    }

    public appendTo(node: Node) {
        node.appendChild(this.root);
    }

    public scrollBottom(): number;
    public scrollBottom(element: HTMLElement): number;
    public scrollBottom(value: number): void;
    public scrollBottom(element: HTMLElement, value: number): void;
    public scrollBottom(element?: HTMLElement | number, value?: number) {
        if (typeof element === 'number') {
            value = element;
            element = undefined;
        }
        if (element == null) {
            element = this._root;
        }

        if (value) {
            element.scrollTop = value - element.clientHeight;
            return;
        } else {
            return element.scrollTop + element.clientHeight;
        }
    }

    public scrollDown(): void;
    public scrollDown(element: HTMLElement): void;
    public scrollDown(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }

        element.scrollTop = element.scrollTop + (window.innerHeight / 20);
        return;
    }

    public scrollUp(): void;
    public scrollUp(element: HTMLElement): void;
    public scrollUp(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        element.scrollTop = element.scrollTop - (window.innerHeight / 20);
        return;
    }

    public scrollToTop(): void;
    public scrollToTop(element: HTMLElement): void;
    public scrollToTop(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        element.scrollTop = 0;
        return;
    }

    public scrollToBottom(): void;
    public scrollToBottom(element: HTMLElement): void;
    public scrollToBottom(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        element.scrollTop = element.scrollHeight;
        return;
    }

    public pageUp(): void;
    public pageUp(element: HTMLElement): void;
    public pageUp(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        element.scrollTop = element.scrollTop + element.clientHeight;
        return;
    }

    public pageDown(): void;
    public pageDown(element: HTMLElement): void;
    public pageDown(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        element.scrollTop = element.scrollTop + element.clientHeight;
        return;
    }

    public isVisible(): boolean;
    public isVisible(element: HTMLElement): boolean;
    public isVisible(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        return !this.isHidden(element);
    }

    public isHidden(): boolean;
    public isHidden(element: HTMLElement): boolean;
    public isHidden(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        const style = element.style;

        if (style.display === 'none' || document.body.contains(element)) {
            return true;
        } else if (style.display) {
            return false;
        } else {
            return getComputedStyle(element).display === 'none';
        }
    }

    public isDisabled(): boolean;
    public isDisabled(element: HTMLElement): boolean;
    public isDisabled(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        return !!element.getAttribute('disabled');
    }

    public enable(): void;
    public enable(element: HTMLElement): void;
    public enable(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        return element.removeAttribute('disabled');
    }

    public disable(): void;
    public disable(element: HTMLElement): void;
    public disable(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        return element.setAttribute('disabled', 'disabled');
    }

    public hasFocus(): boolean;
    public hasFocus(element: HTMLElement): boolean;
    public hasFocus(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        return document.activeElement === element;
    }

    public show(): void;
    public show(element: HTMLElement): void;
    public show(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        if (element.style.display === 'none') {
            element.style.display = '';
        }
    }

    public hide(): void;
    public hide(element: HTMLElement): void;
    public hide(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        if (element.style.display === '') {
            element.style.display = 'none';
        }
    }

    public empty(): void;
    public empty(element: HTMLElement): void;
    public empty(element?: HTMLElement) {
        if (element == null) {
            element = this._root!;
        }
        element.innerHTML = '';
    }
}
