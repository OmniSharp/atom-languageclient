/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { CompositeDisposable, DisposableBase } from 'ts-disposables';
import { alias, injectable } from '../services/_decorators';
import { IAtomTextEditorSource } from '../services/_public';
import { observeCallback } from '../helpers/index';

@injectable
@alias(IAtomTextEditorSource)
export class AtomTextEditorSource extends DisposableBase implements IAtomTextEditorSource {
    private _observeActiveTextEditor: Observable<Atom.TextEditor | null>;
    private _observeTextEditors: Observable<Atom.TextEditor>;
    private _subject = new  Subject<Atom.TextEditor>();

    constructor() {
        super();

        this._observeActiveTextEditor =
            Observable.merge(
                observeCallback(atom.workspace.observeActivePaneItem, atom.workspace)
                    .map(activeEditorCallback)
                    .share(),
                Observable.defer(() => Observable.of(activeEditorCallback(atom.workspace.getActivePaneItem())))
            );

        const editorAdded = observeCallback(atom.workspace.onDidAddTextEditor, atom.workspace)
            .mergeMap(({textEditor}) => {
                if (!textEditor.getPath()) {
                    return observeCallback(textEditor.onDidChangePath, textEditor)
                        .map(() => textEditor)
                        .filter(x => !!x)
                        .take(1);
                }

                return Observable.of(textEditor);
            })
            .do((editor) => {
                const cd = new CompositeDisposable();
                const next = _.bind(this._subject.next, this._subject, editor);
                cd.add(
                    editor.onDidChangeGrammar(next),
                    editor.onDidChangePath(next)
                );
                editor.onDidDestroy(() => {
                    cd.dispose();
                });
            })
            .share();

        this._observeTextEditors =
            Observable.merge(
                editorAdded,
                Observable.defer(() => Observable.from(atom.workspace.getTextEditors()))
            );
    }

    public get observeActiveTextEditor() { return this._observeActiveTextEditor; }
    public get observeTextEditors() { return this._observeTextEditors; }
}

const activeEditorCallback = (pane: any) => {
    if (pane && pane.getGrammar && pane.getPath) {
        return <Atom.TextEditor>pane;
    }
    return null;
};
