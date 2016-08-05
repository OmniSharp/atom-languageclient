/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { GetCodeActions } from 'atom-languageservices';
import { createObservable } from '../../helpers/createObservable';
import { AtomCommands } from '../AtomCommands';
import { AtomViewFinder } from '../AtomViewFinder';
import { FilterSelectListView } from './FilterSelectListView';

export class CodeActionView extends FilterSelectListView<GetCodeActions.IResponse> {
    private _decoration: Atom.Decoration;
    private _codeaction$: Observable<GetCodeActions.IResponse>;
    private _codeactionObserver: Subscriber<GetCodeActions.IResponse>;

    public constructor(commands: AtomCommands, viewFinder: AtomViewFinder, editor: Atom.TextEditor) {
        super(commands);
        this.root.classList.add('code-actions-overlay');

        this._decoration = editor.decorateMarker(
            editor.getLastCursor().getMarker(),
            { type: 'overlay', position: 'tail', item: this.root }
        );

        _.delay(() => this._filterEditorView.focus());

        this._codeaction$ = createObservable<GetCodeActions.IResponse>(observer => {
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

    public confirmed(item: GetCodeActions.IResponse) {
        if (this._codeactionObserver) {
            this._codeactionObserver.next(item);
        }
    }

    public get codeaction$() { return this._codeaction$; }

    public viewForItem(value: fuse.Result<GetCodeActions.IResponse>) {
        const element = document.createElement('li');
        element.classList.add('event');
        const span = document.createElement('span');
        span.innerText = value.item.name;
        span.title = value.item.title;
        element.appendChild(span);
        return element;
    }
}
