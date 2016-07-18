/**
 *
 */
import * as _ from 'lodash';
import { filter } from 'fuzzaldrin-plus';

atom.themes.requireStylesheet(require.resolve('../styles/select-list.less'));

export abstract class SelectListView<T> extends HTMLDivElement {
    private _items: T[] = [];
    private _set = new WeakMap<HTMLElement, T>();
    private _maxItems: number = Infinity;
    private _filterEditorView: Atom.TextEditorComponent;
    private _error: HTMLDivElement;
    private _loadingArea: HTMLDivElement;
    private _loading: HTMLSpanElement;
    private _loadingBadge: HTMLSpanElement;
    private _list: HTMLOListElement;
    private _previouslyFocusedElement: HTMLElement;
    private _cancelling: boolean;
    private _scheduleTimeout: NodeJS.Timer;
    private _inputThrottle: number = 100;

    public constructor() {
        super();
        this._buildHtml();
        this._filterEditorView.editor.buffer.onDidChange(() => {
            this._schedulePopulateList();
        });
        this._filterEditorView.addEventListener('blur', () => {
            if (!document.hasFocus() && !this._cancelling) {
                this.cancel();
            }
        });

        atom.commands.add(this, {
            'core:move-up': (event) => {
                this.selectPreviousItem();
                event.stopPropagation();
            },
            'core:move-down': (event) => {
                this.selectNextItem();
                event.stopPropagation();
            },
            'core:move-to-top': (event) => {
                this.selectFirstItem();
                this._list.scrollToTop();
                event.stopPropagation();
            },
            'core:move-to-bottom': (event) => {
                this.selectLastItem();
                this._list.scrollToBottom();
                event.stopPropagation();
            },
        });

        this._list.addEventListener('mousedown', (e) => {
            if ((<HTMLElement>e.target).tagName === 'li') {
                this._selectItem(<Element>e.target);
                e.preventDefault();
                return false;
            }
            return;
        });

        this._list.addEventListener('mouseup', (e) => {
            if ((<HTMLElement>e.target).tagName === 'li') {
                if ((<HTMLElement>e.target).classList.contains('selected')) {
                    this._confirmSelection();
                }
                e.preventDefault();
                return false;
            }
            return;
        });

        this._list.addEventListener('mousedown', ({target}) => {
            if (target === this._list) {
                return false;
            }
            return;
        });

    }

    public abstract viewForItem(item: T): HTMLElement;
    public abstract confirmed(item: T): void;
    public abstract cancelled(): void;
    public abstract filterKey: string;

    public setItems(items: T[]) {
        this._items = items != null ? items : [];
        this._populateList();
        return this.setLoading();
    }

    public get selected() {
        return this._set.get(this._getSelectedItem());
    }

    public getFilterQuery() {
        return this._filterEditorView.editor.getText();
    }

    public setMaxItems(maxItems: number) {
        this._maxItems = maxItems;
    }

    private _populateList() {
        if (this._items == null) {
            return;
        }
        const filterQuery = this.getFilterQuery();
        let filteredItems: T[];
        if (filterQuery.length) {
            filteredItems = filter(this._items, filterQuery, {
                key: this.filterKey
            });
        } else {
            filteredItems = this._items;
        }
        this._list.empty();
        if (filteredItems.length) {
            this.setError(undefined);

            for (const item of _.take(this._items, _.min([this._items.length, this._maxItems]))) {
                const view = this.viewForItem(item);
                this._set.set(view, item);
                this._list.appendChild(view);
            }

            return this._selectItem(this._list.firstElementChild);
        } else {
            return this.setError(this.getEmptyMessage(this._items.length, filteredItems.length));
        }
    }

    public setError(message?: string) {
        if (message == null) {
            message = '';
        }
        if (message.length === 0) {
            this._error.innerText = '';
            this._error.hide();
        } else {
            this.setLoading();
            this._error.innerText = message;
            this._error.show();
        }
    }

