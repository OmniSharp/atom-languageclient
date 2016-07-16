/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { DisposableBase } from 'ts-disposables';
import { observeCallback } from '../helpers/index';

export interface IAtomTextEditorSource {
    observeActiveTextEditor: Observable<Atom.TextEditor | null>;
    observeTextEditors: Observable<Atom.TextEditor>;
}

const activeEditorCallback = (pane: any) => {
    if (pane && pane.getGrammar && pane.getPath) {
        return <Atom.TextEditor>pane;
    }
    return null;
};

@injectable
export class AtomTextEditorSource extends DisposableBase implements IAtomTextEditorSource {
    private _observeActiveTextEditor: Observable<Atom.TextEditor | null>;
    private _observeTextEditors: Observable<Atom.TextEditor>;

    constructor() {
        super();

        this._observeActiveTextEditor =
            Observable.merge(
                observeCallback(atom.workspace.observeActivePaneItem, atom.workspace)
                    .map(activeEditorCallback)
                    .share(),
                Observable.defer(() => Observable.of(activeEditorCallback(atom.workspace.getActivePaneItem())))
            );

        this._observeTextEditors =
            Observable.merge(
                observeCallback(
                    atom.workspace.onDidAddTextEditor, atom.workspace)
                    .mergeMap(editor => {
                        if (!editor.getPath()) {
                            return observeCallback(editor.onDidChange, editor)
                                .filter(x => !!x)
                                .take(1);
                        }

                        return Observable.of(editor);
                    })
                    .share(),
                Observable.defer(() => Observable.from(atom.workspace.getTextEditors()))
            );
    }

    public get observeActiveTextEditor() { return this._observeActiveTextEditor; }
    public get observeTextEditors() { return this._observeTextEditors; }
}
