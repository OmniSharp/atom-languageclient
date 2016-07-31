/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable, Subscriber } from 'rxjs';
import { CodeAction } from 'atom-languageservices';
import { createObservable } from '../../helpers/createObservable';
import { AtomCommands } from '../AtomCommands';
import { AtomViewFinder } from '../AtomViewFinder';
import { FilterSelectListView } from './FilterSelectListView';

export class CodeActionView extends FilterSelectListView<CodeAction.Item> {
    private _decoration: Atom.Decoration;
    private _editor: Atom.TextEditor;
    private _editorView: Atom.TextEditorPresenter;
    private _codeaction$: Observable<CodeAction.Item>;
    private _codeactionObserver: Subscriber<CodeAction.Item>;

    public constructor(commands: AtomCommands, viewFinder: AtomViewFinder, editor: Atom.TextEditor) {
        super(commands);
        this.root.classList.add('code-actions-overlay');
        this._editor = editor;
        this._editorView = <any>viewFinder.getView(editor);

        this._decoration = this._editor.decorateMarker(
            this._editor.getLastCursor().getMarker(),
            { type: 'overlay', position: 'tail', item: this.root }
        );

        this._codeaction$ = createObservable<CodeAction.Item>(observer => {
            this._codeactionObserver = observer;
            this._disposable.add(observer);
        }).share();

        this._disposable.add(
            () => this._decoration.destroy()
        );
    }

    public cancelled() { /* */ }

    public get filterKeys() {
        return [
            { name: 'id', weight: 0.2 },
            { name: 'name', weight: 0.5 },
            { name: 'title', weight: 0.3 }
        ];
    }

    public confirmed(item: CodeAction.Item) {
        if (this._codeactionObserver) {
            this._codeactionObserver.next(item);
        }
    }

    public get codeaction$() { return this._codeaction$; }

    public viewForItem(value: fuse.Result<CodeAction.Item>) {
        const element = document.createElement('li');
        element.classList.add('event');
        const span = document.createElement('span');
        span.innerText = value.item.name;
        span.title = value.item.title;
        element.appendChild(span);
        return element;
    }
}
