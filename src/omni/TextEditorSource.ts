/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import {  DisposableBase } from 'ts-disposables';
import { observeCallback } from '../helpers/index';
import { GrammarService } from './GrammarService';
import { IOmniTextEditor } from './IOmniTextEditor';

export interface ITextEditorSource {
    observeActiveTextEditor(): Observable<IOmniTextEditor>;
    observeTextEditor(): Observable<IOmniTextEditor>;
}

@autoinject
export class TextEditorSource extends DisposableBase implements ITextEditorSource {
    private _grammarService: GrammarService;

    constructor(grammarService: GrammarService) {
        super();
    }

    public observeActiveTextEditor() {
        return observeCallback(atom.workspace.observeActivePaneItem, atom.workspace)
            .mergeMap((pane: any) => {
                if (pane && pane.getGrammar && pane.getPath && this._grammarService.isValid(pane.getGrammar())) {
                    return this._getServerForEditor(<Atom.TextEditor>pane);
                }
                return Observable.empty<IOmniTextEditor>();
            });
    }

    public observeTextEditor() {
        return observeCallback(atom.workspace.observeTextEditors, atom.workspace)
            .mergeMap(editor => {
                if (!editor.getPath()) {
                    return observeCallback(editor.onDidChange, editor)
                        .filter(x => !!x)
                        .take(1);
                }

                return Observable.of(editor);
            })
            .mergeMap(editor => this._getServerForEditor(editor));
    }

    private _getServerForEditor(textEditor: Atom.TextEditor): Observable<IOmniTextEditor> {
        return Observable.of(<any>textEditor);
    }
}
