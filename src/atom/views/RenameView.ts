/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { createObservable } from '../../helpers/createObservable';
import { AtomCommands } from '../AtomCommands';
import { View } from './View';

export class RenameView extends View<HTMLDivElement> {
    private _message: HTMLParagraphElement;
    private _editorView: Atom.TextEditorPresenter;
    private _editor: Atom.TextEditor;
    private _rename$: Observable<Rename.RequestOptions>;
    private _renameObserver: Subscriber<Rename.RequestOptions>;
    private _panel: { destroy(): void; };
    private _options: Rename.RequestOptions;

    constructor(commands: AtomCommands, options: Rename.RequestOptions) {
        super(document.createElement('div'));
        this._options = options;

        this.root.classList.add('rename', 'overlay', 'from-top');
        this._message = document.createElement('p');
        /* tslint:disable-next-line:no-any */
        this._editorView = <any>document.createElement('atom-text-editor');
        /* tslint:disable-next-line:no-any */
        this._editorView.setAttribute('mini', <any>true);
        this._editor = this._editorView.getModel();

        this.root.appendChild(this._message);
        this.root.appendChild(this._editorView);

        this._disposable.add(
            Observable.fromEvent(this.root, 'blur')
                .subscribe(() => {
                    this.destroy();
                }),
            commands.add(this.root, {
                'core:confirm': () => this._rename(),
                'core:cancel': () => this.destroy()
            })
        );

        this._panel = atom.workspace.addTopPanel({
            item: this.root
        });

        this._disposable.add(
            () => this._panel.destroy()
        );

        this._editor.setText(options.word);
        this._editorView.focus();

        this._rename$ = createObservable<Rename.RequestOptions>(observer => {
            this._renameObserver = observer;
            this._disposable.add(observer);
        }).share();
    }

    public get onRename() { return this._rename$; }

    private _rename() {
        if (this._renameObserver) {
            this._renameObserver.next(
                _.defaults(
                    { word: this._editor.getText() },
                    this._options)
            );
        }
        this.destroy();
    }

    public destroy() {
        this._editor.setText('');
        this.dispose();
    }
}
