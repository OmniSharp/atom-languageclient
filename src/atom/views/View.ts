/**
 *
 */
import * as _ from 'lodash';
/* tslint:disable:no-invalid-this */

_.assign(HTMLElement.prototype, {
    get scrollBottom(this: HTMLElement) { return this.scrollTop + this.clientHeight; },
    set scrollBottom(this: HTMLElement, value: number) { this.scrollTop = value - this.clientHeight; },

    scrollDown(this: HTMLElement) {
        this.scrollTop = this.scrollTop + (window.innerHeight / 20);
    },

    scrollUp(this: HTMLElement) {
        this.scrollTop = this.scrollTop - (window.innerHeight / 20);
    },

    scrollToTop(this: HTMLElement) {
        this.scrollTop = 0;
    },

    scrollToBottom(this: HTMLElement) {
        this.scrollTop = this.scrollHeight;
    },

    pageUp(this: HTMLElement) {
        this.scrollTop = this.scrollTop - this.clientHeight;
    },

    pageDown(this: HTMLElement) {
        this.scrollTop = this.scrollTop + this.clientHeight;
    },

    get isVisible(this: HTMLElement) { return !this.isHidden; },
    get isHidden(this: HTMLElement) {
        const style = this.style;

        if (style.display === 'none' || document.body.contains(this)) {
            return true;
        } else if (style.display) {
            return false;
        } else {
            return getComputedStyle(this).display === 'none';
        }
    },

    isDisabled(this: HTMLElement) { return !!this.getAttribute('disabled'); },
    enable(this: HTMLElement) { this.removeAttribute('disabled'); },
    disable(this: HTMLElement) { this.setAttribute('disabled', 'disabled'); },
    get hasFocus(this: HTMLElement) { return document.activeElement === this; },

    show(this: HTMLElement) {
        if (this.style.display === 'none') {
            this.style.display = '';
        }
    },
    hide(this: HTMLElement) {
        if (this.style.display === '') {
            this.style.display = 'none';
        }
    },
    empty(this: HTMLElement) {
        _.each(this.children, (item) => {
            item.remove();
        });
    }
});
