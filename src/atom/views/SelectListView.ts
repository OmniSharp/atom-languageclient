/**
 *
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AtomCommands } from '../AtomCommands';
import { View } from './View';

atom.themes.requireStylesheet(require.resolve('../../../styles/select-list.less'));

export abstract class SelectListView<T> extends View<HTMLDivElement> {
    protected _items: T[] = [];
    private _weakMap = new WeakMap<HTMLElement, T>();
    private _maxItems: number = Infinity;
    protected _filterEditorView: Atom.TextEditorPresenter;
    protected _filterEditor: Atom.TextEditor;
    private _error: HTMLDivElement;
    private _loadingArea: HTMLDivElement;
    private _loading: HTMLSpanElement;
    private _loadingBadge: HTMLSpanElement;
    private _list: HTMLOListElement;
    private _previouslyFocusedElement: HTMLElement;
    private _cancelling: boolean;
    private _scheduleTimeout: NodeJS.Timer;
    private _inputThrottle: number = 100;
    protected _commands: AtomCommands;

    public constructor(commands: AtomCommands) {
        super(document.createElement('div'));
        this._commands = commands;
        this._buildHtml();
        this._filterEditor = this._filterEditorView.getModel();
        this.storeFocusedElement();

        this._disposable.add(
            Observable.fromEvent(this._filterEditorView, 'blur')
                .subscribe(() => {
                    if (!document.hasFocus() && !this._cancelling) {
                        this.cancel();
                    }
                }),
            commands.add(this.root, {
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
                    this.scrollToTop(this._list);
                    event.stopPropagation();
                },
                'core:move-to-bottom': (event) => {
                    this.selectLastItem();
                    this.scrollToBottom(this._list);
                    event.stopPropagation();
                },
                'core:confirm': (event) => {
                    this._confirmSelection();
                    event.stopPropagation();
                },
                'core:cancel': (event) => {
                    this.cancel();
                    event.stopPropagation();
                }
            }),
            Observable.fromEvent(this._list, 'mousedown')
                .subscribe((e: MouseEvent) => {
                    if ((<HTMLElement>e.target).tagName === 'li') {
                        this._selectItem(<Element>e.target);
                        e.preventDefault();
                        return false;
                    }
                    return;
                }),
            Observable.fromEvent(this._list, 'mouseup')
                .subscribe((e: MouseEvent) => {
                    if ((<HTMLElement>e.target).tagName === 'li') {
                        if ((<HTMLElement>e.target).classList.contains('selected')) {
                            this._confirmSelection();
                        }
                        e.preventDefault();
                        return false;
                    }
                    return;
                }),
            Observable.fromEvent(this._list, 'mousedown')
                .subscribe(({target}: MouseEvent) => {
                    if (target === this._list) {
                        return false;
                    }
                    return;
                })
        );
    }

    public abstract viewForItem(item: fuse.Result<T>): HTMLLIElement;
    public abstract confirmed(item: T): void;
    public abstract cancelled(): void;

    public setItems(items: T[]) {
        this._items = items != null ? items : [];
        this.populateList();
        return this.setLoading();
    }

    public get selected() {
        return this._weakMap.get(this._getSelectedItem());
    }

    public getFilterQuery() {
        return this._filterEditor.getText();
    }

    public setMaxItems(maxItems: number) {
        this._maxItems = maxItems;
    }

    protected populateList() {
        this.populateItems(_.map(this._items, item => ({ item })));
    }

    protected populateItems(items: fuse.Result<T>[]) {
        if (items == null) {
            return;
        }
        /* tslint:disable-next-line:no-inner-html */
        this._list.innerHTML = '';
        if (items.length) {
            this.setError(undefined);

            for (const item of _.take(items, _.min([items.length, this._maxItems]))) {
                const view = this.viewForItem(item);
                this._weakMap.set(view, item.item);
                this._list.appendChild(view);
            }

            return this._selectItem(this._list.firstElementChild);
        } else {
            return this.setError(this.getEmptyMessage(this._items.length, items.length));
        }
    }

    public setError(message?: string) {
        if (message == null) {
            message = '';
        }
        if (message.length === 0) {
            this._error.innerText = '';
            this.hide(this._error);
        } else {
            this.setLoading();
            this._error.innerText = message;
            this.show(this._error);
        }
    }

    public setLoading(message?: string) {
        if (message == null) {
            message = '';
        }
        if (message.length === 0) {
            this._loading.innerText = '';
            this._loadingBadge.innerText = '';
            return this.hide(this._loadingArea);
        } else {
            this.setError();
            this._loading.innerText = message;
            return this.show(this._loadingArea);
        }
    }

    public getEmptyMessage(itemCount: number, filteredItemCount: number) {
        return 'No matches found';
    }

    /*
    Section: View Actions
     */

    public cancel() {
        this.empty(this._list);
        this._cancelling = true;

        const filterEditorViewFocused = this.hasFocus(this._filterEditorView);
        this.cancelled();
        this._filterEditor.setText('');
        if (filterEditorViewFocused) {
            this._restoreFocus();
        }
        this._cancelling = false;
        clearTimeout(this._scheduleTimeout);
        this.dispose();
    }

    public focusFilterEditor() {
        return this._filterEditorView.focus();
    }

    public storeFocusedElement() {
        /* tslint:disable-next-line:no-any */
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
        const selected = this._list.querySelector('.selected');
        if (selected) {
            selected.classList.remove('selected');
        }
        view.classList.add('selected');
        return this._scrollToItem(view);
    }

    private _scrollToItem(view: Element) {
        const scrollTop = this._list.scrollTop;
        const desiredTop = view.getBoundingClientRect().top + scrollTop;
        const desiredBottom = desiredTop + view.clientHeight;
        if (desiredTop < scrollTop) {
            this._list.scrollTop = desiredTop;
        } else if (desiredBottom > this.scrollBottom(this._list)) {
            this.scrollBottom(this._list, desiredBottom);
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
            this.confirmed(item);
            this.dispose();
        } else {
            this.cancel();
        }
    }

    protected schedulePopulateList() {
        clearTimeout(this._scheduleTimeout);
        const populateCallback = () => {
            if (document.body.contains(this.root)) {
                return this.populateList();
            }
        };
        this._scheduleTimeout = setTimeout(populateCallback, this._inputThrottle);
    }

    private _buildHtml() {
        this.root.classList.add('select-list');
        /* tslint:disable-next-line:no-any */
        const editor: Atom.TextEditorPresenter = this._filterEditorView = <any>document.createElement('atom-text-editor');
        /* tslint:disable-next-line:no-any */
        editor.setAttribute('mini', <any>true);
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

        this.root.appendChild(editor);
        this.root.appendChild(errorMessage);
        this.root.appendChild(loading);
        loading.appendChild(loadingMessage);
        loading.appendChild(loadingBadge);
        this.root.appendChild(listGroup);
    }
}