    public setLoading(message?: string) {
        if (message == null) {
            message = '';
        }
        if (message.length === 0) {
            this._loading.innerText = '';
            this._loadingBadge.innerText = '';
            return this._loadingArea.hide();
        } else {
            this.setError();
            this._loading.innerText = message;
            return this._loadingArea.show();
        }
    }

    public getEmptyMessage(itemCount: number, filteredItemCount: number) {
        return 'No matches found';
    }

    /*
    Section: View Actions
     */

    public cancel() {
        this._list.empty();
        this._cancelling = true;

        const filterEditorViewFocused = this._filterEditorView.hasFocus;
        this.cancelled();
        this._filterEditorView.editor.setText('');
        if (filterEditorViewFocused) {
            this._restoreFocus();
        }
        this._cancelling = false;
        return clearTimeout(this._scheduleTimeout);
    }

    public focusFilterEditor() {
        return this._filterEditorView.focus();
    }

    public storeFocusedElement() {
        return this._previouslyFocusedElement = <any>document.activeElement;
    }

    public selectFirstItem() {
        return this._selectItem(<HTMLLIElement>this._list.firstElementChild);
    }

    public selectLastItem() {
        return this._selectItem(<HTMLLIElement>this._list.lastElementChild);
    }

    public selectPreviousItem() {
        let view: HTMLLIElement = <HTMLLIElement>this._getSelectedItem().previousElementSibling;
        if (!view) {
            view = <HTMLLIElement>this._list.lastElementChild;
        }
        return this._selectItem(view);
    }

    public selectNextItem() {
        let view: HTMLLIElement = <HTMLLIElement>this._getSelectedItem().nextElementSibling;
        if (!view) {
            view = <HTMLLIElement>this._list.firstElementChild;
        }
        return this._selectItem(view);
    }

    private _selectItem(view: Element) {
        this._list.querySelector('.selected').classList.remove('selected');
        view.classList.add('selected');
        return this._scrollToItem(view);
    }

    private _scrollToItem(view: Element) {
        const scrollTop = this._list.scrollTop;
        const desiredTop = view.getBoundingClientRect().top + scrollTop;
        const desiredBottom = desiredTop + view.clientHeight;
        if (desiredTop < scrollTop) {
            this._list.scrollTop = desiredTop;
        } else if (desiredBottom > this._list.scrollBottom) {
            this._list.scrollBottom = desiredBottom;
        }
    }

    private _restoreFocus() {
        if (this._previouslyFocusedElement) {
            this._previouslyFocusedElement.focus();
        }
    }

    private _getSelectedItem(): HTMLLIElement {
        return <HTMLLIElement>this._list.querySelector('li.selected');
    }

    private _confirmSelection() {
        const item = this.selected;
        if (item != null) {
            return this.confirmed(item);
        } else {
            return this.cancel();
        }
    }

    private _schedulePopulateList() {
        clearTimeout(this._scheduleTimeout);
        const populateCallback = () => {
            if (document.body.contains(this)) {
                return this._populateList();
            }
        };
        this._scheduleTimeout = setTimeout(populateCallback, this._inputThrottle);
    }

    private _buildHtml() {
        this.classList.add('select-list');
        const editor: Atom.TextEditorComponent = this._filterEditorView = <any>document.createElement('atom-text-editor');
        const errorMessage = this._error = document.createElement('div');
        errorMessage.classList.add('error-message');
        const loading = this._loadingArea = document.createElement('div');
        loading.classList.add('loading');
        const loadingMessage = this._loading = document.createElement('span');
        loadingMessage.classList.add('loading-message');
        const loadingBadge = this._loadingBadge = document.createElement('span');
        loadingBadge.classList.add('badge');
        const listGroup = this._list = document.createElement('ol');
        listGroup.classList.add('list-group');

        this.appendChild(editor);
        this.appendChild(errorMessage);
        this.appendChild(loading);
        loading.appendChild(loadingMessage);
        loading.appendChild(loadingBadge);
        this.appendChild(listGroup);
    }
}
